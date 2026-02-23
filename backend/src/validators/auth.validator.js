import { z } from "zod";

/*
  Converts undefined/null → ""
  and applies validation rules safely
*/
const requiredString = (fieldName, minLength = 1) =>
  z.preprocess(
    (val) => (val === undefined || val === null ? "" : val),
    z
      .string()
      .trim()
      .min(1, `${fieldName} is required`)
      .min(minLength, `${fieldName} must be at least ${minLength} characters`)
  );

/* =========================
   Register Schema
========================= */

export const registerSchema = z.object({
  name: requiredString("Name", 3),

  email: z.preprocess(
    (val) => (val === undefined || val === null ? "" : val),
    z
      .string()
      .trim()
      .min(1, "Email is required")
      .email("Invalid email address")
  ),

  password: requiredString("Password", 6),
});

/* =========================
   Login Schema
========================= */

export const loginSchema = z.object({
  email: z.preprocess(
    (val) => (val === undefined || val === null ? "" : val),
    z
      .string()
      .trim()
      .min(1, "Email is required")
      .email("Invalid email address")
  ),

  password: requiredString("Password", 6),
});