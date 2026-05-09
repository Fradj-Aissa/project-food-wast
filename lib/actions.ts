"use server";

import { revalidatePath } from "next/cache";
import { DonationStatus, InventoryStatus } from "@prisma/client";
import { prisma } from "./prisma";

function computeInventoryStatus(expiryDate: Date): InventoryStatus {
  const now = new Date();
  const diffMs = expiryDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "EXPIRED";
  if (diffDays <= 3) return "EXPIRING";
  return "FRESH";
}

export async function getCurrentUserId() {
  const user = await prisma.user.findFirst({
    orderBy: { createdAt: "asc" },
    select: { id: true },
  });

  if (!user) {
    throw new Error("No users found. Please create a user first.");
  }

  return user.id;
}

export async function getInventoryItems() {
  const userId = await getCurrentUserId();
  return prisma.inventoryItem.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function addInventoryItem(formData: FormData) {
  const userId = await getCurrentUserId();
  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const quantityRaw = Number(formData.get("quantity"));
  const expiryDateRaw = String(formData.get("expiryDate") ?? "");

  if (!name || !category || !expiryDateRaw || Number.isNaN(quantityRaw) || quantityRaw <= 0) {
    throw new Error("Invalid inventory item data.");
  }

  const expiryDate = new Date(expiryDateRaw);
  if (Number.isNaN(expiryDate.getTime())) {
    throw new Error("Invalid expiry date.");
  }

  await prisma.inventoryItem.create({
    data: {
      name,
      category,
      quantity: quantityRaw,
      unit: "وحدة",
      expiryDate,
      status: computeInventoryStatus(expiryDate),
      userId,
    },
  });

  revalidatePath("/dashboard/inventory");
}

export async function getAvailableDonations() {
  return prisma.donation.findMany({
    where: { status: { in: ["AVAILABLE", "PENDING", "RESERVED"] } },
    orderBy: { createdAt: "desc" },
    include: {
      donor: { select: { id: true, name: true } },
      charity: { select: { id: true, name: true } },
    },
  });
}

export async function getCharities() {
  const charities = await prisma.charity.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          donations: {
            where: { status: "COMPLETED" },
          },
        },
      },
    },
  });

  return charities.map((charity) => ({
    ...charity,
    donationsCount: charity._count.donations,
  }));
}

export async function getMyDonations() {
  const userId = await getCurrentUserId();
  return prisma.donation.findMany({
    where: { donorId: userId },
    orderBy: { createdAt: "desc" },
    include: {
      charity: { select: { id: true, name: true } },
    },
  });
}

export async function createDonationRequest(id: string) {
  const userId = await getCurrentUserId();
  const donation = await prisma.donation.findUnique({ where: { id } });

  if (!donation) {
    throw new Error("Donation not found.");
  }

  if (donation.status !== DonationStatus.AVAILABLE) {
    throw new Error("Donation is not available.");
  }

  await prisma.donation.update({
    where: { id },
    data: {
      status: DonationStatus.PENDING,
      receiverId: userId,
    },
  });

  revalidatePath("/dashboard/donations");
}

export async function getDonationsStats() {
  const [completed, pending, charities] = await Promise.all([
    prisma.donation.aggregate({
      where: { status: "COMPLETED" },
      _sum: { quantity: true },
    }),
    prisma.donation.count({
      where: { status: "PENDING" },
    }),
    prisma.charity.count(),
  ]);

  return {
    totalDonated: completed._sum.quantity ?? 0,
    partnerCharities: charities,
    pendingDonations: pending,
  };
}
