import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Clock, Package } from "lucide-react"
import { cn } from "@/lib/utils"

type AlertItem = {
  id: string
  title: string
  description: string
  type: "urgent" | "warning" | "info"
  expiryDate: string
}

export function RecentAlerts({ alerts }: { alerts: AlertItem[] }) {
  const getAlertStyles = (type: string) => {
    switch (type) {
      case "urgent":
        return {
          badge: "bg-destructive/10 text-destructive hover:bg-destructive/20",
          icon: "text-destructive",
          label: "عاجل",
        }
      case "warning":
        return {
          badge: "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20",
          icon: "text-amber-600",
          label: "تحذير",
        }
      default:
        return {
          badge: "bg-primary/10 text-primary hover:bg-primary/20",
          icon: "text-primary",
          label: "معلومات",
        }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>تنبيهات حديثة</CardTitle>
        <CardDescription>التنبيهات والإشعارات المتعلقة بالمخزون</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {alerts.map((alert) => {
            const styles = getAlertStyles(alert.type)
            const Icon =
              alert.type === "urgent"
                ? AlertTriangle
                : alert.type === "warning"
                ? Clock
                : Package

            return (
              <div
                key={alert.id}
                className="flex items-start gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
              >
                <div
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-full bg-muted",
                    styles.icon
                  )}
                >
                  <Icon className="size-5" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-medium leading-none">{alert.title}</h4>
                    <Badge variant="secondary" className={styles.badge}>
                      {styles.label}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{alert.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Intl.DateTimeFormat("ar-SA", { dateStyle: "medium" }).format(new Date(alert.expiryDate))}
                  </p>
                </div>
              </div>
            )
          })}
          {alerts.length === 0 && (
            <p className="text-sm text-muted-foreground">لا توجد تنبيهات حالياً.</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
