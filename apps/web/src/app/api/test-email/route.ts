import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { WelcomeEmail } from '@/emails/WelcomeEmail';
import { PricingAlertEmail } from '@/emails/PricingAlertEmail';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        if (!process.env.RESEND_API_KEY) {
            return NextResponse.json({ error: "Missing RESEND_API_KEY environment variable" }, { status: 500 });
        }

        const resend = new Resend(process.env.RESEND_API_KEY);
        const { emailType, userEmail, userName, toolName, updateType, details } = await request.json();

        if (!userEmail) {
            return NextResponse.json({ error: "Missing required field: userEmail" }, { status: 400 });
        }

        let subject = "";
        let reactComponent;

        if (emailType === "welcome") {
            subject = "Welcome to AI Nexus - The Bloomberg Terminal for AI";
            reactComponent = WelcomeEmail({ userFirstName: userName || "Explorer" });
        } else if (emailType === "pricing_alert") {
            subject = `Intelligence Alert: ${toolName || "Tool"} - ${updateType || "Update"}`;
            reactComponent = PricingAlertEmail({
                toolName: toolName,
                updateType: updateType,
                details: details
            });
        } else {
            return NextResponse.json({ error: "Invalid emailType. Use 'welcome' or 'pricing_alert'." }, { status: 400 });
        }

        const { data, error } = await resend.emails.send({
            from: 'AI Nexus <onboarding@resend.dev>', // Update this to your verified domain later
            to: [userEmail],
            subject: subject,
            react: reactComponent,
        });

        if (error) {
            return NextResponse.json({ error }, { status: 400 });
        }

        return NextResponse.json({ success: true, data });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
