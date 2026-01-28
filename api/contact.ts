// Vercel serverless function for contact form messages
import 'dotenv/config';
import { z } from 'zod';
import { getReceiverEmail, getSenderEmail, getSmtpConfig, sendEmail } from './email-utils.js';

const contactSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(1, 'Message is required'),
});

export default async function handler(req: any, res: any) {
  // Set Content-Type header early to ensure JSON responses
  res.setHeader('Content-Type', 'application/json');
  
  // Handle CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).json({});
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    console.log('📥 Received contact form request');
    const input = contactSchema.parse(req.body);
    const { firstName, lastName, email, subject, message } = input;
    console.log('✅ Contact form input validated');

    // Get receiver email from .env file (REQUIRED)
    // This is the ONLY source of truth for receiver email
    let targetEmail: string;
    try {
      targetEmail = getReceiverEmail();
    } catch (error) {
      console.error('NOTIFY_EMAIL not configured:', error);
      return res.status(500).json({
        success: false,
        message: 'Email service is not configured. Please contact the administrator.',
      });
    }

    const submittedAt = new Date().toISOString();

    // Prepare message body with all contact form details
    const messageText = [
      `New Contact Message`,
      ``,
      `Submitted At (UTC): ${submittedAt}`,
      ``,
      `From`,
      `- Name: ${firstName} ${lastName}`,
      `- Email: ${email}`,
      ``,
      `Subject`,
      `${subject}`,
      ``,
      `Message`,
      `${message}`,
      ``,
      `Reply`,
      `Reply to this email to respond directly to the sender (Reply-To: ${email}).`,
    ].join('\n');

    // Get SMTP configuration from .env
    const smtpConfig = getSmtpConfig();
    
    // Log configuration status (without exposing passwords)
    console.log('Email configuration check:', {
      hasHost: !!smtpConfig.host && smtpConfig.host !== 'HOST',
      hasUser: !!smtpConfig.user,
      hasPass: !!smtpConfig.pass,
      port: smtpConfig.port,
      secure: smtpConfig.secure,
      targetEmail: targetEmail,
    });

    const safeMessageHtml = String(message || '').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');

    // Prepare email content
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; padding: 24px;">
        <div style="border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden;">
          <div style="background: #ea580c; color: #ffffff; padding: 18px 20px;">
            <div style="font-size: 18px; font-weight: 700; margin: 0;">New Contact Message</div>
            <div style="font-size: 13px; opacity: 0.9; margin-top: 6px;">Swayog Energy • Website Contact Form</div>
          </div>

          <div style="padding: 18px 20px; background: #ffffff;">
            <div style="font-size: 13px; color: #6b7280; margin-bottom: 14px;">
              Submitted (UTC): <strong style="color:#111827;">${submittedAt}</strong>
            </div>

            <div style="border: 1px solid #f1f5f9; border-radius: 12px; padding: 14px; background: #f9fafb;">
              <div style="font-weight: 700; margin-bottom: 10px; color:#111827;">Sender</div>
              <table style="width: 100%; border-collapse: collapse; font-size: 14px; color:#111827;">
                <tr><td style="padding: 6px 0; color:#6b7280; width: 140px;">Name</td><td style="padding: 6px 0;"><strong>${firstName} ${lastName}</strong></td></tr>
                <tr><td style="padding: 6px 0; color:#6b7280;">Email</td><td style="padding: 6px 0;"><a href="mailto:${email}" style="color:#0f766e; text-decoration:none;">${email}</a></td></tr>
                <tr><td style="padding: 6px 0; color:#6b7280;">Subject</td><td style="padding: 6px 0;">${subject}</td></tr>
              </table>
            </div>

            <div style="margin-top: 14px; border: 1px solid #e5e7eb; border-radius: 12px; padding: 14px;">
              <div style="font-weight: 700; margin-bottom: 10px; color:#111827;">Message</div>
              <div style="font-size: 14px; line-height: 1.55; color:#111827;">${safeMessageHtml}</div>
            </div>

            <div style="margin-top: 14px; border-top: 1px dashed #e5e7eb; padding-top: 14px;">
              <div style="font-weight: 700; margin-bottom: 6px; color:#111827;">Reply to this message</div>
              <div style="font-size: 14px; color:#374151; line-height: 1.5;">
                Simply <strong>reply to this email</strong> — it will go to <a href="mailto:${email}" style="color:#0f766e; text-decoration:none;">${email}</a> (Reply-To is set).
              </div>
            </div>
          </div>
        </div>

        <div style="font-size: 12px; color: #6b7280; margin-top: 14px;">
          Sent from Swayog Energy website contact form.
        </div>
      </div>
    `;

    try {
      // Get sender email from .env (EMAIL_USER)
      const senderEmail = getSenderEmail();
      console.log('📧 Preparing to send contact form email...');
      
      // Send email using shared utility
      await sendEmail({
        to: targetEmail, // Receiver: NOTIFY_EMAIL from .env
        from: senderEmail, // Sender: EMAIL_USER from .env (e.g., harshaltapre23@gmail.com)
        replyTo: email, // User's email for reply
        subject: `Contact Message — ${subject}`,
        text: messageText,
        html: emailHtml,
      });

      console.log('✅ Contact form email sent successfully');
      return res.status(200).json({ 
        success: true, 
        message: 'Message sent successfully' 
      });
    } catch (emailErr: any) {
      const errorDetails = {
        error: emailErr.message,
        code: emailErr.code,
        response: emailErr.response,
        command: emailErr.command,
        responseCode: emailErr.responseCode,
      };
      console.error('Failed to send email notification:', errorDetails);
      console.error('Full error object:', JSON.stringify(errorDetails, null, 2));
      
      // Return error to user so they know it failed
      let userMessage = 'Failed to send email. Please try again later or contact us directly.';
      
      // Provide more helpful error messages
      if (emailErr.code === 'EAUTH') {
        userMessage = 'Email authentication failed. Please check your email credentials in the .env file.';
      } else if (emailErr.code === 'ETIMEDOUT' || emailErr.code === 'ECONNECTION') {
        userMessage = 'Connection to email server failed. Please check your internet connection and SMTP settings.';
      } else if (emailErr.message) {
        userMessage = `Email sending failed: ${emailErr.message}`;
      }
      
      return res.status(500).json({ 
        success: false,
        message: userMessage,
      });
    }
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: err.errors[0].message,
        field: err.errors[0].path.join('.'),
      });
    }
    console.error('Error processing contact form:', err);
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
}
