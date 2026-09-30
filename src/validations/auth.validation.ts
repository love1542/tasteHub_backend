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

export const loginSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("email"),
    identifier: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    deviceId: z.string().min(1, "deviceId is required"),
  }).strict(),

  z.object({
    type: z.literal("phone"),
    identifier: z.string().regex(/^[0-9]{10}$/, "Invalid phone number"),
  }).strict(),
]);

export const otpVerificationSchema = z.object({
  type: z.enum(["email", "phone"]),
  identifier: z.string().min(1, "Email or phone is required"),
  otpCode: z.string().length(6, "OTP code must be 6 digits"),
  purpose: z.enum([ "login_phone", "reset_password", "register_email", "register_phone"]),
  deviceId: z.string().optional()
}).strict().superRefine((data, context) => {
  if (data.type === "email" && !z.string().email().safeParse(data.identifier).success) {
    context.addIssue({ code: "custom", path: ["identifier"], message: "Invalid email" });
  }

  if (data.type === "phone" && !/^\d{10}$/.test(data.identifier)) {
    context.addIssue({ code: "custom", path: ["identifier"], message: "Invalid phone number" });
  }

  if (data.purpose.endsWith("_email") && data.type !== "email") {
    context.addIssue({ code: "custom", path: ["type"], message: "Email purpose requires an email identifier" });
  }

  if (data.purpose.endsWith("_phone") && data.type !== "phone") {
    context.addIssue({ code: "custom", path: ["type"], message: "Phone purpose requires a phone identifier" });
  }

  if ((data.purpose === "login_phone") && !data.deviceId) {
    context.addIssue({ code: "custom", path: ["deviceId"], message: "deviceId is required for login OTP verification" });
  }
});

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