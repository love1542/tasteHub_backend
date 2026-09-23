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

export const otpVerificationSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
  otpCode: z.string().length(6, "OTP code must be 6 digits"),
  purpose: z.enum(["login_email", "login_phone", "reset_password", "register_email", "register_phone"]),
  deviceId: z.string().optional()
}).strict();

const dateOfBirthSchema = z
  .string()
  .regex(
    /^(0[1-9]|[12]\d|3[01])-(0[1-9]|1[0-2])-\d{4}$/,
    "Date of birth must be in DD-MM-YYYY format"
  )
  .transform((date) => {
    const [day, month, year] = date.split("-");
    return `${year}-${month}-${day}`;
  });

export const completeRegistrationSchema = z.discriminatedUnion("imageType", [
  z.object({
    fullName: z
      .string()
      .min(1, "Full name is required")
      .min(3, "Full name must be at least 3 characters")
      .max(50, "Full name must be at most 50 characters"),

    gender: z
      .enum(["male", "female", "other"]),

    dateOfBirth: dateOfBirthSchema,

    imageType: z.literal("default"),

    imageId: z
      .string()
      .min(1, "Image_id is required"),

      deviceId: z
      .string()
      .min(1, "deviceId is required"),

  }).strict(),

  z.object({
    fullName: z
      .string()
      .min(1, "Full name is required")
      .min(3, "Full name must be at least 3 characters")
      .max(50, "Full name must be at most 50 characters"),

    gender: z.enum(["male", "female", "other"]),

    dateOfBirth: dateOfBirthSchema,

      deviceId: z
      .string()
      .min(1, "deviceId is required"),

    imageType: z.literal("uploaded"),
  }).strict(),
]);

export const refreshTokenSchema = z.object({
    refreshToken: z
        .string()
        .min(1, "Refresh token is required"),

      deviceId: z
      .string()
      .min(1, "deviceId is required"),
});