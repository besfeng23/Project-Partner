"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, FolderKanban, Settings, ChevronsLeft, ChevronsRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ProjectPartnerIcon } from "./icons"
import { useSidebar } from "./ui/sidebar"

const navItems = [
    { href: "/", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/projects", icon: FolderKanban, label: "Projects" },
    { href: "/settings", icon: Settings, label: "Settings" },
]

export function MainSidebar() {
    const pathname = usePathname()
    const { state, toggleSidebar } = useSidebar();

    return (
        <div className="flex h-full flex-col">
            <div className="flex h-16 items-center justify-between px-4 shrink-0 border-b border-border">
                <Link href="/" className="flex items-center gap-2 text-lg font-semibold font-headline">
                    <ProjectPartnerIcon className="h-6 w-6" />
                    <span className={cn("transition-opacity", state === 'collapsed' && "opacity-0 w-0")}>Project Partner</span>
                </Link>
                <Button variant="ghost" size="icon" className="h-8 w-8 hidden md:flex" onClick={toggleSidebar}>
                    {state === 'expanded' ? <ChevronsLeft className="h-4 w-4" /> : <ChevronsRight className="h-4 w-4" />}
                </Button>
            </div>
            <nav className="flex-1 space-y-2 px-4 py-4">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                                isActive && "bg-accent text-primary",
                                state === 'collapsed' && 'justify-center'
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            <span className={cn("truncate", state === 'collapsed' && "hidden")}>{item.label}</span>
                        </Link>
                    )
                })}
            </nav>
        </div>
    )
}
