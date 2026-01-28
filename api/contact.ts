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

    // Prepare message body with all contact form details
    const messageText = `New Contact Form Message Received

Name: ${firstName} ${lastName}
Email: ${email}
Subject: ${subject}

Message:
${message}

---
This message was sent from the Swayog Urja website contact form.`;

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

    // Prepare email content
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ea580c;">New Contact Form Message</h2>
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Name:</strong> ${firstName} ${lastName}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Subject:</strong> ${subject}</p>
        </div>
        <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h3 style="margin-top: 0;">Message:</h3>
          <p style="white-space: pre-wrap;">${message.replace(/\n/g, '<br>')}</p>
        </div>
        <p style="color: #6b7280; font-size: 12px; margin-top: 20px;">
          This message was sent from the Swayog Urja website contact form.<br>
          You can reply directly to this email to respond to ${firstName} ${lastName}.
        </p>
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
        subject: `Contact Form: ${subject}`,
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
