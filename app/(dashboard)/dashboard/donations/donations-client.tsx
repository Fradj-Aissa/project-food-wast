"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { createDonationRequest } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate } from "@/lib/utils";
import { Heart, Clock, MapPin, Package, Users, CheckCircle2, Building2, Loader2 } from "lucide-react";
import type { Donation, Charity } from "@prisma/client";

type DonationWithCharity = Donation & { charity: { id: string; name: string } | null };
type CharityWithCount = Charity & { donationsCount: number };

type Props = {
  availableDonations: DonationWithCharity[];
  charities: CharityWithCount[];
  myDonations: DonationWithCharity[];
  stats: {
    totalDonated: number;
    partnerCharities: number;
    pendingDonations: number;
  };
};

export default function DonationsClient({
  availableDonations,
  charities,
  myDonations,
  stats,
}: Props) {
  const [isPending, startTransition] = useTransition();

  const requestDonation = (id: string) => {
    startTransition(async () => {
      try {
        await createDonationRequest(id);
        toast.success("تم إرسال طلب التبرع بنجاح");
      } catch {
        toast.error("تعذر إرسال الطلب");
      }
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">سوق التبرعات</h1>
        <p className="text-muted-foreground">تبرع بالطعام الفائض للجمعيات الخيرية بدلاً من إهداره</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
              <Heart className="size-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalDonated} كجم</p>
              <p className="text-sm text-muted-foreground">تم التبرع به</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex size-12 items-center justify-center rounded-full bg-emerald-500/10">
              <Users className="size-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.partnerCharities}</p>
              <p className="text-sm text-muted-foreground">جمعية شريكة</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex size-12 items-center justify-center rounded-full bg-amber-500/10">
              <Package className="size-6 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.pendingDonations}</p>
              <p className="text-sm text-muted-foreground">تبرعات معلقة</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="available" className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="available">تبرعات متاحة</TabsTrigger>
          <TabsTrigger value="charities">الجمعيات الشريكة</TabsTrigger>
          <TabsTrigger value="my-donations">تبرعاتي</TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="mt-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {availableDonations.map((donation) => (
              <Card key={donation.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex size-12 items-center justify-center rounded-lg bg-muted text-2xl">🍽️</div>
                    {donation.status === "RESERVED" ? (
                      <Badge className="bg-amber-500/10 text-amber-600">بانتظار التأكيد</Badge>
                    ) : (
                      <Badge className="bg-emerald-500/10 text-emerald-600">متاح</Badge>
                    )}
                  </div>
                  <CardTitle className="mt-3 text-lg">{donation.title}</CardTitle>
                  <CardDescription>{donation.description ?? "لا يوجد وصف"}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Package className="size-4" />
                    <span>الكمية: {donation.quantity} {donation.unit}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="size-4" />
                    <span>{donation.pickupTime ?? "غير محدد"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="size-4" />
                    <span>{donation.location ?? "غير محدد"}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full gap-2" disabled={isPending || donation.status !== "AVAILABLE"} onClick={() => requestDonation(donation.id)}>
                    {isPending ? <Loader2 className="size-4 animate-spin" /> : <Heart className="size-4" />}
                    <span>طلب التبرع</span>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="charities" className="mt-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {charities.map((charity) => (
              <Card key={charity.id}>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-2xl">
                      {charity.image ?? "🏛️"}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{charity.name}</CardTitle>
                      <CardDescription>{charity.description ?? "جمعية خيرية شريكة"}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="size-4 text-primary" />
                    <span className="text-muted-foreground">{charity.donationsCount} تبرع مستلم</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full gap-2">
                    <Building2 className="size-4" />
                    <span>عرض التفاصيل</span>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="my-donations" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>سجل تبرعاتي</CardTitle>
              <CardDescription>جميع التبرعات التي قمت بها</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myDonations.map((donation) => (
                  <div key={donation.id} className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                        <Heart className="size-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{donation.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {donation.charity?.name ?? "بدون جمعية"} • {donation.quantity} {donation.unit}
                        </p>
                      </div>
                    </div>
                    <div className="text-start">
                      <Badge className="bg-emerald-500/10 text-emerald-600">تم التسليم</Badge>
                      <p className="mt-1 text-xs text-muted-foreground">{formatDate(donation.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
