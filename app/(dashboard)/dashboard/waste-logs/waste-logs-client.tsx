"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { FileText, Plus } from "lucide-react"
import { formatDate, formatNumber } from "@/lib/utils"
import { addWasteLog } from "@/lib/actions/waste"

const wasteReasons = [
  { value: "تالف", label: "تالف" },
  { value: "بقايا زبائن", label: "بقايا زبائن" },
  { value: "خطأ في التحضير", label: "خطأ في التحضير" },
  { value: "منتهي الصلاحية", label: "منتهي الصلاحية" },
  { value: "سوء التخزين", label: "سوء التخزين" },
]

const products = [
  "طماطم",
  "خبز",
  "حليب",
  "دجاج",
  "أرز",
  "جبن",
  "خضروات مشكلة",
]

interface WasteLogItem {
  id: string
  productName: string
  quantity: string
  reason: string
  cost: number
  notes?: string | null
  createdAt: string | Date
}

export function WasteLogsClient({ wasteLogs }: { wasteLogs: WasteLogItem[] }) {
  const [selectedProduct, setSelectedProduct] = useState("")
  const [selectedReason, setSelectedReason] = useState("")

  const totalCost = wasteLogs.reduce((acc, item) => acc + item.cost, 0)

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">سجل الهدر</h1>
        <p className="text-muted-foreground">
          تسجيل ومتابعة حالات هدر الطعام وأسبابها
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Add New Waste Log Form */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="size-5" />
              تسجيل هدر جديد
            </CardTitle>
            <CardDescription>
              أدخل بيانات المنتج المهدر لتتبع الأسباب
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={addWasteLog} className="space-y-4">
              <input type="hidden" name="productName" value={selectedProduct} />
              <input type="hidden" name="reason" value={selectedReason} />
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="product">المنتج</FieldLabel>
                  <Select
                    value={selectedProduct}
                    onValueChange={setSelectedProduct}
                  >
                    <SelectTrigger id="product">
                      <SelectValue placeholder="اختر المنتج" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {products.map((product) => (
                          <SelectItem key={product} value={product}>
                            {product}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel htmlFor="quantity">الكمية</FieldLabel>
                  <Input
                    id="quantity"
                    name="quantity"
                    placeholder="مثال: 2 كجم"
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="reason">سبب الهدر</FieldLabel>
                  <Select
                    value={selectedReason}
                    onValueChange={setSelectedReason}
                  >
                    <SelectTrigger id="reason">
                      <SelectValue placeholder="اختر السبب" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {wasteReasons.map((reason) => (
                          <SelectItem key={reason.value} value={reason.value}>
                            {reason.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FieldDescription>
                    حدد السبب الرئيسي للهدر لتحليل أفضل
                  </FieldDescription>
                </Field>

                <Field>
                  <FieldLabel htmlFor="cost">التكلفة</FieldLabel>
                  <Input
                    id="cost"
                    name="cost"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="مثال: 25.50"
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="notes">ملاحظات إضافية</FieldLabel>
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder="أي تفاصيل إضافية..."
                    rows={3}
                  />
                </Field>

                <Button type="submit" className="w-full gap-2">
                  <Plus className="size-4" />
                  <span>تسجيل الهدر</span>
                </Button>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>

        {/* Waste Log History */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="size-5" />
                  سجل الهدر الأخير
                </CardTitle>
                <CardDescription>
                  آخر {wasteLogs.length} عمليات تسجيل
                </CardDescription>
              </div>
              <div className="rounded-lg bg-destructive/10 px-4 py-2">
                <p className="text-sm text-muted-foreground">إجمالي الخسائر</p>
                <p className="text-xl font-bold text-destructive">
                  {formatNumber(totalCost)} ر.س
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>المنتج</TableHead>
                    <TableHead>الكمية</TableHead>
                    <TableHead>السبب</TableHead>
                    <TableHead>التاريخ</TableHead>
                    <TableHead>التكلفة</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {wasteLogs.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.productName}
                      </TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{getReasonBadge(item.reason)}</TableCell>
                      <TableCell>{formatDate(item.createdAt)}</TableCell>
                      <TableCell className="font-medium text-destructive">
                        {formatNumber(item.cost)} ر.س
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function getReasonBadge(reason: string) {
  const colors: Record<string, string> = {
    "تالف": "bg-destructive/10 text-destructive",
    "بقايا زبائن": "bg-amber-500/10 text-amber-600",
    "خطأ في التحضير": "bg-orange-500/10 text-orange-600",
    "منتهي الصلاحية": "bg-red-500/10 text-red-600",
    "سوء التخزين": "bg-purple-500/10 text-purple-600",
  }

  return (
    <Badge className={colors[reason] || "bg-muted text-muted-foreground"}>
      {reason}
    </Badge>
  )
}
