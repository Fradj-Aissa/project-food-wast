"use server";

import { prisma } from "../prisma";
import { productSchema } from "../schemas";

export async function addProduct(userId: string, data: unknown) {
  try {
    const parsed = productSchema.parse(data);

    const product = await prisma.product.create({
      data: {
        name: parsed.name,
        category: parsed.category,
        quantity: parsed.quantity,
        unit: parsed.unit,
        expiryDate: parsed.expiryDate,
        userId,
      },
    });

    return { product };
  } catch (error: any) {
    if (error.errors) {
      return { error: error.errors[0].message };
    }
    return { error: "حدث خطأ أثناء إضافة المنتج" };
  }
}

export async function getProducts(userId: string) {
  try {
    const products = await prisma.product.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return { products };
  } catch (error) {
    return { error: "حدث خطأ أثناء جلب المنتجات" };
  }
}

export async function updateProduct(productId: string, data: unknown) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return { error: "المنتج غير موجود" };
    }

    const parsed = productSchema.parse(data);

    const updated = await prisma.product.update({
      where: { id: productId },
      data: {
        name: parsed.name,
        category: parsed.category,
        quantity: parsed.quantity,
        unit: parsed.unit,
        expiryDate: parsed.expiryDate,
      },
    });

    return { product: updated };
  } catch (error: any) {
    if (error.errors) {
      return { error: error.errors[0].message };
    }
    return { error: "حدث خطأ أثناء تحديث المنتج" };
  }
}

export async function deleteProduct(productId: string) {
  try {
    await prisma.product.delete({
      where: { id: productId },
    });

    return { success: true };
  } catch (error) {
    return { error: "حدث خطأ أثناء حذف المنتج" };
  }
}
