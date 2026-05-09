"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface WasteTrendPoint {
  date: string
  day: string
  cost: number
}

export function WasteTrendsChart({ data }: { data: WasteTrendPoint[] }) {
  const dzdFormatter = new Intl.NumberFormat("ar-DZ-u-nu-latn", {
    style: "currency",
    currency: "DZD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  const compactFormatter = new Intl.NumberFormat("ar-DZ-u-nu-latn", {
    notation: "compact",
    maximumFractionDigits: 1,
  })

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle>اتجاهات تكلفة الهدر خلال آخر 7 أيام</CardTitle>
        <CardDescription>
          عرض مجموع تكاليف الهدر اليومية من سجلات WasteLog الحقيقية
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-75 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="day"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                axisLine={{ stroke: "hsl(var(--border))" }}
              />
              <YAxis
                width={72}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                axisLine={{ stroke: "hsl(var(--border))" }}
                tickFormatter={(value) => `${compactFormatter.format(Number(value))} دج`}
              />
              <Tooltip
                formatter={(value) => dzdFormatter.format(Number(value))}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                  direction: "rtl",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Legend
                wrapperStyle={{ direction: "rtl" }}
                formatter={(value) => (
                  <span style={{ color: "hsl(var(--foreground))" }}>{value}</span>
                )}
              />
              <Bar
                dataKey="cost"
                fill="hsl(8 88% 56%)"
                radius={[4, 4, 0, 0]}
                name="تكلفة الهدر"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
