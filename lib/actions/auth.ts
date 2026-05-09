"use server";

import { prisma } from "../prisma";
import { registerSchema, loginSchema } from "../schemas";
import bcrypt from "bcryptjs";

export async function registerUser(data: unknown) {
  try {
    const parsed = registerSchema.parse(data);

    const existing = await prisma.user.findUnique({
      where: { email: parsed.email },
    });

    if (existing) {
      return { error: "هذا البريد الإلكتروني مسجل بالفعل" };
    }

    const hashedPassword = await bcrypt.hash(parsed.password, 12);

    const user = await prisma.user.create({
      data: {
        name: parsed.name,
        email: parsed.email,
        password: hashedPassword,
        role: parsed.role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return { user };
  } catch (error: any) {
    if (error.errors) {
      return { error: error.errors[0].message };
    }
    return { error: "حدث خطأ أثناء التسجيل" };
  }
}

export async function loginUser(data: unknown) {
  try {
    const parsed = loginSchema.parse(data);

    const user = await prisma.user.findUnique({
      where: { email: parsed.email },
    });

    if (!user) {
      return { error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" };
    }

    const isPasswordValid = await bcrypt.compare(parsed.password, user.password);

    if (!isPasswordValid) {
      return { error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" };
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  } catch (error: any) {
    if (error.errors) {
      return { error: error.errors[0].message };
    }
    return { error: "حدث خطأ أثناء تسجيل الدخول" };
  }
}
