import { pgTable, text, serial, timestamp, varchar, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  customerNo: text("customer_no"), // Added customer number
  projectType: text("project_type").notNull(), // Residential, Commercial, Industrial
  message: text("message").notNull(),
  termsAccepted: boolean("terms_accepted").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertInquirySchema = createInsertSchema(inquiries).omit({ 
  id: true, 
  createdAt: true 
}).extend({
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  projectType: z.enum(["Residential", "Commercial", "Industrial"]),
  // Make consumer ID optional so users can submit the form
  // even if they don't know or want to provide it.
  // Accept either a non-empty string or an empty value.
  customerNo: z.string().min(1, "Consumer ID is required").optional().or(z.literal("")),
  termsAccepted: z.literal(true, {
    errorMap: () => ({
      message: "You must accept the terms and conditions to submit your quotation request.",
    }),
  }),
});

export type Inquiry = typeof inquiries.$inferSelect;
export type InsertInquiry = z.infer<typeof insertInquirySchema>;
