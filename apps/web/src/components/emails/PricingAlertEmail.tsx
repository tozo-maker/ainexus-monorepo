import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Section,
    Text,
    Button,
    Tailwind,
    Row,
    Column,
} from "@react-email/components";
import * as React from "react";

interface PricingAlertEmailProps {
    toolName?: string;
    toolSlug?: string;
    oldPricing?: string;
    newPricing?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://ainexus.dev";

export const PricingAlertEmail = ({
    toolName = "Cursor",
    toolSlug = "cursor",
    oldPricing = "Free tier available",
    newPricing = "Starts at $20/month",
}: PricingAlertEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>Pricing change alert for {toolName}</Preview>
            <Tailwind>
                <Body className="bg-slate-50 my-auto mx-auto font-sans px-2">
                    <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px] bg-white">
                        <Text className="text-[12px] font-bold tracking-wider text-slate-500 uppercase mb-2">
                            ⚠️ Pricing Alert
                        </Text>
                        <Heading className="text-black text-[22px] font-bold p-0 mb-[24px] mx-0">
                            {toolName} has changed its pricing
                        </Heading>

                        <Text className="text-black text-[14px] leading-[24px] mb-[24px]">
                            You are receiving this alert because you subscribed to updates for <strong>{toolName}</strong> on AINexus.
                        </Text>

                        <Section className="bg-slate-50 rounded-lg p-[16px] mb-[32px] border border-slate-100">
                            <Row>
                                <Column className="w-[50%] pr-2">
                                    <Text className="text-[12px] font-semibold text-slate-500 uppercase m-0 mb-1">
                                        Previous Tag
                                    </Text>
                                    <Text className="text-[14px] line-through text-slate-400 m-0">
                                        {oldPricing}
                                    </Text>
                                </Column>
                                <Column className="w-[50%] pl-2 border-l border-slate-200">
                                    <Text className="text-[12px] font-semibold text-blue-600 uppercase m-0 mb-1">
                                        New Tag
                                    </Text>
                                    <Text className="text-[14px] font-bold text-slate-900 m-0">
                                        {newPricing}
                                    </Text>
                                </Column>
                            </Row>
                        </Section>

                        <Section className="text-center mb-[32px]">
                            <Button
                                className="bg-blue-600 rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                                href={`${baseUrl}/ai-tools/${toolSlug}`}
                            >
                                View Details on AINexus
                            </Button>
                        </Section>

                        <Text className="text-[#666666] text-[12px] leading-[24px] mt-[32px]">
                            To stop receiving these alerts, you can manage your notifications in your dashboard.
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default PricingAlertEmail;
