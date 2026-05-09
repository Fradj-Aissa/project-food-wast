"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { addInventoryItem } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import { Plus, Search, Package, Loader2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { InventoryItem } from "@prisma/client";

type Props = {
  items: InventoryItem[];
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "FRESH":
      return <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20">طازج</Badge>;
    case "EXPIRING":
      return <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20">ينتهي قريباً</Badge>;
    case "EXPIRED":
      return <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/20">منتهي الصلاحية</Badge>;
    default:
      return null;
  }
};

export default function InventoryClient({ items }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [isPending, startTransition] = useTransition();

  const filteredData = useMemo(() => {
    return items.filter((item) => item.name.includes(searchQuery) || item.category.includes(searchQuery));
  }, [items, searchQuery]);

  const onSubmit = (formData: FormData) => {
    formData.set("category", category);
    startTransition(async () => {
      try {
        await addInventoryItem(formData);
        toast.success("تمت إضافة المنتج بنجاح");
        setIsDialogOpen(false);
      } catch (error) {
        toast.error("فشل إضافة المنتج");
      }
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">إدارة المخزون</h1>
          <p className="text-muted-foreground">تتبع جميع المنتجات الغذائية في المخزون</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="size-4" />
              <span>إضافة منتج جديد</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>إضافة منتج جديد</DialogTitle>
              <DialogDescription>أدخل بيانات المنتج الجديد لإضافته إلى المخزون</DialogDescription>
            </DialogHeader>
            <form action={onSubmit}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="productName">اسم المنتج</FieldLabel>
                  <Input id="productName" name="name" placeholder="مثال: طماطم طازجة" required />
                </Field>
                <Field>
                  <FieldLabel htmlFor="category">الفئة</FieldLabel>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="اختر الفئة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="خضروات">خضروات</SelectItem>
                        <SelectItem value="فواكه">فواكه</SelectItem>
                        <SelectItem value="ألبان">ألبان</SelectItem>
                        <SelectItem value="لحوم">لحوم</SelectItem>
                        <SelectItem value="حبوب">حبوب</SelectItem>
                        <SelectItem value="مخبوزات">مخبوزات</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="quantity">الكمية</FieldLabel>
                  <Input id="quantity" name="quantity" type="number" min="0.1" step="0.1" placeholder="مثال: 5" required />
                </Field>
                <Field>
                  <FieldLabel htmlFor="expiryDate">تاريخ الانتهاء</FieldLabel>
                  <Input id="expiryDate" name="expiryDate" type="date" required />
                </Field>
              </FieldGroup>
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="outline" type="button" onClick={() => setIsDialogOpen(false)} disabled={isPending}>
                  إلغاء
                </Button>
                <Button type="submit" disabled={isPending || !category}>
                  {isPending ? <Loader2 className="size-4 animate-spin" /> : "حفظ المنتج"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="size-5" />
            قائمة المنتجات
          </CardTitle>
          <CardDescription>إجمالي {items.length} منتج في المخزون</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="ابحث عن منتج أو فئة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ps-10"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>اسم المنتج</TableHead>
                  <TableHead>الفئة</TableHead>
                  <TableHead>الكمية</TableHead>
                  <TableHead>تاريخ الانتهاء</TableHead>
                  <TableHead>الحالة</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.quantity} وحدة</TableCell>
                    <TableCell>{formatDate(item.expiryDate)}</TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
