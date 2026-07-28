import { z } from "zod";

// Client-side schema: pure validation, no transforms — safe for zodResolver in react-hook-form.
export const productInputSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters" })
    .max(120, { message: "Name must be less than 120 characters" }),

  slug: z
    .string()
    .min(3, { message: "Slug must be at least 3 characters" })
    .max(140, { message: "Slug must be less than 140 characters" })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message:
        "Slug must be lowercase and contain only letters, numbers and hyphens",
    }),

  tagline: z
    .string()
    .min(3, { message: "Tagline must be at least 3 characters" })
    .max(200, { message: "Tagline must be less than 200 characters" }),

  description: z.string().optional(),

  websiteUrl: z
    .string()
    .url({ message: "Website URL must be a valid URL" })
    .min(1, { message: "Website URL is required" }),

  tags: z.string().min(1, { message: "Tags are required" }),
});

export type ProductFormValues = z.infer<typeof productInputSchema>;

// Server-side schema: same rules + transforms applied after server validation.
export const productSchema = productInputSchema.extend({
  tags: z
    .string()
    .min(1, { message: "Tags are required" })
    .transform((val: string) =>
      val.split(",").map((tag: string) => tag.trim().toLowerCase())
    ),
});