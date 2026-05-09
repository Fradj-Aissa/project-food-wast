"use server";

import { prisma } from "../prisma";
import { formatDate } from "../utils";

export async function getExpiringProducts(userId: string) {
  try {
    const now = new Date();
    const threeDaysLater = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

    const products = await prisma.product.findMany({
      where: {
        userId,
        expiryDate: {
          gte: now,
          lte: threeDaysLater,
        },
      },
      orderBy: { expiryDate: "asc" },
    });

    return { products };
  } catch (error) {
    return { error: "حدث خطأ أثناء جلب المنتجات" };
  }
}

export async function getAlerts(userId: string) {
  try {
    const now = new Date();
    const threeDaysLater = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

    const expiringProducts = await prisma.product.findMany({
      where: {
        userId,
        expiryDate: {
          gte: now,
          lte: threeDaysLater,
        },
      },
      orderBy: { expiryDate: "asc" },
      take: 5,
    });

    const alerts = expiringProducts.map((product) => ({
      id: product.id,
      type: "expiring",
      title: `تحذير: ${product.name}`,
      message: `المنتج ${product.name} سينتهي في ${formatDate(product.expiryDate)}`,
    return { alerts };
  } catch (error) {
    return { error: "حدث خطأ أثناء جلب التنبيهات" };
  }
}
