import { z } from "zod";

export const credentialsSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("email"),
    identifier: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  }).strict(),

  z.object({
    type: z.literal("phone"),
    identifier: z
      .string()
      .regex(/^[0-9]{10}$/, "Invalid phone number"),
  }).strict(),
]);