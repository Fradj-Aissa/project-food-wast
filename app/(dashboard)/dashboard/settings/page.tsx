"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Field, FieldLabel, FieldGroup, FieldDescription } from "@/components/ui/field"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  User,
  Bell,
  Shield,
  Building2,
  Save,
} from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">الإعدادات</h1>
        <p className="text-muted-foreground">
          إدارة إعدادات حسابك وتفضيلات النظام
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="profile" className="gap-2">
            <User className="size-4" />
            الملف الشخصي
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="size-4" />
            الإشعارات
          </TabsTrigger>
          <TabsTrigger value="business" className="gap-2">
            <Building2 className="size-4" />
            بيانات المنشأة
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="size-4" />
            الأمان
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>الملف الشخصي</CardTitle>
              <CardDescription>
                تحديث معلوماتك الشخصية وبيانات الاتصال
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="firstName">الاسم الأول</FieldLabel>
                    <Input id="firstName" defaultValue="أحمد" />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="lastName">اسم العائلة</FieldLabel>
                    <Input id="lastName" defaultValue="محمد" />
                  </Field>
                </div>
                <Field>
                  <FieldLabel htmlFor="email">البريد الإلكتروني</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    defaultValue="ahmed@example.com"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="phone">رقم الجوال</FieldLabel>
                  <Input
                    id="phone"
                    type="tel"
                    defaultValue="+966 50 123 4567"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="language">اللغة</FieldLabel>
                  <Select defaultValue="ar">
                    <SelectTrigger id="language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="ar">العربية</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              </FieldGroup>
              <div className="mt-6 flex justify-end">
                <Button className="gap-2">
                  <Save className="size-4" />
                  <span>حفظ التغييرات</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات الإشعارات</CardTitle>
              <CardDescription>
                تحكم في كيفية وموعد استلام الإشعارات
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="font-medium">تنبيهات انتهاء الصلاحية</p>
                  <p className="text-sm text-muted-foreground">
                    إشعارات قبل انتهاء صلاحية المنتجات
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="font-medium">تقارير أسبوعية</p>
                  <p className="text-sm text-muted-foreground">
                    ملخص أداء إدارة الهدر كل أسبوع
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="font-medium">طلبات التبرع</p>
                  <p className="text-sm text-muted-foreground">
                    إشعارات عند ورود طلبات تبرع جديدة
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="font-medium">تحديثات النظام</p>
                  <p className="text-sm text-muted-foreground">
                    أخبار وتحديثات منصة إدارة الهدر
                  </p>
                </div>
                <Switch />
              </div>
              <Separator />
              <Field>
                <FieldLabel>وقت التنبيهات اليومية</FieldLabel>
                <Select defaultValue="morning">
                  <SelectTrigger className="w-full sm:w-64">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="morning">صباحاً (8:00 ص)</SelectItem>
                      <SelectItem value="noon">ظهراً (12:00 م)</SelectItem>
                      <SelectItem value="evening">مساءً (6:00 م)</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FieldDescription>
                  الوقت المفضل لاستلام الإشعارات اليومية
                </FieldDescription>
              </Field>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Business Settings */}
        <TabsContent value="business" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>بيانات المنشأة</CardTitle>
              <CardDescription>
                معلومات المطعم أو المنزل المسجل
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="businessName">اسم المنشأة</FieldLabel>
                  <Input id="businessName" defaultValue="مطعم السلطان" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="businessType">نوع المنشأة</FieldLabel>
                  <Select defaultValue="restaurant">
                    <SelectTrigger id="businessType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="restaurant">مطعم</SelectItem>
                        <SelectItem value="cafe">مقهى</SelectItem>
                        <SelectItem value="hotel">فندق</SelectItem>
                        <SelectItem value="home">منزل</SelectItem>
                        <SelectItem value="catering">تموين</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="address">العنوان</FieldLabel>
                  <Input
                    id="address"
                    defaultValue="الرياض، حي النخيل، شارع الملك فهد"
                  />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="city">المدينة</FieldLabel>
                    <Input id="city" defaultValue="الرياض" />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="postalCode">الرمز البريدي</FieldLabel>
                    <Input id="postalCode" defaultValue="12345" />
                  </Field>
                </div>
              </FieldGroup>
              <div className="mt-6 flex justify-end">
                <Button className="gap-2">
                  <Save className="size-4" />
                  <span>حفظ التغييرات</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>الأمان والخصوصية</CardTitle>
              <CardDescription>
                إدارة كلمة المرور وإعدادات الأمان
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="currentPassword">
                    كلمة المرور الحالية
                  </FieldLabel>
                  <Input id="currentPassword" type="password" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="newPassword">
                    كلمة المرور الجديدة
                  </FieldLabel>
                  <Input id="newPassword" type="password" />
                  <FieldDescription>
                    يجب أن تحتوي على 8 أحرف على الأقل
                  </FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="confirmPassword">
                    تأكيد كلمة المرور
                  </FieldLabel>
                  <Input id="confirmPassword" type="password" />
                </Field>
              </FieldGroup>
              <Separator className="my-6" />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="font-medium">التحقق بخطوتين</p>
                  <p className="text-sm text-muted-foreground">
                    إضافة طبقة أمان إضافية لحسابك
                  </p>
                </div>
                <Switch />
              </div>
              <div className="mt-6 flex justify-end">
                <Button className="gap-2">
                  <Shield className="size-4" />
                  <span>تحديث الأمان</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
