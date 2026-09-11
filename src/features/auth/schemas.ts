import { z } from "zod";

const SENEGAL_PHONE_REGEX = /^(77|78|76|70)\d{7}$/;

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
    .transform((value) => value.replace(/\s+/g, ""))
    .pipe(
      z
        .string()
        .regex(
          SENEGAL_PHONE_REGEX,
          "Numéro sénégalais attendu (77, 78, 76, 70)",
        ),
    ),
  password: z.string().min(8, "8 caractères minimum"),
  acceptTerms: z.boolean().refine((value) => value === true, {
    error: "Vous devez accepter les conditions pour continuer",
  }),
});

export type SignupFormValues = z.input<typeof signupSchema>;
