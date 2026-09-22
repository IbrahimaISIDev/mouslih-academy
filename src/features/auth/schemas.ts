import { z } from "zod";
import { parsePhoneNumber } from "libphonenumber-js";

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
    .refine(
      (value) => {
        if (!value) return false;
        try {
          const phoneNumber = parsePhoneNumber(value);
          return phoneNumber && phoneNumber.isValid();
        } catch {
          return false;
        }
      },
      { message: "Numéro de téléphone invalide" },
    ),
  password: z.string().min(8, "8 caractères minimum"),
  acceptTerms: z.boolean().refine((value) => value === true, {
    error: "Vous devez accepter les conditions pour continuer",
  }),
});

export type SignupFormValues = z.input<typeof signupSchema>;
