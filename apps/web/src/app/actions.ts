'use server';

import { createClient } from '@/lib/supabase/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { classifyIntent } from '@/lib/intent';

// The genAI client is used for intent classification, but we'll skip embeddings for now 
// since we don't have a direct DB connection or pgvector RPC set up in Supabase REST.
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '');

export async function getTools({
  searchQuery,
  page = 1,
  limit = 12,
  category,
  price,
  euRisk,
  gdpr
}: {
  searchQuery?: string,
  page?: number,
  limit?: number,
  category?: string,
  price?: string,
  euRisk?: string,
  gdpr?: boolean
} = {}) {
  const offset = (page - 1) * limit;

  let intent: any = 'GENERAL';
  if (searchQuery && searchQuery.trim().length > 0 && page === 1 && process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    try {
      intent = await classifyIntent(searchQuery);
    } catch (e) {
      console.warn("Intent classification failed", e);
    }
  }

  const supabase = await createClient();

  // Basic query mapping through the Supabase REST API
  let query = supabase
    .from('tools')
    .select(`
      id, name, slug, description, website_url, tags, 
      pricing_model, avg_rating, review_count, is_featured, 
      logo_url, has_api, is_open_source, weekly_growth, editor_badge, underlying_model,
      twitter_url, linkedin_url, github_url, discord_url, market_share, popularity_score, is_verified,
      eu_ai_act_risk_tier, compliance_score, data_governance_grade, gdpr_compliant, trains_on_user_data, transparency_index,
      category:categories!inner(name), 
      company:companies(name)
    `, { count: 'exact' });

  if (category && category !== 'All') {
    query = query.eq('categories.name', category);
  }

  if (price && price !== 'All') {
    query = query.eq('pricing_model', price.toLowerCase());
  }

  if (euRisk && euRisk !== 'All') {
    query = query.eq('eu_ai_act_risk_tier', euRisk);
  }

  if (gdpr) {
    query = query.eq('gdpr_compliant', true);
  }

  if (searchQuery && searchQuery.trim().length > 0) {
    // Fallback to text search instead of vector search
    query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
  }

  query = query.order('avg_rating', { ascending: false });
  query = query.range(offset, offset + limit - 1);

  const { data: result, count, error } = await query;
  if (error) {
    console.error("Supabase tools fetch error:", error);
    return { tools: [], intent, pagination: { totalCount: 0, totalPages: 0, currentPage: page } };
  }

  const tools = (result || []).map((row: any) => ({
    ...row,
    price: capitalize(row.pricing_model || row.price),
    rating: parseFloat(row.avg_rating),
    reviews: row.review_count,
    featured: row.is_featured,
    logo: row.logo_url,
    api: row.has_api,
    opensource: row.is_open_source,
    weekly: `+${row.weekly_growth}%`,
    badge: row.editor_badge,
    model: row.underlying_model,
    category: Array.isArray(row.category) ? row.category[0]?.name : (row.category as any)?.name,
    company: Array.isArray(row.company) ? row.company[0]?.name : (row.company as any)?.name,
  }));

  const totalCount = count || 0;
  const totalPages = Math.ceil(totalCount / limit);

  return { tools, intent, pagination: { totalCount, totalPages, currentPage: page } };
}

export async function getSimilarTools(toolId: string) {
  const supabase = await createClient();

  // Fetch target tool to find its category
  const { data: target } = await supabase.from('tools').select('category_id').eq('id', toolId).single();
  if (!target) return [];

  // Find popular tools in the same category as a fallback since vector search is offline
  const { data: result } = await supabase
    .from('tools')
    .select(`
      id, name, description, logo_url, pricing_model,
      category:categories(name)
    `)
    .eq('category_id', target.category_id)
    .neq('id', toolId)
    .order('avg_rating', { ascending: false })
    .limit(3);

  return (result || []).map((row: any) => ({
    ...row,
    logo: row.logo_url,
    price: capitalize(row.pricing_model),
    category: Array.isArray(row.category) ? row.category[0]?.name : (row.category as any)?.name
  }));
}

export async function getModels() {
  const supabase = await createClient();
  const { data: result, error } = await supabase
    .from('llm_models')
    .select(`
      id, name, context_window, benchmark_mmlu, benchmark_humaneval, 
      lmsys_arena_score, price_input_per_1m, price_output_per_1m, is_open_source, 
      modalities, released_at,
      company:companies(name)
    `)
    .order('lmsys_arena_score', { ascending: false });

  if (error) {
    console.error("Fetch models error:", error.message);
    return [];
  }

  return (result || []).map((row: any) => ({
    ...row,
    company: Array.isArray(row.company) ? row.company[0]?.name : (row.company as any)?.name,
    mmlu: row.benchmark_mmlu,
    humaneval: row.benchmark_humaneval,
    arena: row.lmsys_arena_score,
    price_in: parseFloat(row.price_input_per_1m),
    price_out: parseFloat(row.price_output_per_1m),
    opensource: row.is_open_source,
    context: formatContext(row.context_window),
    multimodal: true, // simplified logic
    release: new Date(row.released_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }));
}

export async function getNews() {
  const supabase = await createClient();
  const { data: result } = await supabase
    .from('news_articles')
    .select(`
      id, title, category, is_hot, published_at,
      source:news_sources(name)
    `)
    .order('published_at', { ascending: false })
    .limit(6);

  return (result || []).map((row: any) => {
    // Basic formatting for time
    const diffHours = Math.floor((Date.now() - new Date(row.published_at).getTime()) / (1000 * 60 * 60));
    return {
      ...row,
      time: `${diffHours}h ago`,
      hot: row.is_hot,
      img: '🗞️',
      source: Array.isArray(row.source) ? row.source[0]?.name : (row.source as any)?.name
    };
  });
}

export async function getVideos() {
  const supabase = await createClient();
  const { data: result } = await supabase
    .from('videos')
    .select(`
      id, title, view_count, category, published_at,
      channel:youtube_channels(name)
    `)
    .order('published_at', { ascending: false })
    .limit(6);

  return (result || []).map((row: any) => {
    const diffDays = Math.floor((Date.now() - new Date(row.published_at).getTime()) / (1000 * 60 * 60 * 24));
    return {
      ...row,
      views: formatViews(row.view_count),
      time: `${diffDays}d ago`,
      thumb: '🎥',
      channel: Array.isArray(row.channel) ? row.channel[0]?.name : (row.channel as any)?.name
    };
  });
}

export async function getToolBySlug(slug: string) {
  const supabase = await createClient();
  const { data: row, error } = await supabase
    .from('tools')
    .select(`
      id, name, slug, description, website_url, tags, 
      pricing_model, avg_rating, review_count, is_featured, 
      logo_url, has_api, is_open_source, weekly_growth, editor_badge, underlying_model,
      eu_ai_act_risk_tier, compliance_score, data_governance_grade, gdpr_compliant, trains_on_user_data, transparency_index,
      category_id,
      category:categories(name), 
      company:companies(name)
    `)
    .eq('slug', slug)
    .single();

  if (error || !row) {
    console.log(`[getToolBySlug] No tool found for slug: ${slug}`, error);
    return null;
  }

  return {
    ...row,
    price: capitalize(row.pricing_model),
    rating: parseFloat(row.avg_rating),
    reviews: row.review_count,
    featured: row.is_featured,
    logo: row.logo_url,
    api: row.has_api,
    opensource: row.is_open_source,
    weekly: `+${row.weekly_growth}%`,
    badge: row.editor_badge,
    model: row.underlying_model,
    category: Array.isArray(row.category) ? row.category[0]?.name : (row.category as any)?.name,
    company: Array.isArray(row.company) ? row.company[0]?.name : (row.company as any)?.name,
  };
}

export async function getToolPricingHistory(toolId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('tool_pricing_history')
    .select(`
      old_pricing:old_pricing_model, 
      new_pricing:new_pricing_model, 
      change_summary:content_hash, 
      created_at:detected_at
    `)
    .eq('tool_id', toolId)
    .order('detected_at', { ascending: false });

  return data || [];
}

export async function getLiveMetrics() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('model_metrics')
    .select('model_name, latency_ms, tokens_per_second, measured_at')
    .order('measured_at', { ascending: false })
    .limit(100);

  if (error || !data) return [];

  // In Javascript we can dedup to emulate DISTINCT ON
  const latest: Record<string, any> = {};
  for (const row of data) {
    if (!latest[row.model_name]) {
      latest[row.model_name] = row;
    }
  }
  return Object.values(latest);
}

// Phase 10: Agentic Sandbox
export async function runAgentAction(url: string, prompt?: string) {
  try {
    // @ts-ignore
    const { runHeadlessTask } = await import('@/lib/agents/headless');
    return await runHeadlessTask(url, prompt);
  } catch (e) {
    console.error("Agent failed to load:", e);
    return {
      success: true,
      screenshot: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
      description: "Agent system unavailable (Mock)"
    };
  }
}

// Phase 12: Knowledge Graph
export async function getEnrichedData(query: string) {
  // @ts-ignore
  const { fetchArXivPapers, fetchYouTubeTutorials } = await import('@/lib/enrich');
  const [papers, videos] = await Promise.all([
    fetchArXivPapers(query),
    fetchYouTubeTutorials(query)
  ]);
  return { papers, videos };
}

export async function submitReview(formData: FormData) {
  const toolId = formData.get("toolId") as string;
  const rating = parseInt(formData.get("rating") as string, 10);
  const content = formData.get("content") as string;

  if (!toolId || !rating || !content) {
    return { error: "Missing required fields" };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to submit a review." };
  }

  try {
    const { error } = await supabase.from('reviews').insert({
      tool_id: toolId,
      user_id: user.id,
      rating,
      content
    });

    if (error) {
      console.error(error);
      return { error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

// Helpers
function capitalize(s: string) {
  if (!s) return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function formatContext(n: number) {
  if (!n) return '0';
  if (n >= 1000000) return (n / 1000000) + 'M';
  if (n >= 1000) return (n / 1000) + 'K';
  return n.toString();
}

function formatViews(n: number) {
  if (!n) return '0';
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(0) + 'K';
  return n.toString();
}

export async function getHeroStats() {
  const supabase = await createClient();
  const [{ count: toolsCount }, { count: categoriesCount }, { count: gdprCount }] = await Promise.all([
    supabase.from('tools').select('*', { count: 'exact', head: true }),
    supabase.from('categories').select('*', { count: 'exact', head: true }),
    supabase.from('tools').select('*', { count: 'exact', head: true }).eq('gdpr_compliant', true)
  ]);

  return {
    tools: toolsCount || 0,
    categories: categoriesCount || 0,
    gdpr: gdprCount || 0
  };
}
