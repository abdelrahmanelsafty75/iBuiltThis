"use client";

import { SparklesIcon } from "lucide-react";
import { FormField } from "../forms/form-field";
import { Button } from "../ui/button";
import { addProductAction } from "@/lib/products/product-actions";
import { useActionState } from "react";


const initialState = {
    success: false,
    error: {
      name: "",
      slug: "",
      tagline: "",
      description: "",
      websiteUrl: "",
      tags: "",
    },
    message: "",
  };

export default function ProductSubmitForm() {
    const [state, formAction, isPending] = useActionState(addProductAction, initialState);

    const errors = state.error;
    return (
    <form className="space-y-6" action={formAction}>
        <FormField 
        label="Product Name"
        id="product-name"
        name="product-name"
        placeholder="Enter product name"
        required
        onChange={() => {}}
        error={errors?.name}  
        /> 

        <FormField 
        label="Slug"
        id="slug"
        name="slug"
        placeholder="Enter slug"
        required
        onChange={() => {}}
        error={errors?.slug}  
        helperText="URL-friendly version of your product name"
        />

        <FormField 
        label="TagLine"
        id="tagline"
        name="tagline"
        placeholder="A brief, catchy description"
        required
        onChange={() => {}}
        error={errors?.tagline}  
        />
        <FormField 
        label="Description"
        id="description"
        name="description"
        placeholder="Tell us more about your product"
        required = {false}
        onChange={() => {}}
        error={errors?.description}
        textarea={true}
        />
        <FormField 
        label="websiteURL"
        id="websiteURL"
        name="websiteURL"
        placeholder="https://your-product.com"
        required
        onChange={() => {}}
        error={errors?.websiteUrl}
        helperText="The URL of your product's website"
        />
        <FormField 
        label="Tags"
        id="tags"
        name="tags"
        placeholder="AI, Productivity, etc."
        required
        onChange={() => {}}
        error={errors?.tags}
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