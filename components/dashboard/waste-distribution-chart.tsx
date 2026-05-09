"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const COLORS = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#f97316"]

type WasteReasonPoint = {
  name: string
  value: number
}

export function WasteDistributionChart({ data }: { data: WasteReasonPoint[] }) {
  const renderOutsideLabel = (props: any) => {
    const { cx, cy, midAngle, outerRadius, percent, name } = props
    const RADIAN = Math.PI / 180
    const baseX = cx + (outerRadius + 18) * Math.cos(-midAngle * RADIAN)
    const baseY = cy + (outerRadius + 18) * Math.sin(-midAngle * RADIAN)
    const isRightSide = baseX >= cx
    const x = isRightSide ? baseX + 20 : baseX - 20
    const textAnchor = isRightSide ? "start" : "end"
    const pct = (percent * 100).toFixed(0)

    return (
      <text x={x} y={baseY} fill="hsl(var(--foreground))" textAnchor={textAnchor} dominantBaseline="central">
        <tspan x={x}>{`${name} (${pct}%)`}</tspan>
      </text>
    )
  }

  return (
    <Card className="col-span-full lg:col-span-1">
      <CardHeader>
        <CardTitle>توزيع أسباب الهدر</CardTitle>
        <CardDescription>تحليل ديناميكي لأسباب الهدر من سجلات WasteLog</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-75 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={95}
                label={renderOutsideLabel}
                labelLine
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                  direction: "rtl",
                }}
              />
              <Legend
                wrapperStyle={{ direction: "rtl" }}
                formatter={(value) => <span style={{ color: "hsl(var(--foreground))" }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
