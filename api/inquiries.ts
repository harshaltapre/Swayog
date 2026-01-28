// Vercel serverless function for inquiries API
import 'dotenv/config';
import { api } from '../shared/routes.js';
import { storage } from './storage-utils.js';
import { z } from 'zod';
import { getReceiverEmail, getSenderEmail, getSmtpConfig, sendEmail } from './email-utils.js';

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
    console.log('📥 Received inquiry request:', { body: req.body });
    const input = api.inquiries.create.input.parse(req.body);
    console.log('✅ Input validated successfully');
    
    const inquiry = await storage.createInquiry(input);
    console.log('✅ Inquiry saved to database:', { id: inquiry.id, name: inquiry.name });

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

    // Prepare message content
    const messageText = [
      `New Quotation / Inquiry Registered`,
      ``,
      `Submitted At (UTC): ${submittedAt}`,
      `Inquiry ID: ${inquiry.id}`,
      ``,
      `Customer Details`,
      `- Name: ${inquiry.name}`,
      `- Email: ${inquiry.email}`,
      `- Phone: ${inquiry.phone}`,
      `- Consumer ID: ${inquiry.customerNo || 'N/A'}`,
      `- Project Type: ${inquiry.projectType}`,
      ``,
      `Message`,
      `${inquiry.message}`,
      ``,
      `Consent`,
      `- Terms & Conditions Accepted: ${inquiry.termsAccepted ? 'Yes' : 'No'}`,
      ``,
      `Reply`,
      `Reply to this email to respond directly to the customer (Reply-To: ${inquiry.email}).`,
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

    const safeMessageHtml = String(inquiry.message || '').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');

    // Prepare email HTML
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; padding: 24px;">
        <div style="border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden;">
          <div style="background: #ea580c; color: #ffffff; padding: 18px 20px;">
            <div style="font-size: 18px; font-weight: 700; margin: 0;">New Quotation Registered</div>
            <div style="font-size: 13px; opacity: 0.9; margin-top: 6px;">Swayog Energy • Website Inquiry</div>
          </div>

          <div style="padding: 18px 20px; background: #ffffff;">
            <div style="font-size: 13px; color: #6b7280; margin-bottom: 14px;">
              Submitted (UTC): <strong style="color:#111827;">${submittedAt}</strong> • Inquiry ID: <strong style="color:#111827;">${inquiry.id}</strong>
            </div>

            <div style="border: 1px solid #f1f5f9; border-radius: 12px; padding: 14px; background: #f9fafb;">
              <div style="font-weight: 700; margin-bottom: 10px; color:#111827;">Customer details</div>
              <table style="width: 100%; border-collapse: collapse; font-size: 14px; color:#111827;">
                <tr><td style="padding: 6px 0; color:#6b7280; width: 140px;">Name</td><td style="padding: 6px 0;"><strong>${inquiry.name}</strong></td></tr>
                <tr><td style="padding: 6px 0; color:#6b7280;">Email</td><td style="padding: 6px 0;"><a href="mailto:${inquiry.email}" style="color:#0f766e; text-decoration:none;">${inquiry.email}</a></td></tr>
                <tr><td style="padding: 6px 0; color:#6b7280;">Phone</td><td style="padding: 6px 0;"><strong>${inquiry.phone}</strong></td></tr>
                <tr><td style="padding: 6px 0; color:#6b7280;">Consumer ID</td><td style="padding: 6px 0;">${inquiry.customerNo || 'N/A'}</td></tr>
                <tr><td style="padding: 6px 0; color:#6b7280;">Project Type</td><td style="padding: 6px 0;">${inquiry.projectType}</td></tr>
                <tr><td style="padding: 6px 0; color:#6b7280;">Terms Accepted</td><td style="padding: 6px 0;">${inquiry.termsAccepted ? 'Yes' : 'No'}</td></tr>
              </table>
            </div>

            <div style="margin-top: 14px; border: 1px solid #e5e7eb; border-radius: 12px; padding: 14px;">
              <div style="font-weight: 700; margin-bottom: 10px; color:#111827;">Message</div>
              <div style="font-size: 14px; line-height: 1.55; color:#111827;">${safeMessageHtml}</div>
            </div>

            <div style="margin-top: 14px; border-left: 4px solid #ea580c; padding: 12px 14px; background: #fff7ed; border-radius: 10px;">
              <div style="font-weight: 700; color:#7c2d12; margin-bottom: 6px;">Next steps</div>
              <div style="font-size: 14px; color:#7c2d12; line-height:1.5;">
                This is a quotation registration request. Please contact the customer and continue the process only after a mandatory discussion.
              </div>
            </div>

            <div style="margin-top: 14px; border-top: 1px dashed #e5e7eb; padding-top: 14px;">
              <div style="font-weight: 700; margin-bottom: 6px; color:#111827;">Reply to this customer</div>
              <div style="font-size: 14px; color:#374151; line-height: 1.5;">
                Simply <strong>reply to this email</strong> — it will go to <a href="mailto:${inquiry.email}" style="color:#0f766e; text-decoration:none;">${inquiry.email}</a> (Reply-To is set).
              </div>
            </div>
          </div>
        </div>

        <div style="font-size: 12px; color: #6b7280; margin-top: 14px;">
          Sent from Swayog Energy website inquiry form.
        </div>
      </div>
    `;

    try {
      // Get sender email from .env (EMAIL_USER)
      const senderEmail = getSenderEmail();
      console.log('📧 Preparing to send email notification...');
      
      // Send email using shared utility
      await sendEmail({
        to: targetEmail, // Receiver: NOTIFY_EMAIL from .env
        from: senderEmail, // Sender: EMAIL_USER from .env (e.g., harshaltapre23@gmail.com)
        replyTo: inquiry.email, // User's email for reply
        subject: `New Quotation Registered — ${inquiry.name} (${inquiry.projectType})`,
        text: messageText,
        html: emailHtml,
      });
      console.log('✅ Email notification sent successfully');
    } catch (emailErr: any) {
      const errorDetails = {
        error: emailErr.message,
        code: emailErr.code,
        response: emailErr.response,
        command: emailErr.command,
        responseCode: emailErr.responseCode,
        stack: emailErr.stack,
      };
      console.error('❌ Failed to send email notification:', errorDetails);
      console.error('Full error object:', JSON.stringify(errorDetails, null, 2));
      
      // Continue processing - don't fail the inquiry creation if email fails
      console.warn('⚠️ Inquiry saved but email notification failed - check SMTP configuration in .env file');
      
      // Log helpful troubleshooting tips
      if (emailErr.code === 'EAUTH') {
        console.error('❌ AUTHENTICATION ERROR: Check EMAIL_USER and EMAIL_PASS in .env file');
      } else if (emailErr.code === 'ETIMEDOUT' || emailErr.code === 'ECONNECTION') {
        console.error('❌ CONNECTION ERROR: Check EMAIL_HOST and EMAIL_PORT in .env file');
      }
    }

    return res.status(201).json({ 
      success: true,
      ...inquiry,
      emailSent: true, // Indicate email was attempted
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      console.error('❌ Validation error:', err.errors);
      return res.status(400).json({
        success: false,
        message: err.errors[0].message,
        field: err.errors[0].path.join('.'),
      });
    }
    console.error('❌ Error creating inquiry:', err);
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? String(err) : undefined
    });
  }
}
