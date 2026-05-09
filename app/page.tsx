import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf, BarChart3, CalendarClock, Heart, ArrowLeft, ChevronDown, CheckCircle2, Sparkles, Shield, Zap } from "lucide-react"
import { ThemeProvider } from "@/components/theme-provider"

const features = [
  {
    icon: BarChart3,
    title: "تحليلات ذكية",
    description: "تحليلات متقدمة تساعدك على فهم أنماط الهدر واتخاذ قرارات مبنية على البيانات",
  },
  {
    icon: CalendarClock,
    title: "تتبع الصلاحية",
    description: "تنبيهات تلقائية قبل انتهاء صلاحية المنتجات لتقليل الهدر",
  },
  {
    icon: Heart,
    title: "منصة التبرع",
    description: "تواصل مع الجمعيات الخيرية للتبرع بالطعام الفائض بدلاً من إهداره",
  },
]

const stats = [
  { value: "٥٠٠+", label: "مطعم ومنزل" },
  { value: "١٠ طن", label: "طعام تم إنقاذه" },
  { value: "٣٠٪", label: "تقليل في الهدر" },
]

export default function LandingPage() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="min-h-screen bg-background">
        {/* Navigation */}
        <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary">
                <Leaf className="size-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">إدارة الهدر</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost">تسجيل الدخول</Button>
              </Link>
              <Link href="/register">
                <Button>
                  <span>ابدأ الآن</span>
                  <ArrowLeft className="me-2 size-4" />
                </Button>
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 md:py-32">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
          <div className="container mx-auto px-4 text-center">
            <div className="mx-auto max-w-3xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm text-primary">
                <Leaf className="size-4" />
                <span>نحو مستقبل مستدام</span>
              </div>
              <h1 className="mb-6 text-balance text-4xl font-bold leading-tight tracking-tight md:text-6xl">
                أوقف الهدر، وفر المال،
                <span className="text-primary"> واحمِ بيئتك</span>
              </h1>
              <p className="mx-auto mb-8 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
                نظام ذكي متكامل لمراقبة وتقليل هدر الطعام في المطاعم والمنازل.
                تتبع المخزون، احصل على تنبيهات الصلاحية، وتبرع بالفائض للمحتاجين.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/register">
                  <Button size="lg" className="gap-2 text-base">
                    <span>ابدأ مجاناً</span>
                    <ArrowLeft className="size-4" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="gap-2 text-base">
                  <span>شاهد العرض التوضيحي</span>
                  <ChevronDown className="size-4" />
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-3 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-primary md:text-4xl">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="border-t border-border bg-muted/30 py-20">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                كل ما تحتاجه في منصة واحدة
              </h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                أدوات متكاملة لإدارة المخزون وتقليل الهدر بذكاء
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <Card
                    key={index}
                    className="border-border/50 bg-card/50 backdrop-blur transition-all hover:border-primary/50 hover:shadow-lg"
                  >
                    <CardHeader>
                      <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="size-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <h2 className="mb-6 text-3xl font-bold md:text-4xl">
                  لماذا تختار نظامنا؟
                </h2>
                <div className="flex flex-col gap-4">
                  {[
                    "توفير يصل إلى ٣٠٪ من تكاليف الطعام",
                    "تنبيهات ذكية قبل انتهاء الصلاحية",
                    "تقارير تفصيلية وتحليلات متقدمة",
                    "ربط مباشر مع الجمعيات الخيرية",
                    "واجهة سهلة الاستخدام بالعربية",
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <CheckCircle2 className="size-4 text-primary" />
                      </div>
                      <span className="text-muted-foreground">{benefit}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-8">
                  <Link href="/register">
                    <Button size="lg" className="gap-2">
                      <span>جرب النظام الآن</span>
                      <ArrowLeft className="size-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent p-8">
                  <div className="flex h-full flex-col items-center justify-center gap-4 rounded-xl border border-border bg-card p-6 shadow-xl">
                    <div className="flex size-20 items-center justify-center rounded-full bg-primary/10">
                      <Leaf className="size-10 text-primary" />
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-primary">٤٥٠ كجم</div>
                      <div className="mt-2 text-muted-foreground">
                        طعام تم إنقاذه هذا الشهر
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t border-border bg-primary py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-4 text-3xl font-bold text-primary-foreground md:text-4xl">
              ابدأ رحلتك نحو الاستدامة اليوم
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-primary-foreground/80">
              انضم إلى مئات المطاعم والمنازل التي تستخدم نظامنا لتقليل الهدر
              وتوفير المال
            </p>
            <Link href="/register">
              <Button
                size="lg"
                variant="secondary"
                className="gap-2 text-base"
              >
                <span>ابدأ الآن مجاناً</span>
                <ArrowLeft className="size-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border bg-muted/30 py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
                  <Leaf className="size-4 text-primary-foreground" />
                </div>
                <span className="font-bold">نظام مراقبة هدر الطعام</span>
              </div>
              <p className="text-sm text-muted-foreground">
                © ٢٠٢٤ جميع الحقوق محفوظة. صُنع بـ ❤️ للبيئة
              </p>
            </div>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  )
}
