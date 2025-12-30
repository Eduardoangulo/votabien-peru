"use server";

import { createClient } from "@/lib/supabase/server";
import { LoginSchema, RegisterSchema } from "@/schemas/auth";
import { redirect } from "next/navigation";
import { z } from "zod";
import { User } from "@supabase/supabase-js";

// ============================================
// TIPOS
// ============================================
export type UserRole = "user" | "editor" | "admin";

export type UserProfile = {
  id: string;
  full_name: string | null;
  role: UserRole;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
};

type GetUserResponse = {
  user: User | null;
  profile: UserProfile | null;
  error?: string | null;
};

type AuthActionResponse = {
  error?: string;
  success?: boolean;
};

// ============================================
// OBTENER USUARIO CON PERFIL
// ============================================

export async function serverGetUser(): Promise<GetUserResponse> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return {
        user: null,
        profile: null,
        error: error?.message || "No session",
      };
    }

    // Obtener el perfil con el rol
    const { data: rawProfile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("Error fetching profile:", profileError);
      // Si no existe el perfil, podrías crearlo aquí o manejarlo
      return { user, profile: null, error: profileError.message };
    }

    const profile: UserProfile = {
      ...rawProfile,
      role: (rawProfile.role as UserRole) || "user", // Fallback seguro a "user"
      // Aseguramos que los campos requeridos no sean null (aunque la BD lo evite)
      created_at: rawProfile.created_at || new Date().toISOString(),
      updated_at: rawProfile.updated_at || new Date().toISOString(),
    };
    return { user, profile, error: null };
  } catch (error) {
    console.error("Unexpected error in serverGetUser:", error);
    return { user: null, profile: null, error: "Internal Error" };
  }
}

// ============================================
// LOGIN
// ============================================
export async function serverLogin(
  values: z.infer<typeof LoginSchema>,
): Promise<AuthActionResponse> {
  const supabase = await createClient();
  const { email, password } = values;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  // ANTES: redirect("/");  <-- ESTO CAUSABA EL ERROR

  // AHORA: Retornamos éxito para que el cliente redirija
  return { success: true };
}

// ============================================
// REGISTRO
// ============================================
export async function serverRegister(
  values: z.infer<typeof RegisterSchema>,
): Promise<AuthActionResponse> {
  const supabase = await createClient();

  const { email, password, name } = values;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  // El trigger debería crear el perfil automáticamente
  // pero puedes verificar si se creó correctamente
  if (data.user) {
    const { error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", data.user.id)
      .single();

    if (profileError) {
      console.error("Profile was not created:", profileError);
      // Opcional: podrías crear el perfil manualmente aquí como fallback
    }
  }

  return { success: true };
}

// ============================================
// LOGOUT
// ============================================
export async function serverLogout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/auth/login");
}

// ============================================
// VERIFICAR ROL (Utility)
// ============================================
export async function serverCheckRole(allowedRoles: UserRole[]) {
  const { user, profile } = await serverGetUser();

  if (!user || !profile) {
    redirect("/auth/login");
  }

  if (!allowedRoles.includes(profile.role)) {
    redirect("/unauthorized");
  }

  return { user, profile };
}

// ============================================
// VERIFICAR SI ES ADMIN (Utility)
// ============================================
export async function serverRequireAdmin() {
  return serverCheckRole(["admin"]);
}

// ============================================
// VERIFICAR SI ES EDITOR O ADMIN (Utility)
// ============================================
export async function serverRequireEditor() {
  return serverCheckRole(["editor", "admin"]);
}

// ============================================
// ACTUALIZAR ROL (Solo para admins)
// ============================================
export async function serverUpdateUserRole(
  userId: string,
  newRole: UserRole,
): Promise<AuthActionResponse> {
  const supabase = await createClient();

  // Verificar que quien ejecuta sea admin
  const { profile: currentUserProfile } = await serverGetUser();

  if (!currentUserProfile || currentUserProfile.role !== "admin") {
    return { error: "No tienes permisos para realizar esta acción" };
  }

  // No permitir que el admin se quite su propio rol
  if (userId === currentUserProfile.id && newRole !== "admin") {
    return { error: "No puedes cambiar tu propio rol de administrador" };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ role: newRole })
    .eq("id", userId);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

// ============================================
// ACTUALIZAR PERFIL (Datos propios)
// ============================================
export async function serverUpdateProfile(
  updates: Partial<Pick<UserProfile, "full_name" | "bio" | "avatar_url">>,
): Promise<AuthActionResponse> {
  const supabase = await createClient();

  const { user } = await serverGetUser();

  if (!user) {
    return { error: "No autenticado" };
  }

  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

// ============================================
// OBTENER TODOS LOS USUARIOS (Solo para admins)
// ============================================
export async function serverGetAllUsers() {
  const supabase = await createClient();

  // Verificar que sea admin
  await serverRequireAdmin();

  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching users:", error);
    return { profiles: [], error: error.message };
  }

  return { profiles, error: null };
}
