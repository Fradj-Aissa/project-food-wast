import { Suspense } from "react"
import { StatsCard } from "@/components/dashboard/stats-card"
import { WasteTrendsChart } from "@/components/dashboard/waste-trends-chart"
import { WasteDistributionChart } from "@/components/dashboard/waste-distribution-chart"
import { RecentAlerts } from "@/components/dashboard/recent-alerts"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getWasteCostTrends } from "@/lib/actions/waste"
import {
  getDashboardStats,
  getExpiryAlerts,
  getPendingTasks,
  getSustainabilityImpact,
  getTopWasteOffenders,
  getWasteByReasonData,
} from "@/lib/actions/analytics"
import { Utensils, TrendingDown, Package, Heart, Trees, HandPlatter, ListTodo } from "lucide-react"

const numberFormatter = new Intl.NumberFormat("ar-DZ-u-nu-latn")
const moneyFormatter = new Intl.NumberFormat("ar-DZ-u-nu-latn", {
  style: "currency",
  currency: "DZD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

async function DashboardStatsSection() {
  const stats = await getDashboardStats()

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="إجمالي الطعام الذي تم إنقاذه"
        value={`${numberFormatter.format(stats.totalSavedFoodKg)} كجم`}
        description="من التبرعات المكتملة"
        icon={Utensils}
        variant="success"
      />
      <StatsCard
        title="الخسائر المالية"
        value={moneyFormatter.format(stats.totalWasteCost)}
        description="إجمالي الشهر الحالي"
        icon={TrendingDown}
        variant="destructive"
      />
      <StatsCard
        title="المنتجات النشطة"
        value={numberFormatter.format(stats.activeProducts)}
        description="في المخزون حالياً"
        icon={Package}
        variant="default"
      />
      <StatsCard
        title="التبرعات المعلقة"
        value={numberFormatter.format(stats.pendingDonations)}
        description="بانتظار التسليم"
        icon={Heart}
        variant="warning"
      />
    </div>
  )
}

async function DashboardChartsSection() {
  const [{ data: wasteTrendData }, wasteByReasonData] = await Promise.all([
    getWasteCostTrends(),
    getWasteByReasonData(),
  ])

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <WasteTrendsChart data={wasteTrendData ?? []} />
      <WasteDistributionChart data={wasteByReasonData} />
    </div>
  )
}

async function SustainabilityAndOffendersSection() {
  const [impact, offenders] = await Promise.all([
    getSustainabilityImpact(),
    getTopWasteOffenders(),
  ])

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-background to-emerald-600/5">
        <CardHeader>
          <CardTitle>أثر الاستدامة</CardTitle>
          <CardDescription>مؤشرات بيئية واجتماعية مباشرة من أداء التبرعات</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
            <div className="mb-2 flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
              <HandPlatter className="size-5" />
              <span className="text-sm font-medium">الوجبات الموفرة</span>
            </div>
            <p className="text-2xl font-bold text-emerald-800 dark:text-emerald-200">
              {numberFormatter.format(impact.savedMeals)}
            </p>
          </div>
          <div className="rounded-xl border border-emerald-600/30 bg-emerald-600/10 p-4">
            <div className="mb-2 flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
              <Trees className="size-5" />
              <span className="text-sm font-medium">CO2 الموفّر (كجم)</span>
            </div>
            <p className="text-2xl font-bold text-emerald-800 dark:text-emerald-200">
              {numberFormatter.format(impact.savedCo2Kg)}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-red-500/30 bg-gradient-to-br from-red-500/10 via-background to-red-700/5">
        <CardHeader>
          <CardTitle>المنتجات الأكثر هدراً</CardTitle>
          <CardDescription>أعلى 5 منتجات سببت خسائر مالية</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-red-500/20">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>المنتج</TableHead>
                  <TableHead className="text-right">الخسارة</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {offenders.map((item) => (
                  <TableRow key={item.productName}>
                    <TableCell className="font-medium">{item.productName}</TableCell>
                    <TableCell className="text-right text-red-700 dark:text-red-300">
                      {moneyFormatter.format(item.totalCost)}
                    </TableCell>
                  </TableRow>
                ))}
                {offenders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center text-muted-foreground">
                      لا توجد بيانات هدر كافية حتى الآن.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

async function AlertsAndTasksSection() {
  const [alerts, tasks] = await Promise.all([getExpiryAlerts(), getPendingTasks()])

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <RecentAlerts alerts={alerts} />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListTodo className="size-5" />
            المهام السريعة
          </CardTitle>
          <CardDescription>تنبيهات ذكية تحتاج متابعة فورية</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {tasks.staleDonations.map((task) => (
            <div key={task.id} className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
              <Badge className="mb-2 bg-amber-500/20 text-amber-700 dark:text-amber-300">تبرع معلق</Badge>
              <p className="text-sm">{task.label}</p>
            </div>
          ))}
          {tasks.expiringToday.map((task) => (
            <div key={task.id} className="rounded-lg border border-red-500/30 bg-red-500/10 p-3">
              <Badge className="mb-2 bg-red-500/20 text-red-700 dark:text-red-300">ينتهي اليوم</Badge>
              <p className="text-sm">{task.label}</p>
            </div>
          ))}
          {tasks.staleDonations.length === 0 && tasks.expiringToday.length === 0 && (
            <p className="text-sm text-muted-foreground">لا توجد مهام عاجلة حالياً.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function StatsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-4 w-2/3" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="mt-2 h-3 w-3/4" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function ChartsSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="col-span-full lg:col-span-2">
        <CardHeader>
          <Skeleton className="h-5 w-1/2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-72 w-full" />
        </CardContent>
      </Card>
      <Card className="col-span-full lg:col-span-1">
        <CardHeader>
          <Skeleton className="h-5 w-1/2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-72 w-full" />
        </CardContent>
      </Card>
    </div>
  )
}

function SustainabilitySkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader><Skeleton className="h-5 w-1/2" /></CardHeader>
        <CardContent><Skeleton className="h-40 w-full" /></CardContent>
      </Card>
      <Card>
        <CardHeader><Skeleton className="h-5 w-1/2" /></CardHeader>
        <CardContent><Skeleton className="h-40 w-full" /></CardContent>
      </Card>
    </div>
  )
}

function AlertsSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-1/3" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-56 w-full" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-1/3" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-56 w-full" />
        </CardContent>
      </Card>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">لوحة القيادة</h1>
        <p className="text-muted-foreground">لوحة ذكية لدعم اتخاذ القرار وقياس الأثر البيئي</p>
      </div>

      <Suspense fallback={<StatsSkeleton />}>
        <DashboardStatsSection />
      </Suspense>

      <Suspense fallback={<ChartsSkeleton />}>
        <DashboardChartsSection />
      </Suspense>

      <Suspense fallback={<SustainabilitySkeleton />}>
        <SustainabilityAndOffendersSection />
      </Suspense>

      <Suspense fallback={<AlertsSkeleton />}>
        <AlertsAndTasksSection />
      </Suspense>
    </div>
  )
}
