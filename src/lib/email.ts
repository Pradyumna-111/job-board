import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({ to, subject, html }: { to: string, subject: string, html: string }) {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Job Board <onboarding@resend.dev>',
            to,
            subject,
            html,
        });

        if (error) {
            console.error('Resend error:', error);
            return { error };
        }

        return { data };
    } catch (error) {
        console.error('Email send error:', error);
        return { error };
    }
}
