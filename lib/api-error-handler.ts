interface HttpError {
  response?: {
    data?: {
      detail?: string | Array<{ loc: string[]; msg: string }>;
    };
    status?: number;
  };
}

export function extractErrorMessage(
  error: unknown,
  defaultMessage: string = "Ha ocurrido un error",
): string {
  let errorMessage = defaultMessage;

  // Si es un error HTTP (Axios, Fetch, etc)
  if (typeof error === "object" && error !== null && "response" in error) {
    const httpError = error as HttpError;
    const detail = httpError.response?.data?.detail;

    if (typeof detail === "string") {
      errorMessage = detail;
    } else if (Array.isArray(detail)) {
      // Pydantic validation errors
      errorMessage = detail.map((err) => err.msg).join(", ");
    }

    // Agregar contexto por código de estado
    const status = httpError.response?.status;
    if (status === 404) {
      errorMessage = `No encontrado: ${errorMessage}`;
    } else if (status === 422) {
      errorMessage = `Datos inválidos: ${errorMessage}`;
    } else if (status === 401) {
      errorMessage = `No autorizado: ${errorMessage}`;
    } else if (status === 403) {
      errorMessage = `Acceso denegado: ${errorMessage}`;
    } else if (status === 500) {
      errorMessage = `Error del servidor: ${errorMessage}`;
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return errorMessage;
}
