import "dotenv/config";
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { getReceiverEmail, getSenderEmail, getSmtpConfig, sendEmail } from "../server/email";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post(api.inquiries.create.path, async (req, res) => {
  console.log(" API HIT:", api.inquiries.create.path);
  console.log("BODY:", req.body);

    try {
      const input = api.inquiries.create.input.parse(req.body);
      const inquiry = await storage.createInquiry(input);

      // Get receiver email from .env file (REQUIRED)
      // This is the ONLY source of truth for receiver email
      let targetEmail: string;
      try {
        targetEmail = getReceiverEmail();
      } catch (error) {
        console.error('NOTIFY_EMAIL not configured:', error);
        console.warn('⚠️ Skipping email notification - NOTIFY_EMAIL not configured in .env file');
        // Continue without email - inquiry is still saved
        return res.status(201).json(inquiry);
      }

      // Prepare message content
      const messageText = `New Inquiry Details:\nName: ${inquiry.name}\nEmail: ${inquiry.email}\nPhone: ${inquiry.phone}\nConsumer ID: ${inquiry.customerNo || "N/A"}\nProject Type: ${inquiry.projectType}\nMessage: ${inquiry.message}`;

      // Get SMTP configuration from .env
      const smtpConfig = getSmtpConfig();
      
      // Prepare email HTML
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ea580c;">New Solar Inquiry</h2>
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${inquiry.name}</p>
            <p><strong>Email:</strong> <a href="mailto:${inquiry.email}">${inquiry.email}</a></p>
            <p><strong>Phone:</strong> ${inquiry.phone}</p>
            <p><strong>Consumer ID:</strong> ${inquiry.customerNo || 'N/A'}</p>
            <p><strong>Project Type:</strong> ${inquiry.projectType}</p>
          </div>
          <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h3 style="margin-top: 0;">Message:</h3>
            <p style="white-space: pre-wrap;">${inquiry.message.replace(/\n/g, '<br>')}</p>
          </div>
          <p style="color: #6b7280; font-size: 12px; margin-top: 20px;">
            This inquiry was sent from the Swayog Energy website.<br>
            You can reply directly to this email to respond to ${inquiry.name}.
          </p>
        </div>
      `;

      try {
        // Get sender email from .env (EMAIL_USER)
        const senderEmail = getSenderEmail();
        
        // Send email using shared utility
        await sendEmail({
          to: targetEmail, // Receiver: NOTIFY_EMAIL from .env
          from: senderEmail, // Sender: EMAIL_USER from .env (e.g., harshaltapre23@gmail.com)
          replyTo: inquiry.email, // User's email for reply
          subject: `New Solar Inquiry from ${inquiry.name}`,
          text: messageText,
          html: emailHtml,
        });

        console.log('✓ Inquiry email sent successfully to:', targetEmail);
      } catch (emailErr: any) {
        console.error('❌ Failed to send inquiry email:', {
          error: emailErr.message,
          code: emailErr.code,
        });
        console.warn('⚠️ Inquiry saved but email notification failed');
        
        // Log helpful troubleshooting tips
        if (emailErr.code === 'EAUTH') {
          console.error('❌ AUTHENTICATION ERROR: Check EMAIL_USER and EMAIL_PASS in .env file');
        } else if (emailErr.code === 'ETIMEDOUT' || emailErr.code === 'ECONNECTION') {
          console.error('❌ CONNECTION ERROR: Check EMAIL_HOST and EMAIL_PORT in .env file');
        }
      }

      res.status(201).json(inquiry);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  return httpServer;
}
