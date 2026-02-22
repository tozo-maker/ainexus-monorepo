import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Link,
    Preview,
    Section,
    Text,
    Hr,
} from "@react-email/components";
import * as React from "react";

interface PricingAlertEmailProps {
    toolName?: string;
    toolUrl?: string;
    updateType?: "Pricing Change" | "New Feature" | "API Update";
    details?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ainexus.com";

export const PricingAlertEmail = ({
    toolName = "Cursor",
    toolUrl = "/tool/cursor",
    updateType = "Pricing Change",
    details = "A new 'Pro Plus' tier was added at $40/mo, offering unlimited Claude 3.5 Sonnet access.",
}: PricingAlertEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>Intelligence Alert: {toolName} - {updateType}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={header}>
                        <Text style={logoText}>AI NEXUS</Text>
                        <Text style={badgeLabel}>INTELLIGENCE ALERT</Text>
                    </Section>

                    <Heading style={h1}>Update detected for {toolName}</Heading>

                    <Text style={text}>
                        Our automated crawlers have detected a critical update for a tool in your watchlist.
                    </Text>

                    <Section style={alertBox}>
                        <Text style={alertType}>{updateType}</Text>
                        <Text style={alertDetails}>{details}</Text>
                    </Section>

                    <Section style={btnContainer}>
                        <Link style={button} href={`${baseUrl}${toolUrl}`}>
                            View Full Analysis
                        </Link>
                    </Section>

                    <Hr style={hr} />

                    <Text style={footer}>
                        You received this email because {toolName} is in your AI Nexus watchlist.
                        <br />
                        Manage your notifications in your <Link href={`${baseUrl}/settings`} style={link}>Dashboard</Link>.
                    </Text>
                </Container>
            </Body>
        </Html>
    );
};

export default PricingAlertEmail;

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
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #e2e8f0",
    paddingBottom: "20px",
    marginBottom: "30px",
};

const logoText = {
    fontSize: "20px",
    fontWeight: "800",
    letterSpacing: "-1px",
    color: "#111827",
    margin: "0",
};

const badgeLabel = {
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "1px",
    color: "#ef4444",
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    padding: "4px 8px",
    borderRadius: "6px",
    margin: "0",
    textTransform: "uppercase" as const,
};

const h1 = {
    color: "#111827",
    fontSize: "24px",
    fontWeight: "800",
    margin: "0 0 20px 0",
    lineHeight: "1.2",
    letterSpacing: "-0.5px",
};

const text = {
    color: "#4b5563",
    fontSize: "16px",
    lineHeight: "1.6",
    margin: "0 0 20px 0",
};

const alertBox = {
    backgroundColor: "rgba(79, 70, 229, 0.05)",
    border: "1px solid rgba(79, 70, 229, 0.2)",
    borderRadius: "12px",
    padding: "24px",
    margin: "24px 0",
};

const alertType = {
    color: "#4f46e5",
    fontSize: "12px",
    fontWeight: "800",
    textTransform: "uppercase" as const,
    letterSpacing: "1px",
    margin: "0 0 8px 0",
};

const alertDetails = {
    color: "#111827",
    fontSize: "16px",
    lineHeight: "1.5",
    fontWeight: "500",
    margin: "0",
};

const btnContainer = {
    textAlign: "center" as const,
    marginTop: "12px",
    marginBottom: "12px",
};

const button = {
    backgroundColor: "#111827",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "15px",
    fontWeight: "600",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "inline-block",
    padding: "12px 24px",
};

const hr = {
    borderColor: "#e2e8f0",
    margin: "32px 0 24px",
};

const footer = {
    color: "#6b7280",
    fontSize: "13px",
    lineHeight: "1.5",
    margin: "0",
};

const link = {
    color: "#4f46e5",
    textDecoration: "underline",
};
