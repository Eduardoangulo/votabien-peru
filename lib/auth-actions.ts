"use server";

import { createClient } from "@/lib/supabase/server";
import { LoginSchema, RegisterSchema } from "@/schemas/auth"; // Reusamos tus schemas
import { redirect } from "next/navigation";
import { z } from "zod";
import { User } from "@supabase/supabase-js";

type GetUserResponse = {
  user: User | null;
  error?: string | null;
};

export async function serverGetUser(): Promise<GetUserResponse> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return { user: null, error: error?.message || "No session" };
    }

    return { user, error: null };
  } catch (error) {
    return { user: null, error: "Internal Error" };
  }
}

type AuthActionResponse = {
  error?: string;
  success?: boolean;
};

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

  redirect("/");
}

export async function serverRegister(
  values: z.infer<typeof RegisterSchema>,
): Promise<AuthActionResponse> {
  const supabase = await createClient();

  const { email, password, name } = values;

  const { error } = await supabase.auth.signUp({
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

  return { success: true };
}

export async function serverLogout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/auth/login");
}
