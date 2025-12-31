'use client';
import Link from 'next/link';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';

const navigationMenuItems = [
    { title: 'Home', href: '#' },
    { title: 'Blog', href: '#blog' },
    { title: 'Docs', href: '#docs' },
];

export default function Navbar() {
    return (
        <NavigationMenu>
            <NavigationMenuList>
                {navigationMenuItems.map((item: { title: string; href: string }) => (
                    <NavigationMenuItem key={item.title}>
                        <NavigationMenuLink
                            className={navigationMenuTriggerStyle()}
                            asChild>
                            <Link href={item.href}>{item.title}</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                ))}
            </NavigationMenuList>
        </NavigationMenu>
    );
}
