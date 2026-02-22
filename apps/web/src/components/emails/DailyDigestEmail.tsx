import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Section,
    Text,
    Link,
    Tailwind,
    Hr,
} from "@react-email/components";
import * as React from "react";

interface NewsItem {
    id: string;
    title: string;
    url: string;
    source: string;
}

interface ToolItem {
    slug: string;
    name: string;
    tagline: string;
}

interface DailyDigestEmailProps {
    date?: string;
    news?: NewsItem[];
    tools?: ToolItem[];
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://ainexus.dev";

export const DailyDigestEmail = ({
    date = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
    news = [
        { id: "1", title: "OpenAI releases new reasoning model", url: "#", source: "TechCrunch" },
        { id: "2", title: "Anthropic introduces Claude 3.5 Sonnet", url: "#", source: "The Verge" },
    ],
    tools = [
        { slug: "cursor", name: "Cursor", tagline: "The AI-first Code Editor" },
        { slug: "midjourney", name: "Midjourney", tagline: "Advanced text-to-image AI" },
    ],
}: DailyDigestEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>Your AINexus Daily Digest for {date}</Preview>
            <Tailwind>
                <Body className="bg-slate-50 my-auto mx-auto font-sans px-2">
                    <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[500px] bg-white">
                        <Heading className="text-black text-[22px] font-bold text-center p-0 my-[20px] mx-0">
                            AINexus Daily Digest
                        </Heading>
                        <Text className="text-[#666666] text-[14px] text-center mb-[30px]">
                            {date}
                        </Text>

                        <Section className="mb-[30px]">
                            <Heading as="h2" className="text-[18px] font-semibold text-slate-800 mb-[16px]">
                                📰 Top AI News
                            </Heading>
                            {news.map((item) => (
                                <div key={item.id} className="mb-4">
                                    <Text className="text-[15px] leading-[22px] font-medium text-blue-600 m-0">
                                        <Link href={item.url} className="text-blue-600 no-underline">
                                            {item.title}
                                        </Link>
                                    </Text>
                                    <Text className="text-[12px] text-slate-500 m-0 mt-1">
                                        Via {item.source}
                                    </Text>
                                </div>
                            ))}
                        </Section>

                        <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />

                        <Section className="mb-[30px]">
                            <Heading as="h2" className="text-[18px] font-semibold text-slate-800 mb-[16px]">
                                🔥 Trending Tools
                            </Heading>
                            {tools.map((tool) => (
                                <div key={tool.slug} className="mb-4 bg-slate-50 p-3 rounded border border-slate-100">
                                    <Text className="text-[15px] font-bold m-0 text-slate-900">
                                        <Link href={`${baseUrl}/ai-tools/${tool.slug}`} className="text-slate-900 no-underline hover:text-blue-600">
                                            {tool.name}
                                        </Link>
                                    </Text>
                                    <Text className="text-[13px] text-slate-600 m-0 mt-1">
                                        {tool.tagline}
                                    </Text>
                                </div>
                            ))}
                        </Section>

                        <Text className="text-[#666666] text-[12px] leading-[24px] text-center mt-10">
                            You are receiving this because you subscribed to the Daily Digest on AINexus.<br />
                            <Link href={`${baseUrl}/dashboard/settings`} className="text-blue-600 underline">Manage your preferences</Link>
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default DailyDigestEmail;
