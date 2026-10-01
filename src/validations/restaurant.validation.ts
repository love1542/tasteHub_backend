import { z } from "zod";

export const getRestaurantsQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .refine((val) => val > 0, { message: "Page must be greater than 0" }),

  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10))
    .refine((val) => val > 0 && val <= 100, { 
      message: "Limit must be between 1 and 100" 
    }),

  // Filtering parameters
  cuisineId: z
    .string()
    .uuid("Invalid cuisine ID format")
    .optional(),

  search: z
    .string()
    .max(100, "Search query too long")
    .optional()
    .transform((val) => val?.trim()),

  // Sorting parameters
  sortBy: z
    .enum(["name", "created_at", "delivery_fee", "minimum_order"])
    .optional(),

  sortOrder: z
    .enum(["ASC", "DESC", "asc", "desc"])
    .optional()
    .transform((val) => val?.toUpperCase() as "ASC" | "DESC" | undefined),
}).strict();


// Output type after transformation (what you get after validation)
export type GetRestaurantsQuery = z.infer<typeof getRestaurantsQuerySchema>;

// Input type before transformation (what comes from req.query)
export type GetRestaurantsQueryInput = z.input<typeof getRestaurantsQuerySchema>;
