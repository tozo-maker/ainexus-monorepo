import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import WelcomeEmail from '@/emails/WelcomeEmail';
import DailyDigestEmail from '@/emails/DailyDigestEmail';
import PricingAlertEmail from '@/emails/PricingAlertEmail';
import * as React from 'react';

// Use a fallback key for testing so it doesn't crash if omitted in local dev
const resend = new Resend(process.env.RESEND_API_KEY || 're_123456789');

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const template = searchParams.get('template') || 'welcome';
    const email = searchParams.get('email') || 'test@example.com';

    let emailComponent;
    let subject;

    switch (template) {
        case 'welcome':
            emailComponent = WelcomeEmail({ userFirstName: 'Alex' });
            subject = 'Welcome to AINexus!';
            break;
        case 'digest':
            emailComponent = DailyDigestEmail({});
            subject = 'Your AINexus Daily Digest';
            break;
        case 'pricing':
            emailComponent = PricingAlertEmail({});
            subject = 'Pricing Alert: Midjourney changed their tier';
            break;
        default:
            return NextResponse.json({ error: 'Invalid template specified' }, { status: 400 });
    }

    try {
        console.log(`Attempting to send ${template} email to ${email}`);

        // If no real Resend key is configured, just mock the success for verification
        if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'your_resend_api_key_here') {
            return NextResponse.json({
                success: true,
                mocked: true,
                message: `Mock sending ${template} template. Configure RESEND_API_KEY to send real emails.`
            });
        }

        const data = await resend.emails.send({
            from: 'AINexus <onboarding@resend.dev>', // Resend's default testing domain
            to: [email],
            subject: subject,
            react: emailComponent as React.ReactElement,
        });

        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
