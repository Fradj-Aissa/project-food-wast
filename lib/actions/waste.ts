"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../prisma";
import { wasteLogSchema } from "../schemas";
import { getCurrentUserId } from "../actions";

export async function addWasteLog(formData: FormData) {
  const userId = await getCurrentUserId();

  try {
    const parsed = wasteLogSchema.parse({
      productName: String(formData.get("productName") ?? "").trim(),
      quantity: String(formData.get("quantity") ?? "").trim(),
      reason: String(formData.get("reason") ?? "").trim(),
      cost: Number(formData.get("cost")),
      notes: String(formData.get("notes") ?? "").trim() || undefined,
    });

    await prisma.wasteLog.create({
      data: {
        productName: parsed.productName,
        quantity: parsed.quantity,
        reason: parsed.reason,
        cost: parsed.cost,
        notes: parsed.notes,
        userId,
      },
    });

    revalidatePath("/dashboard/waste-logs");
  } catch (error: any) {
    if (error.errors) {
      throw new Error(error.errors[0].message);
    }
    throw new Error("حدث خطأ أثناء تسجيل الهدر");
  }
}

export async function getWasteLogs() {
  const userId = await getCurrentUserId();

  try {
    const logs = await prisma.wasteLog.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return { logs };
  } catch (error) {
    return { error: "حدث خطأ أثناء جلب سجلات الهدر" };
  }
}

export async function deleteWasteLog(wasteLogId: string) {
  try {
    await prisma.wasteLog.delete({
      where: { id: wasteLogId },
    });

    return { success: true };
  } catch (error) {
    return { error: "حدث خطأ أثناء حذف السجل" };
  }
}

export async function getWasteCostTrends(days = 7) {
  const userId = await getCurrentUserId();
  const now = new Date();
  const startDate = new Date(now);
  startDate.setDate(now.getDate() - (days - 1));

  const logs = await prisma.wasteLog.findMany({
    where: {
      userId,
      createdAt: {
        gte: startDate,
        lte: now,
      },
    },
    orderBy: { createdAt: "asc" },
  });

  const totals: Record<string, number> = {};
  logs.forEach((log) => {
    const dateKey = log.createdAt.toISOString().split("T")[0];
    totals[dateKey] = (totals[dateKey] || 0) + log.cost;
  });

  const formatter = new Intl.DateTimeFormat("ar-EG-u-nu-latn", {
    weekday: "short",
  });

  const data = Array.from({ length: days }, (_, index) => {
    const day = new Date(startDate);
    day.setDate(startDate.getDate() + index);
    const dateKey = day.toISOString().split("T")[0];

    return {
      date: dateKey,
      day: formatter.format(day),
      cost: totals[dateKey] ?? 0,
    };
  });

  return { data };
}
