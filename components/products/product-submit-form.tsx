"use client";

import { SparklesIcon } from "lucide-react";
import { FormField } from "../forms/form-field";
import { Button } from "../ui/button";
import { addProductAction } from "@/lib/products/product-actions";
import { useActionState } from "react";
import { FormState } from "@/types";
import { cn } from "@/lib/utils";


const initialState: FormState = {
  success: false,
  errors: undefined,
  message: "",
};

export default function ProductSubmitForm() {
    const [state, formAction, isPending] = useActionState(addProductAction, initialState);

    const { errors, message, success } = state;
    return (
    <form className="space-y-6" action={formAction}>

        {message && (
        <div
          className={cn(
            "p-4 rounded-lg border",
            success
              ? "bg-secondary/10 border-secondary text-secondary"
              : "bg-destructive/10 border-destructive text-destructive"
          )}
          role="alert"
          aria-live="polite"
        >
          {message}
        </div>
      )}

        <FormField 
        label="Product Name"
        id="name"
        name="name"
        placeholder="Enter product name"
        required
        onChange={() => {}}
        error={errors?.name ?? []}  
        /> 

        <FormField 
        label="Slug"
        id="slug"
        name="slug"
        placeholder="Enter slug"
        required
        onChange={() => {}}
        error={errors?.slug ?? []}  
        helperText="URL-friendly version of your product name"
        />

        <FormField 
        label="TagLine"
        id="tagline"
        name="tagline"
        placeholder="A brief, catchy description"
        required
        onChange={() => {}}
        error={errors?.tagline ?? []}  
        />
        <FormField 
        label="Description"
        id="description"
        name="description"
        placeholder="Tell us more about your product"
        required = {false}
        onChange={() => {}}
        error={errors?.description ?? []}
        textarea={true}
        />
        <FormField 
        label="Website URL"
        id="websiteUrl"
        name="websiteUrl"
        placeholder="https://your-product.com"
        required
        onChange={() => {}}
        error={errors?.websiteUrl ?? []}
        helperText="The URL of your product's website"
        />
        <FormField 
        label="Tags"
        id="tags"
        name="tags"
        placeholder="AI, Productivity, etc."
        required
        onChange={() => {}}
        error={errors?.tags ?? []}
        helperText="Comma-separated tags (e.g., AI, SaaS, Productivity)"
        />

    <Button type="submit" className="w-full">
        {isPending ?
        (
        <SparklesIcon className="size-4 animate-spin" />
        ) :(
            <>
                <SparklesIcon className="size-4" />
                Submit Product
            </>
        )}
        </Button>
        </form>  
); 
 }