"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon, SparklesIcon } from "lucide-react";
import { FormField } from "../forms/form-field";
import { Button } from "../ui/button";
import { addProductAction } from "@/lib/products/product-actions";
import {
  productInputSchema,
  type ProductFormValues,
} from "@/lib/products/product-validation";
import { cn } from "@/lib/utils";

export default function ProductSubmitForm() {
  const [isPending, startTransition] = useTransition();
  const [serverMessage, setServerMessage] = useState<{
    text: string;
    success: boolean;
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productInputSchema),
  });

  const onSubmit = handleSubmit((data) => {
    setServerMessage(null);
    startTransition(async () => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("slug", data.slug);
      formData.append("tagline", data.tagline);
      if (data.description) formData.append("description", data.description);
      formData.append("websiteUrl", data.websiteUrl);
      formData.append("tags", data.tags);

      const result = await addProductAction(formData);

      setServerMessage({ text: result.message, success: result.success });

      if (result.success) {
        reset();
      }
    });
  });

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      {serverMessage && (
        <div
          className={cn(
            "p-4 rounded-lg border",
            serverMessage.success
              ? "bg-secondary/10 border-secondary text-secondary"
              : "bg-destructive/10 border-destructive text-destructive"
          )}
          role="alert"
          aria-live="polite"
        >
          {serverMessage.text}
        </div>
      )}

      <FormField
        label="Product Name"
        id="name"
        placeholder="Product Name"
        required
        error={errors.name?.message}
        {...register("name")}
      />

      <FormField
        label="Slug"
        id="slug"
        placeholder="product-name"
        required
        error={errors.slug?.message}
        helperText="URL-friendly version of your product name"
        {...register("slug")}
      />

      <FormField
        label="Tagline"
        id="tagline"
        placeholder="A brief, catchy description"
        required
        error={errors.tagline?.message}
        {...register("tagline")}
      />

      <FormField
        label="Description"
        id="description"
        placeholder="Tell us more about your product"
        error={errors.description?.message}
        textarea
        {...register("description")}
      />

      <FormField
        label="Website URL"
        id="websiteUrl"
        placeholder="https://your-product.com"
        required
        error={errors.websiteUrl?.message}
        helperText="Enter your product's website or landing page"
        {...register("websiteUrl")}
      />

      <FormField
        label="Tags"
        id="tags"
        placeholder="AI, Productivity, etc."
        required
        error={errors.tags?.message}
        helperText="Comma-separated tags (e.g., AI, SaaS, Productivity)"
        {...register("tags")}
      />

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? (
          <Loader2Icon className="size-4 animate-spin" />
        ) : (
          <>
            <SparklesIcon className="size-4" />
            Submit Product
          </>
        )}
      </Button>
    </form>
  );
}
