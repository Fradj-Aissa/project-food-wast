import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
  email: z.string().email("بريد إلكتروني غير صحيح"),
  password: z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
  role: z.enum(["HOME", "RESTAURANT", "CHARITY"], {
    errorMap: () => ({ message: "نوع حساب غير صحيح" }),
  }),
});

export const loginSchema = z.object({
  email: z.string().email("بريد إلكتروني غير صحيح"),
  password: z.string().min(1, "كلمة المرور مطلوبة"),
});

export const productSchema = z.object({
  name: z.string().min(1, "اسم المنتج مطلوب"),
  category: z.string().min(1, "الفئة مطلوبة"),
  quantity: z.coerce.number().positive("الكمية يجب أن تكون موجبة"),
  unit: z.string().min(1, "وحدة القياس مطلوبة"),
  expiryDate: z.coerce.date().refine((date) => date > new Date(), "تاريخ الانتهاء يجب أن يكون في المستقبل"),
});

export const wasteLogSchema = z.object({
  productName: z.string().min(1, "اسم المنتج مطلوب"),
  quantity: z.string().min(1, "الكمية مطلوبة"),
  reason: z.string().min(1, "السبب مطلوب"),
  cost: z.coerce.number().positive("التكلفة يجب أن تكون رقمًا موجبًا"),
  notes: z.string().optional(),
});

export const donationSchema = z.object({
  title: z.string().min(1, "العنوان مطلوب"),
  description: z.string().optional(),
  quantity: z.coerce.number().positive("الكمية يجب أن تكون موجبة"),
  unit: z.string().min(1, "وحدة القياس مطلوبة"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type WasteLogInput = z.infer<typeof wasteLogSchema>;
export type DonationInput = z.infer<typeof donationSchema>;
