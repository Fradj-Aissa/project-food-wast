# خطة العمل الشاملة - نظام مراقبة هدر الطعام الذكي (Backend Plan)

## 1. تحليل البيانات (Data Analysis)
بناءً على مميزات النظام في الواجهة الأمامية (تتبع الصلاحية، منصة التبرعات، التحليلات)، نحتاج إلى الكيانات (Entities) التالية:
- **المستخدمون (Users)**: لتسجيل حسابات (المنازل، المطاعم، أو الجمعيات الخيرية).
- **المخزون (Inventory/Products)**: لتتبع المنتجات، كمياتها، وتواريخ صلاحيتها لتفعيل (تنبيهات الصلاحية).
- **التبرعات (Donations)**: لربط الفائض من المطاعم/المنازل مع الجمعيات الخيرية.
- **سجل الهدر (Waste Logs)**: لتسجيل كميات الهدر وأسبابها لبناء (التحليلات الذكية).

---

## 2. مخطط قاعدة البيانات (Prisma Schema)
هذا هو تصميم قاعدة البيانات باستخدام Prisma والذي يربط كل هذه البيانات معاً بسلاسة:

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum UserRole {
  HOME
  RESTAURANT
  CHARITY
  ADMIN
}

enum DonationStatus {
  AVAILABLE
  RESERVED
  COMPLETED
  CANCELLED
}

model User {
  id            String    @id @default(cuid())
  name          String
  email         String    @unique
  password      String
  role          UserRole  @default(HOME)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // العلاقات
  inventory     Product[]
  donations     Donation[] @relation("Donor")
  received      Donation[] @relation("Receiver")
  wasteLogs     WasteLog[]
}

model Product {
  id          String    @id @default(cuid())
  name        String
  category    String    // مثلا: خضروات، لحوم، ألبان
  quantity    Float
  unit        String    // مثلا: كجم، حبة، لتر
  expiryDate  DateTime
  createdAt   DateTime  @default(now())
  
  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Donation {
  id          String         @id @default(cuid())
  title       String
  description String?
  quantity    Float
  unit        String
  status      DonationStatus @default(AVAILABLE)
  createdAt   DateTime       @default(now())

  donorId     String
  donor       User           @relation("Donor", fields: [donorId], references: [id])
  
  receiverId  String?
  receiver    User?          @relation("Receiver", fields: [receiverId], references: [id])
}

model WasteLog {
  id          String    @id @default(cuid())
  reason      String    // سبب الهدر: انتهاء الصلاحية، تلف...
  quantity    Float
  unit        String
  loggedAt    DateTime  @default(now())

  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
}

قائمة المهام التنفيذية (Project Roadmap Checklist - Local DB Version)
المرحلة 1: إعداد البيئة المحلية (Local Environment Setup) 🛠️
[x] 1. تثبيت وتشغيل سيرفر قاعدة البيانات محلياً (SQLite).

[x] 2. إنشاء قاعدة بيانات جديدة للمشروع باسم dev.db في prisma/.

[x] 3. ضبط رابط الاتصال المحلي في ملف .env بصيغة SQLite:
DATABASE_URL="file:./prisma/dev.db"

[x] 4. تثبيت المكتبات الأساسية (Prisma, Next-Auth, Zod, Bcryptjs).

[x] 5. تهيئة Prisma وتعديل schema.prisma.

[x] 6. تنفيذ npx prisma db push لإنشاء الجداول في قاعدة البيانات.

المرحلة 2: نظام الحماية والدخول (Auth & Security) 🔐
[x] 1. إعداد ملف lib/prisma.ts (النمط الفردي Singleton) لضمان عدم استهلاك موارد الجهاز.

[x] 2. برمجة دالة registerUser لتشفير كلمة المرور وحفظ المستخدم.

[x] 3. إعداد NextAuth.js (إعداد auth.ts و الـ Secret key والـ API routes).

[x] 4. ربط واجهة "إنشاء حساب" (Signup) بالباك اند باستخدام react-hook-form و Zod.

[x] 5. ربط واجهة "تسجيل الدخول" (Login) وتفعيل الجلسات (Sessions).

[x] 6. تفعيل الـ Middleware لحماية الصفحات الخاصة (Dashboard).

المرحلة 3: منطق المخزن والهدر (Core Logic) 🍎
[x] 1. برمجة الـ Server Action الخاص بإضافة منتج جديد (addProduct).

[x] 2. برمجة دالة جلب المنتجات وعرضها في جدول المخزن (getProducts).

[x] 3. برمجة دالة تسجيل الهدر (logWaste) والعمليات المتعلقة (getWasteLogs, deleteWasteLog).

[x] 4. برمجة نظام التبرعات الكامل (createDonation, getDonations, acceptDonation, cancelDonation).

[x] 5. إعداد الـ Validation باستخدام Zod لجميع النماذج (Schemas).

المرحلة 4: التحليلات والتنبيهات (Advanced Features) 📊
[x] 1. بناء دالة حساب إحصائيات الهدر للأسبوع/الشهر (getWasteStats).

[x] 2. بناء دالة حساب إحصائيات التبرعات (getDonationStats).

[x] 3. بناء دالة حساب إحصائيات المخزن حسب الفئات (getInventoryStats).

[x] 4. برمجة نظام التنبيهات للمنتجات التي تقترب صلاحيتها من الانتهاء (getExpiringProducts, getAlerts).

[x] 5. إضافة ميزة "تحويل المنتج إلى تبرع" (convertProductToDonation).

المرحلة 5: الاختبار والإنتاج (Testing & Deployment) 🚀
[ ] 1. اختبار عملية التسجيل والدخول لكل أنواع الحسابات (مطعم/منزل/جمعية خيرية).

[ ] 2. اختبار جميع عمليات المخزن والتبرعات والهدر.

[ ] 3. اختبار الرسوم البيانية والإحصائيات والتنبيهات.

[ ] 4. تجربة الموقع على الجوال لضمان استجابة الواجهة (Responsive).

[ ] 5. نقل قاعدة البيانات من المحلي (Local/SQLite) إلى السحابي (Supabase/Neon) عند الرغبة في النشر النهائي.