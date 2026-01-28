import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import type { InsertInquiry } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useCreateInquiry() {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (data: InsertInquiry) => {
      // Client-side validation using the schema from routes
      const validated = api.inquiries.create.input.parse(data);
      
      const res = await fetch(api.inquiries.create.path, {
        method: api.inquiries.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });

      if (!res.ok) {
        // Try to read JSON error payload once
        let payload: unknown = null;
        try {
          payload = await res.json();
        } catch {
          // ignore JSON parse errors and fall back to generic message
        }

        // Validation error from API (400)
        if (res.status === 400 && payload) {
          const error = api.inquiries.create.responses[400].parse(payload);
          throw new Error(error.message);
        }

        // Other errors (e.g. 500) – surface server message if available
        if (
          payload &&
          typeof payload === "object" &&
          "message" in payload &&
          typeof (payload as any).message === "string"
        ) {
          throw new Error((payload as any).message);
        }

        throw new Error("Failed to submit inquiry");
      }

      const data201 = await res.json();
      return api.inquiries.create.responses[201].parse(data201);
    },
    onSuccess: () => {
      toast({
        title: "Quote Requested!",
        description: "We'll be in touch with you shortly.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
