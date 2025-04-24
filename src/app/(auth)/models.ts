import { z } from "zod";

export const LoginValidator = z.object({
  info: z.string(),
  password: z
    .string()
    .min(6, { message: "password should be length of 6 or more" }),
});

export const SignupValidator = z
  .object({
    email: z.string().email("email must have correct format"),
    password: z
      .string()
      .min(6, { message: "password should be length of 6 or more" }),
    confirmPassword: z
      .string()
      .min(6, { message: "password should be length of 6 or more" }),
    firstName: z.string().min(3).max(20),
    lastName: z.string().min(3).max(20),
  })
  .refine((data) => data.password == data.confirmPassword, {
    message: " passwords must match ",
    path: ["confirmPassword"],
  });

export const CodeValidator = z.object({
  code: z
    .string()
    .min(4, { message: "the code consists only 4 characters" })
    .max(4, { message: "the code consists only 4 characters" }),
  phoneOrEmail: z
    .string()
    .min(4, { message: "info must not be less than 4 characters" }),
});

export type TLoginSchema = z.infer<typeof LoginValidator>;
export type TSignupSchema = z.infer<typeof SignupValidator>;
export type TCodeSchema = z.infer<typeof CodeValidator>;
