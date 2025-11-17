import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { API_BASE_URL } from "./config";

class ServerApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private async getAuthToken(): Promise<string> {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
    if (!token) {
      redirect("/");
    }

    return token;
  }

  async get<T = unknown>(endpoint: string): Promise<T> {
    const token = await this.getAuthToken();

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (response.status === 401) {
      redirect("/");
    }
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  async post<T = unknown>(endpoint: string, data: unknown): Promise<T> {
    const token = await this.getAuthToken();

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.status === 401) {
      redirect("/");
    }

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  async put<T = unknown>(endpoint: string, data: unknown): Promise<T> {
    const token = await this.getAuthToken();

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.status === 401) {
      redirect("/");
    }

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  async patch<T = unknown>(endpoint: string, data: unknown): Promise<T> {
    const token = await this.getAuthToken();

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.status === 401) {
      redirect("/");
    }

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  async delete<T = unknown>(endpoint: string): Promise<T> {
    const token = await this.getAuthToken();

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 401) {
      redirect("/");
    }

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    // ✅ Si es 204 No Content, no hay body que parsear
    if (response.status === 204 || response.status === 205) {
      return null as T;
    }

    // ✅ Verificar si hay contenido antes de parsear
    const contentLength = response.headers.get("content-length");
    if (contentLength === "0") {
      return null as T;
    }

    // ✅ Leer texto primero para evitar errores
    const text = await response.text();
    if (!text || text.trim() === "") {
      return null as T;
    }

    // ✅ Parsear JSON solo si hay contenido
    try {
      return JSON.parse(text) as T;
    } catch {
      return null as T;
    }
  }
}

export const serverApi = new ServerApiClient();
