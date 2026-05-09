"use server";

import { prisma } from "../prisma";
import { getCurrentUserId } from "../actions";

export async function getDashboardStats() {
  const userId = await getCurrentUserId();
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [completedDonations, currentMonthWaste, activeInventory, pendingDonations] =
    await Promise.all([
      prisma.donation.aggregate({
        where: { donorId: userId, status: "COMPLETED" },
        _sum: { quantity: true },
      }),
      prisma.wasteLog.aggregate({
        where: { userId, createdAt: { gte: monthStart, lte: now } },
        _sum: { cost: true },
      }),
      prisma.inventoryItem.count({
        where: { userId },
      }),
      prisma.donation.count({
        where: { donorId: userId, status: "PENDING" },
      }),
    ]);

  return {
    totalSavedFoodKg: completedDonations._sum.quantity ?? 0,
    totalWasteCost: currentMonthWaste._sum.cost ?? 0,
    activeProducts: activeInventory,
    pendingDonations,
  };
}

export async function getWasteByReasonData() {
  const userId = await getCurrentUserId();
  const grouped = await prisma.wasteLog.groupBy({
    by: ["reason"],
    where: { userId },
    _count: { _all: true },
    orderBy: { _count: { reason: "desc" } },
  });

  return grouped.map((item) => ({
    name: item.reason,
    value: item._count._all,
  }));
}

export async function getExpiryAlerts() {
  const userId = await getCurrentUserId();
  const now = new Date();
  const inSevenDays = new Date();
  inSevenDays.setDate(now.getDate() + 7);

  const items = await prisma.inventoryItem.findMany({
    where: {
      userId,
      expiryDate: { gte: now, lte: inSevenDays },
    },
    orderBy: { expiryDate: "asc" },
    take: 5,
  });

  return items.map((item) => {
    const diffDays = Math.ceil(
      (item.expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    const type = diffDays <= 1 ? "urgent" : "warning";
    const timeText = diffDays <= 0 ? "اليوم" : `بعد ${diffDays} يوم`;

    return {
      id: item.id,
      title: `${item.name} ينتهي ${timeText}`,
      description: `${item.quantity} ${item.unit} • ${item.category}`,
      type,
      expiryDate: item.expiryDate.toISOString(),
    };
  });
}

export async function getSustainabilityImpact() {
  const userId = await getCurrentUserId();
  const completed = await prisma.donation.aggregate({
    where: { donorId: userId, status: "COMPLETED" },
    _sum: { quantity: true },
  });

  const savedKg = completed._sum.quantity ?? 0;
  return {
    savedMeals: savedKg / 0.5,
    savedCo2Kg: savedKg * 2.5,
  };
}

export async function getTopWasteOffenders() {
  const userId = await getCurrentUserId();
  const grouped = await prisma.wasteLog.groupBy({
    by: ["productName"],
    where: { userId },
    _sum: { cost: true },
    orderBy: { _sum: { cost: "desc" } },
    take: 5,
  });

  return grouped.map((item) => ({
    productName: item.productName,
    totalCost: item._sum.cost ?? 0,
  }));
}

export async function getPendingTasks() {
  const userId = await getCurrentUserId();
  const now = new Date();
  const before24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

  const [oldPendingDonations, expiringToday] = await Promise.all([
    prisma.donation.findMany({
      where: {
        donorId: userId,
        status: "PENDING",
        createdAt: { lte: before24h },
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
      take: 5,
    }),
    prisma.inventoryItem.findMany({
      where: {
        userId,
        expiryDate: { gte: dayStart, lt: dayEnd },
      },
      select: {
        id: true,
        name: true,
        quantity: true,
        unit: true,
      },
      take: 5,
    }),
  ]);

  return {
    staleDonations: oldPendingDonations.map((donation) => ({
      id: donation.id,
      label: `تبرع "${donation.title}" بانتظار التأكيد منذ أكثر من 24 ساعة`,
      createdAt: donation.createdAt.toISOString(),
    })),
    expiringToday: expiringToday.map((item) => ({
      id: item.id,
      label: `${item.name} ينتهي اليوم (${item.quantity} ${item.unit})`,
    })),
  };
}
