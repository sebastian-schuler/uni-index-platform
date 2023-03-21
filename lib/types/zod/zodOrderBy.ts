import { z } from "zod";

export const ZodOrderBy = z.enum(["popularity", "az", "za"]);
export type OrderBy = z.infer<typeof ZodOrderBy>;

export const ZodCategoryOrderBy = z.enum(["popularity", "az", "za", "subject-count"]);
export type OrderCategoryBy = z.infer<typeof ZodCategoryOrderBy>;