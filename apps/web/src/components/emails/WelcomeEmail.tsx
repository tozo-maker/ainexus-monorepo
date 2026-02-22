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
} from "@react-email/components";
import * as React from "react";

interface WelcomeEmailProps {
    userFirstName?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://ainexus.dev";

export const WelcomeEmail = ({
    userFirstName = "Creator",
}: WelcomeEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>Welcome to AINexus! The ultimate AI directory.</Preview>
            <Tailwind>
                <Body className="bg-slate-50 my-auto mx-auto font-sans px-2">
                    <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px] bg-white">
                        <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                            Welcome to <strong>AINexus</strong>, {userFirstName}!
                        </Heading>
                        <Text className="text-black text-[14px] leading-[24px]">
                            We're thrilled to have you here. AINexus is your central hub for exploring, comparing, and tracking the best AI tools and resources available.
                        </Text>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Here's what you can do right now:
                        </Text>
                        <Section className="pl-4">
                            <Text className="m-0 mb-2 text-[14px]">⭐ <strong>Save Tools:</strong> Build your personalized stack of favorite AI products.</Text>
                            <Text className="m-0 mb-2 text-[14px]">🔔 <strong>Set Alerts:</strong> Get notified when a tool changes its pricing.</Text>
                            <Text className="m-0 mb-2 text-[14px]">📝 <strong>Write Reviews:</strong> Share your experience and help others decide.</Text>
                        </Section>
                        <Section className="text-center mt-[32px] mb-[32px]">
                            <Button
                                className="bg-blue-600 rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                                href={`${baseUrl}/dashboard`}
                            >
                                Go to Your Dashboard
                            </Button>
                        </Section>
                        <Text className="text-black text-[14px] leading-[24px]">
                            If you have any questions, simply reply to this email. We're always here to help.
                        </Text>
                        <Text className="text-[#666666] text-[12px] leading-[24px] text-center mt-8">
                            © {new Date().getFullYear()} AINexus. All rights reserved.
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default WelcomeEmail;
