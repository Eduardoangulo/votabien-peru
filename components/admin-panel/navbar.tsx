"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
  Settings,
  Plus,
  Sun,
  Moon,
  Monitor,
  Home,
  Users,
  Flag,
  UserCheck,
  GitCompare,
  Info,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface NavbarProps {
  user?: {
    id: string;
    name: string;
    email: string;
    is_admin: boolean;
  } | null;
}

interface NavLink {
  href: string;
  label: string;
  icon: React.ElementType;
}

const publicLinks: NavLink[] = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/legisladores", label: "Congresistas", icon: Users },
  { href: "/partidos", label: "Partidos", icon: Flag },
  { href: "/candidatos", label: "Candidatos 2026", icon: UserCheck },
  { href: "/comparator", label: "Comparador", icon: GitCompare },
  { href: "/about", label: "Nosotros", icon: Info },
];

const adminLinks: NavLink[] = [
  { href: "/dashboard", label: "Dashboard", icon: Settings },
  { href: "/admin/legisladores", label: "Gestión Legisladores", icon: Plus },
  { href: "/admin/partidos", label: "Gestión Partidos", icon: Plus },
];

// ============================================
// Mobile Navigation Component
// ============================================
interface MobileNavProps {
  user: NavbarProps["user"];
  pathname: string;
  onClose: () => void;
  onLogout: () => void;
  theme?: string;
  setTheme: (theme: string) => void;
}

const MobileNav = ({
  user,
  pathname,
  onClose,
  onLogout,
  theme,
  setTheme,
}: MobileNavProps) => {
  const isActiveLink = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-6 border-b border-border bg-gradient-to-br from-[var(--brand)]/5 to-transparent">
        {user ? (
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-gradient-to-br from-[var(--brand)] to-[var(--brand)]/80 rounded-full flex items-center justify-center ring-4 ring-[var(--brand)]/10 shadow-lg">
              <User className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-lg truncate">{user.name}</p>
              <p className="text-sm text-muted-foreground truncate">
                {user.email}
              </p>
              {user.is_admin && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 mt-2 bg-primary/15 text-primary text-xs font-semibold rounded-full border border-primary/20">
                  <Settings className="w-3 h-3" />
                  Administrador
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <h3 className="text-xl font-bold">
              <span className="text-[var(--brand)]">Vota Bien</span> Perú
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Información política transparente
            </p>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {/* Links públicos */}
        <nav className="space-y-1">
          {publicLinks.map((link) => {
            const Icon = link.icon;
            const isActive = isActiveLink(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                    : "text-foreground hover:bg-accent hover:translate-x-1",
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Links de admin */}
        {user?.is_admin && (
          <nav className="space-y-1 pt-4 border-t border-border">
            <p className="px-3 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
              Administración
            </p>
            {adminLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-foreground hover:bg-accent hover:translate-x-1 font-medium transition-all duration-200"
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        )}

        {/* Selector de tema */}
        <div className="pt-4 border-t border-border">
          <p className="px-3 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
            Apariencia
          </p>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant={theme === "light" ? "default" : "outline"}
              size="sm"
              onClick={() => setTheme("light")}
              className="flex-col h-auto py-4 gap-2 transition-all hover:scale-105"
            >
              <Sun className="w-5 h-5" />
              <span className="text-xs font-medium">Claro</span>
            </Button>
            <Button
              variant={theme === "dark" ? "default" : "outline"}
              size="sm"
              onClick={() => setTheme("dark")}
              className="flex-col h-auto py-4 gap-2 transition-all hover:scale-105"
            >
              <Moon className="w-5 h-5" />
              <span className="text-xs font-medium">Oscuro</span>
            </Button>
            <Button
              variant={theme === "system" ? "default" : "outline"}
              size="sm"
              onClick={() => setTheme("system")}
              className="flex-col h-auto py-4 gap-2 transition-all hover:scale-105"
            >
              <Monitor className="w-5 h-5" />
              <span className="text-xs font-medium">Auto</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Footer con acciones */}
      <div className="px-4 py-4 border-t border-border bg-card/50 backdrop-blur-sm">
        {user ? (
          <Button
            onClick={() => {
              onLogout();
              onClose();
            }}
            variant="destructive"
            className="w-full shadow-lg"
            size="lg"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </Button>
        ) : (
          <Button
            onClick={onClose}
            className="w-full shadow-lg"
            size="lg"
            asChild
          >
            <Link href="/auth/login">
              <User className="w-4 h-4 mr-2" />
              Iniciar Sesión
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};

// ============================================
// Main Navbar Component
// ============================================
const Navbar = ({ user }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActiveLink = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/v1/auth/logout", { method: "POST" });
      if (response.ok) window.location.href = "/";
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="w-5 h-5" />;
      case "dark":
        return <Moon className="w-5 h-5" />;
      default:
        return <Monitor className="w-5 h-5" />;
    }
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-card shadow-lg border-b border-border"
          : "bg-card/90 backdrop-blur-lg border-b border-border/60",
      )}
    >
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[var(--brand)] to-transparent opacity-60" />

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
              <Image
                src="/logo_completo.png"
                alt="Logo institucional"
                width={140}
                height={40}
                priority
                className="drop-shadow-md"
              />
            </div>
          </Link>

          <div className="hidden lg:flex items-center space-x-1">
            {publicLinks.slice(1).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2 rounded-lg font-medium transition-all duration-200",
                  isActiveLink(link.href)
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-foreground hover:bg-accent hover:text-accent-foreground",
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center space-x-2">
            {mounted ? (
              <>
                {/* Theme Toggle */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-accent transition-colors"
                    >
                      {getThemeIcon()}
                      <span className="sr-only">Cambiar tema</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground">
                      Tema
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setTheme("light")}
                      className="cursor-pointer"
                    >
                      <Sun className="w-4 h-4 mr-2" />
                      Claro
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setTheme("dark")}
                      className="cursor-pointer"
                    >
                      <Moon className="w-4 h-4 mr-2" />
                      Oscuro
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setTheme("system")}
                      className="cursor-pointer"
                    >
                      <Monitor className="w-4 h-4 mr-2" />
                      Sistema
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* User Actions */}
                {user ? (
                  <>
                    {user.is_admin && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 hover:bg-accent transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                            <span className="hidden xl:inline">Acciones</span>
                            <ChevronDown className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                          <DropdownMenuLabel>Gestión Rápida</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {adminLinks.map((link) => {
                            const Icon = link.icon;
                            return (
                              <DropdownMenuItem key={link.href} asChild>
                                <Link
                                  href={link.href}
                                  className="cursor-pointer flex items-center"
                                >
                                  <Icon className="w-4 h-4 mr-2" />
                                  {link.label}
                                </Link>
                              </DropdownMenuItem>
                            );
                          })}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-2 hover:bg-accent transition-colors"
                        >
                          <div className="w-8 h-8 bg-gradient-to-br from-[var(--brand)] to-[var(--brand)]/80 rounded-full flex items-center justify-center ring-2 ring-[var(--brand)]/20">
                            <User className="w-4 h-4 text-white" />
                          </div>
                          <span className="max-w-[100px] truncate hidden xl:inline">
                            {user.name}
                          </span>
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>
                          <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">
                              {user.name}
                            </p>
                            <p className="text-xs text-muted-foreground leading-none">
                              {user.email}
                            </p>
                            {user.is_admin && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 mt-2 bg-primary/10 text-primary text-xs font-medium rounded-md w-fit">
                                <Settings className="w-3 h-3" />
                                Administrador
                              </span>
                            )}
                          </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/profile" className="cursor-pointer">
                            <User className="w-4 h-4 mr-2" />
                            Mi Perfil
                          </Link>
                        </DropdownMenuItem>
                        {user.is_admin && (
                          <DropdownMenuItem asChild>
                            <Link href="/dashboard" className="cursor-pointer">
                              <Settings className="w-4 h-4 mr-2" />
                              Dashboard
                            </Link>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={handleLogout}
                          className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Cerrar Sesión
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                ) : (
                  <Button size="sm" asChild>
                    <Link href="/auth/login">Iniciar Sesión</Link>
                  </Button>
                )}
              </>
            ) : (
              <div className="w-32 h-10" />
            )}
          </div>

          {/* Mobile Menu */}
          <div className="flex lg:hidden">
            {mounted && (
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-accent transition-colors"
                  >
                    {isMobileMenuOpen ? (
                      <X className="w-6 h-6" />
                    ) : (
                      <Menu className="w-6 h-6" />
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-[320px] sm:w-[380px] p-0"
                >
                  <MobileNav
                    user={user}
                    pathname={pathname}
                    onClose={() => setIsMobileMenuOpen(false)}
                    onLogout={handleLogout}
                    theme={theme}
                    setTheme={setTheme}
                  />
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
