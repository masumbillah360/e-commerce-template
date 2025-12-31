"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function AdminNav({
    className,
    ...props
}: React.HTMLAttributes<HTMLElement>) {
    const pathname = usePathname();

    const routes = [
        { href: `/admin`, label: 'Overview', active: pathname === `/admin` },
        { href: `/admin/billboards`, label: 'Billboards', active: pathname.includes(`/admin/billboards`) },
        { href: `/admin/categories`, label: 'Categories', active: pathname.includes(`/admin/categories`) },
        { href: `/admin/sizes`, label: 'Sizes', active: pathname.includes(`/admin/sizes`) },
        { href: `/admin/colors`, label: 'Colors', active: pathname.includes(`/admin/colors`) },
        { href: `/admin/products`, label: 'Products', active: pathname.includes(`/admin/products`) },
        { href: `/admin/orders`, label: 'Orders', active: pathname.includes(`/admin/orders`) },
    ];

    return (
        <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
            {routes.map((route) => (
                <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                        "text-sm font-medium transition-colors hover:text-primary",
                        route.active ? "text-black dark:text-white" : "text-muted-foreground"
                    )}
                >
                    {route.label}
                </Link>
            ))}
        </nav>
    );
}