import { z } from "zod";

export const loginSchema = z.object({

    email: z
        .string()
        .email("Invalid Email"),

    password: z
        .string()
        .min(7, "Password must be at least 7 characters")

});

export const registerSchema = z.object({
    name: z
    .string()
    .min(2, "Name must be at least 2 characters"),

    email: z
        .string()
        .email("Invalid Email"),

    password: z
        .string()
        .min(7, "Password must be at least 7 characters")

});