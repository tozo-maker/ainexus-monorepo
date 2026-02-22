import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text,
} from "@react-email/components";
import * as React from "react";

interface WelcomeEmailProps {
    userFirstName?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ainexus.com";

export const WelcomeEmail = ({ userFirstName = "Explorer" }: WelcomeEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>Welcome to AI Nexus - The Bloomberg Terminal for AI</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={header}>
                        <Text style={logoText}>AI NEXUS</Text>
                    </Section>

                    <Heading style={h1}>Welcome aboard, {userFirstName}.</Heading>

                    <Text style={text}>
                        You now have access to the most comprehensive and rapidly updating intelligence directory in the AI ecosystem.
                    </Text>
                    <Text style={text}>
                        Whether you are looking for the latest LLM benchmarks, tracking newly funded AI startups, or comparing open-source frameworks, AI Nexus is built to be your single source of truth.
                    </Text>

                    <Section style={btnContainer}>
                        <Link style={button} href={`${baseUrl}`}>
                            Open the Directory
                        </Link>
                    </Section>

                    <Text style={text}>
                        If you have any questions or feature requests, simply reply to this email. We move fast and build things people actually want.
                    </Text>

                    <Text style={footer}>
                        — The AI Nexus Engineering Team
                    </Text>
                </Container>
            </Body>
        </Html>
    );
};

export default WelcomeEmail;

const main = {
    backgroundColor: "#f6f9fc",
    fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
    maxWidth: "600px",
};

const header = {
    paddingBottom: "20px",
    borderBottom: "1px solid #e2e8f0",
    marginBottom: "30px",
};

const logoText = {
    fontSize: "24px",
    fontWeight: "800",
    letterSpacing: "-1px",
    color: "#111827",
    margin: "0",
};

const h1 = {
    color: "#111827",
    fontSize: "28px",
    fontWeight: "800",
    margin: "0 0 20px 0",
    padding: "0",
    lineHeight: "1.2",
    letterSpacing: "-0.5px",
};

const text = {
    color: "#4b5563",
    fontSize: "16px",
    lineHeight: "1.6",
    margin: "0 0 24px 0",
};

const btnContainer = {
    textAlign: "center" as const,
    marginTop: "32px",
    marginBottom: "32px",
};

const button = {
    backgroundColor: "#4f46e5", // Accent color from light premium theme
    borderRadius: "8px",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "600",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "inline-block",
    padding: "14px 28px",
};

const footer = {
    color: "#6b7280",
    fontSize: "14px",
    borderTop: "1px solid #e2e8f0",
    paddingTop: "24px",
    marginTop: "24px",
};
