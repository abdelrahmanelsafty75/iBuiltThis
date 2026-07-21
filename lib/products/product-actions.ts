'use server';

import {auth, currentUser} from "@clerk/nextjs/server"
import { productSchema } from "./product-validation";
import { products } from "@/db/schema";
import { db } from "@/db";
import z from "zod";

type formState = {
    success: boolean;
    error?: Record<string, string>;
    message: string;
}

export const addProductAction = async (prevState: formState, formData: FormData) => {
    console.log(formData);

    try {
        const userId = await auth();
        if (!userId) {
            return {
                success: false,
                message: "you must be signed in to submit a product.",
            }
        }

    // Extract form data
    const rawFormData = Object.fromEntries(formData.entries());

    // Validate form data
    const validatedData = productSchema.safeParse(rawFormData);
    if (!validatedData.success) {

        console.log("Validation errors:", validatedData.error.flatten().fieldErrors);

        return {
            success: false,
            error: validatedData.error.flatten().fieldErrors,
            message: "Invalid data.",
        };
    }

    // transform the validated data into the desired format
    const { name, slug, tagline, description, websiteUrl, tags } = validatedData.data;

    const tagsArray = tags? tags.filter((tag) => typeof tag === "string"): [];

    const user = await currentUser();
    const emailAddress = user?.emailAddresses[0]?.emailAddress || user?.username || "Anonymous";

    await db.insert(products).values({
        name,
        slug,
        tagline,
        description,
        websiteUrl,
        tags: tagsArray,
        status: "pending",
        submittedBy: emailAddress,
        userId: "",
    });

    return {
        success: true,
        message: "Product submitted successfully, it will be reviewed shortly.",
    };
    

     } catch (error) {
        console.error(error);

        if(error instanceof z.ZodError) {
            return {
                success: false,
                error: error.flatten().fieldErrors,
                message: "Validation failed, please check your inputs.",
            };
        }

        return {
        success: false,
        error: error,
        message: "Failed to submit product."
    };
    }

    

}