'use server';

import {auth, currentUser} from "@clerk/nextjs/server"
import { productSchema } from "./product-validation";
import { products } from "@/db/schema";
import { db } from "@/db";
//import z from "zod";
import { FormState } from "@/types";


export const addProductAction = async (prevState: FormState, formData: FormData) => {
    console.log(formData);

    try {
        const {userId, orgId} = await auth();
        if (!userId) {
            return {
                success: false,
                message: "you must be signed in to submit a product.",
            }
        }

        if (!orgId) {
             return {
               success: false,
               message: "You must be a member of an organization to submit a product",
            };
         }

    // Extract form data
    const rawFormData = Object.fromEntries(formData.entries());

    // Validate form data
    const validatedData = productSchema.safeParse(rawFormData);
    if (!validatedData.success) {

        console.log("Validation errors:", validatedData.error.flatten().fieldErrors);

        return {
            success: false,
            errors: validatedData.error.flatten().fieldErrors,
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
         organizationId: orgId,
        userId,
    });

    return {
        success: true,
        message: "Product submitted successfully, it will be reviewed shortly.",
        errors: {},
    };
    

     } catch (error) {
    console.error(error);

    // if (error instanceof z.ZodError) {
    //   return {
    //     success: false,
    //     errors: error.flatten().fieldErrors,
    //     message: "Validation failed. Please check the form.",
    //   };
    // }

    return {
      success: false,
      errors: undefined,
      message: "Failed to submit product",
    };
  }
};