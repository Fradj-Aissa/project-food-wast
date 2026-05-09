"use server";

import { prisma } from "../prisma";
import { donationSchema } from "../schemas";

export async function createDonation(donorId: string, data: unknown) {
  try {
    const parsed = donationSchema.parse(data);

    const donation = await prisma.donation.create({
      data: {
        title: parsed.title,
        description: parsed.description,
        quantity: parsed.quantity,
        unit: parsed.unit,
        donorId,
        status: "AVAILABLE",
      },
      include: {
        donor: { select: { id: true, name: true, email: true } },
      },
    });

    return { donation };
  } catch (error: any) {
    if (error.errors) {
      return { error: error.errors[0].message };
    }
    return { error: "حدث خطأ أثناء إنشاء التبرع" };
  }
}

export async function getDonations(filters?: {
  status?: string;
  receiverId?: string;
  excludeDonorId?: string;
}) {
  try {
    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.receiverId) {
      where.receiverId = filters.receiverId;
    }

    if (filters?.excludeDonorId) {
      where.donorId = { not: filters.excludeDonorId };
    }

    const donations = await prisma.donation.findMany({
      where,
      include: {
        donor: { select: { id: true, name: true, email: true } },
        receiver: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return { donations };
  } catch (error) {
    return { error: "حدث خطأ أثناء جلب التبرعات" };
  }
}

export async function acceptDonation(donationId: string, receiverId: string) {
  try {
    const donation = await prisma.donation.findUnique({
      where: { id: donationId },
    });

    if (!donation) {
      return { error: "التبرع غير موجود" };
    }

    if (donation.status !== "AVAILABLE") {
      return { error: "هذا التبرع غير متاح" };
    }

    const updated = await prisma.donation.update({
      where: { id: donationId },
      data: {
        status: "COMPLETED",
        receiverId,
      },
      include: {
        donor: { select: { id: true, name: true } },
        receiver: { select: { id: true, name: true } },
      },
    });

    return { donation: updated };
  } catch (error) {
    return { error: "حدث خطأ أثناء قبول التبرع" };
  }
}

export async function cancelDonation(donationId: string) {
  try {
    const donation = await prisma.donation.findUnique({
      where: { id: donationId },
    });

    if (!donation) {
      return { error: "التبرع غير موجود" };
    }

    const updated = await prisma.donation.update({
      where: { id: donationId },
      data: { status: "CANCELLED" },
    });

    return { donation: updated };
  } catch (error) {
    return { error: "حدث خطأ أثناء إلغاء التبرع" };
  }
}

export async function convertProductToDonation(
  userId: string,
  productId: string
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || product.userId !== userId) {
      return { error: "المنتج غير موجود" };
    }

    const donation = await prisma.donation.create({
      data: {
        title: product.name,
        description: `${product.quantity} ${product.unit} من ${product.category}`,
        quantity: product.quantity,
        unit: product.unit,
        donorId: userId,
        status: "AVAILABLE",
      },
    });

    await prisma.product.delete({
      where: { id: productId },
    });

    return { donation };
  } catch (error) {
    return { error: "حدث خطأ أثناء تحويل المنتج إلى تبرع" };
  }
}
