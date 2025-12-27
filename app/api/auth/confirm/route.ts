import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // El token_hash es lo que envía Supabase en el link del correo
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  // A donde redirigir después de verificar
  const next = searchParams.get("next") ?? "/";

  // Si hay token y es de tipo signup o recovery
  if (token_hash && type) {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    // Si no hubo error, la sesión se creó y las cookies se guardaron
    if (!error) {
      // Redirigir al usuario (ya logueado)
      // Puedes mandarlo a /auth/login?status=verified si prefieres que se logueen de nuevo
      // O directo al dashboard (next)
      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  // Si hubo error, redirigir a una página de error
  return NextResponse.redirect(
    new URL("/auth/login?error=VerificationFailed", request.url),
  );
}
