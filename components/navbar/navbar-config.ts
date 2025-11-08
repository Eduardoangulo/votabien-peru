import {
  Home,
  Users,
  Flag,
  UserCheck,
  GitCompare,
  Info,
  // LayoutDashboard,
  FileEdit,
  // UserCog,
  // Settings,
} from "lucide-react";
import { NavGroup } from "@/interfaces/navbar";

export const publicNavGroups: NavGroup[] = [
  {
    links: [
      { href: "/", label: "Inicio", icon: Home },
      { href: "/legisladores", label: "Congresistas", icon: Users },
      { href: "/partidos", label: "Partidos", icon: Flag },
      { href: "/candidatos", label: "Candidatos 2026", icon: UserCheck },
      { href: "/comparador", label: "Comparador", icon: GitCompare },
      { href: "/nosotros", label: "Nosotros", icon: Info },
    ],
  },
];

export const adminNavGroups: NavGroup[] = [
  {
    label: "Gestión de Contenido",
    requiresAuth: true,
    requiresRole: ["super_admin", "admin", "editor"],
    links: [
      { href: "/admin/legisladores", label: "Legisladores", icon: FileEdit },
      { href: "/admin/partidos", label: "Partidos", icon: FileEdit },
      { href: "/admin/candidatos", label: "Candidatos", icon: FileEdit },
    ],
  },
  // {
  //   label: "Administración",
  //   requiresAuth: true,
  //   requiresRole: ["super_admin", "admin"],
  //   links: [
  //     { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  //     { href: "/admin/analytics", label: "Analíticas", icon: GitCompare },
  //   ],
  // },
  // {
  //   label: "Sistema",
  //   requiresAuth: true,
  //   requiresRole: ["super_admin"],
  //   links: [
  //     { href: "/admin/users", label: "Usuarios", icon: UserCog },
  //     { href: "/admin/settings", label: "Configuración", icon: Settings },
  //   ],
  // },
];

export const getAuthorizedNavGroups = (
  groups: NavGroup[],
  userRole?: string,
): NavGroup[] => {
  return groups
    .filter((group) => {
      if (!group.requiresAuth) return true;
      if (!userRole) return false;
      if (!group.requiresRole) return true;
      return group.requiresRole.some((role) => role === userRole);
    })
    .map((group) => ({
      ...group,
      links: group.links.filter(() => {
        return true;
      }),
    }));
};
