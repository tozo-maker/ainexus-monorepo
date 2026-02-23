import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "AI Intent Search | AINexus",
    description: "Describe what you're trying to achieve in plain English, and our AI intent engine will find the perfect tools for your needs.",
    openGraph: {
        title: "AI Intent Search by AINexus",
        description: "Find the right AI tools by describing your goal.",
        type: "website",
    }
};

export default function FindLayout({ children }: { children: React.ReactNode }) {
    return children;
}
