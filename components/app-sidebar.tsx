"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  FileText,
  Heart,
  Settings,
  Leaf,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const navItems = [
  {
    title: "الرئيسية",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "إدارة المخزون",
    href: "/dashboard/inventory",
    icon: Package,
  },
  {
    title: "سجل الهدر",
    href: "/dashboard/waste-logs",
    icon: FileText,
  },
  {
    title: "التبرعات",
    href: "/dashboard/donations",
    icon: Heart,
  },
  {
    title: "الإعدادات",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

interface AppSidebarProps {
  collapsed: boolean
  onCollapsedChange: (collapsed: boolean) => void
}

export function AppSidebar({ collapsed, onCollapsedChange }: AppSidebarProps) {
  const pathname = usePathname()

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "fixed top-0 start-0 z-40 h-screen border-e border-sidebar-border bg-sidebar transition-all duration-300",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary">
              <Leaf className="size-5 text-primary-foreground" />
            </div>
            {!collapsed && (
              <span className="text-lg font-bold text-sidebar-foreground">
                إدارة الهدر
              </span>
            )}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onCollapsedChange(!collapsed)}
            className="size-8 text-sidebar-foreground hover:bg-sidebar-accent"
          >
            {collapsed ? (
              <ChevronLeft className="size-4" />
            ) : (
              <ChevronRight className="size-4" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 p-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            const linkContent = (
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <Icon className="size-5 shrink-0" />
                {!collapsed && <span>{item.title}</span>}
              </Link>
            )

            if (collapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                  <TooltipContent side="left" sideOffset={10}>
                    {item.title}
                  </TooltipContent>
                </Tooltip>
              )
            }

            return <div key={item.href}>{linkContent}</div>
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 start-0 end-0 border-t border-sidebar-border p-3">
          {!collapsed && (
            <div className="rounded-lg bg-sidebar-accent/50 p-3">
              <p className="text-xs text-sidebar-foreground/70">
                نظام مراقبة هدر الطعام
              </p>
              <p className="text-xs font-medium text-primary">الإصدار 1.0.0</p>
            </div>
          )}
        </div>
      </aside>
    </TooltipProvider>
  )
}
