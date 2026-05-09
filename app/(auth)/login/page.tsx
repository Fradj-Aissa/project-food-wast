"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Leaf, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/schemas";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginInput) {
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        redirect: true,
        callbackUrl: "/dashboard",
        email: data.email,
        password: data.password,
      });

      if (!result?.ok) {
        setError(result?.error ?? "Invalid email or password");
      }
    } catch {
      setError("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4" dir="rtl">
      <Card className="w-full max-w-md border-border/50 shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-lg bg-primary/10">
            <Leaf className="size-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">تسجيل الدخول</CardTitle>
          <CardDescription>أدخل بياناتك للوصول إلى لوحة التحكم الخاصة بك</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>البريد الإلكتروني</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="name@example.com"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>كلمة المرور</FormLabel>
                      <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                        نسيت كلمة المرور؟
                      </Link>
                    </div>
                    <FormControl>
                      <Input type="password" disabled={isLoading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    جاري التحميل...
                  </>
                ) : (
                  "تسجيل الدخول"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-center text-sm text-muted-foreground">
          <div>
            ليس لديك حساب؟{" "}
            <Link href="/register" className="ms-1 font-semibold text-primary hover:underline">
              إنشاء حساب جديد
            </Link>
          </div>
          <div className="mt-4">
            <Link
              href="/"
              className="flex items-center justify-center gap-1 text-sm text-muted-foreground hover:text-primary"
            >
              العودة للصفحة الرئيسية
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
