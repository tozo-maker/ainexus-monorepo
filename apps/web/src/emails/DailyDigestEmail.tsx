import { Html, Head, Preview, Body, Container, Section, Text, Heading, Hr, Link } from '@react-email/components';
import * as React from 'react';

interface DigestProps {
    date?: string;
    news?: Array<{ title: string; url: string; source: string }>;
    tools?: Array<{ name: string; url: string; description: string; tag: string }>;
}

export const DailyDigestEmail = ({
    date = new Date().toLocaleDateString(),
    news = [
        { title: 'OpenAI Releases GPT-4.5 Turbo', url: 'https://techcrunch.com', source: 'TechCrunch' },
        { title: 'Cursor Hits 1M Daily Active Developers', url: 'https://venturebeat.com', source: 'VentureBeat' }
    ],
    tools = [
        { name: 'Suno v4', url: 'https://suno.ai', description: 'Create full songs from text prompts.', tag: 'Trending' },
        { name: 'Kling AI 1.5', url: 'https://kling.ai', description: 'Hyper-realistic video generation.', tag: 'New' }
    ]
}: DigestProps) => (
    <Html>
        <Head />
        <Preview>Your AINexus Daily Digest for {date}</Preview>
        <Body style={main}>
            <Container style={container}>
                <Section style={box}>
                    <Heading style={h1}>AI Daily Digest</Heading>
                    <Text style={dateText}>{date}</Text>

                    <Hr style={hr} />

                    <Heading style={h2}>Top Headlines</Heading>
                    {news.map((item, i) => (
                        <Section key={i} style={itemBlock}>
                            <Link href={item.url} style={linkTitle}>{item.title}</Link>
                            <Text style={metaText}>{item.source}</Text>
                        </Section>
                    ))}

                    <Hr style={hr} />

                    <Heading style={h2}>Trending Tools</Heading>
                    {tools.map((tool, i) => (
                        <Section key={i} style={itemBlock}>
                            <Text style={toolHeader}>
                                <Link href={tool.url} style={linkTitle}>{tool.name}</Link>
                                <span style={tagStyle}>{tool.tag}</span>
                            </Text>
                            <Text style={descText}>{tool.description}</Text>
                        </Section>
                    ))}

                    <Hr style={hr} />
                    <Text style={footer}>
                        To manage your digest preferences, visit your account settings.
                    </Text>
                </Section>
            </Container>
        </Body>
    </Html>
);

const main = {
    backgroundColor: '#f6f9fc',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
    backgroundColor: '#ffffff',
    margin: '0 auto',
    padding: '20px 0 48px',
    marginBottom: '64px',
};

const box = {
    padding: '0 48px',
};

const h1 = {
    color: '#333',
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '0',
};

const dateText = {
    color: '#8898aa',
    fontSize: '14px',
    marginTop: '4px',
    marginBottom: '24px',
};

const h2 = {
    color: '#555',
    fontSize: '18px',
    fontWeight: 'bold',
    marginTop: '24px',
    marginBottom: '16px',
};

const hr = {
    borderColor: '#e6ebf1',
    margin: '20px 0',
};

const itemBlock = {
    marginBottom: '16px',
};

const linkTitle = {
    color: '#5469d4',
    fontSize: '16px',
    fontWeight: 'bold',
    textDecoration: 'none',
};

const metaText = {
    color: '#8898aa',
    fontSize: '12px',
    margin: '4px 0 0',
};

const toolHeader = {
    margin: '0 0 4px',
};

const tagStyle = {
    backgroundColor: '#e3f2fd',
    color: '#1e88e5',
    fontSize: '12px',
    fontWeight: 'bold',
    padding: '2px 8px',
    borderRadius: '12px',
    marginLeft: '8px',
};

const descText = {
    color: '#525f7f',
    fontSize: '14px',
    margin: '0',
    lineHeight: '20px',
};

const footer = {
    color: '#8898aa',
    fontSize: '12px',
    lineHeight: '16px',
};

export default DailyDigestEmail;
