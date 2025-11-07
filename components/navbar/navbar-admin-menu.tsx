"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { NavGroup } from "@/interfaces/navbar";

interface NavbarAdminMenuProps {
  navGroups: NavGroup[];
}

export const NavbarAdminMenu = ({ navGroups }: NavbarAdminMenuProps) => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="gap-2 h-10 px-4 font-medium">
            <div className="flex items-center justify-center w-5 h-5 rounded-md bg-primary/10 text-primary">
              <Plus className="w-3.5 h-3.5" />
            </div>
            <span className="hidden xl:inline">Administración</span>
          </NavigationMenuTrigger>

          <NavigationMenuContent align="end">
            <div className="w-[420px] p-3">
              {navGroups.map((group, index) => (
                <div key={index} className="mb-3 last:mb-1">
                  {group.label && (
                    <div className="px-2 py-1.5 mb-1.5">
                      <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        {group.label}
                      </h4>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-1.5">
                    {group.links.map((link) => {
                      const Icon = link.icon;
                      return (
                        <NavigationMenuLink key={link.href} asChild>
                          <Link
                            href={link.href}
                            className={cn(
                              "group flex items-center gap-3 px-3 py-2.5 rounded-lg",
                              "hover:bg-accent transition-all duration-200",
                              "focus:bg-accent focus:outline-none focus:ring-2 focus:ring-primary/20",
                              "border border-transparent hover:border-border/50",
                            )}
                          >
                            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/5 group-hover:bg-primary/10 group-hover:scale-110 transition-all shrink-0">
                              <Icon className="w-4 h-4 text-primary/70 group-hover:text-primary transition-colors" />
                            </div>

                            <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                              {link.label}
                            </span>
                          </Link>
                        </NavigationMenuLink>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};
