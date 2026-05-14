import { z } from "zod";

export const createJobSchema = z.object({
  roleTitle: z.string().trim().min(1, "Role title is required"),

  companyName: z.string().trim().min(1, "Company name is required"),

  status: z
    .enum(["APPLIED", "INTERVIEW", "OFFER", "REJECTED"])
    .optional(),

  priority: z
    .enum(["LOW", "MEDIUM", "HIGH"])
    .optional(),

  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),

  applicationDate: z.string().optional(),
  interviewDate: z.string().optional(),

  notes: z.string().optional(),
});
export const updateJobSchema = createJobSchema.partial();