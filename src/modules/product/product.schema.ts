import { z } from "npm:zod@3.22.1";

export const productSchema = z.object({
  params: z.object({}),
  body: z.object({}),
  query: z.object({}),
});
export type ProductSchema = z.TypeOf<typeof productSchema>;

// ==================================================================================

export const productCategoryCreateSchema = z.object({
  body: z.object({
    name: z.string(),
    logo: z.string(),
  }),
});
export type ProductCategoryCreateSchema = z.TypeOf<
  typeof productCategoryCreateSchema
>;

export const productCategoryUpdateSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
  body: z.object({
    name: z.string().optional(),
    logo: z.string().optional(),
  }),
});
export type ProductCategoryUpdateSchema = z.TypeOf<
  typeof productCategoryUpdateSchema
>;

// ==================================================================================

export const productCreateSchema = z.object({
  body: z.object({
    category: z.string(),

    name: z.string(),
    url: z.string(),
    images: z.array(
      z.object({
        url: z.string(),
        isFront: z.boolean(),
        sortNumber: z.number(),
      })
    ),
    description: z.string(),

    price: z.number(),
    discountPrice: z.number(),
    weightGram: z.number(),
    stock: z.number(),
    amountSold: z.number(),
  }),
});
export type ProductCreateSchema = z.TypeOf<typeof productCreateSchema>;
