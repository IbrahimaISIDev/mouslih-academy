import { z } from "zod";

// E.164 format: +[country code][number] - starts with +, followed by 10-15 digits
const E164_REGEX = /^\+[1-9]\d{1,14}$/;

export const loginSchema = z.object({
  email: z.string().email("Format d'e-mail invalide"),
  password: z.string().min(8, "8 caractères minimum"),
  rememberMe: z.boolean(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  firstName: z.string().min(1, "Prénom requis"),
  lastName: z.string().min(1, "Nom requis"),
  email: z.string().email("Format d'e-mail invalide"),
  phone: z
    .string()
    .min(1, "Numéro de téléphone requis")
    .regex(E164_REGEX, "Format de numéro invalide (ex: +221771234567)"),
  password: z.string().min(8, "8 caractères minimum"),
  acceptTerms: z.boolean().refine((value) => value === true, {
    error: "Vous devez accepter les conditions pour continuer",
  }),
});

export type SignupFormValues = z.input<typeof signupSchema>;
