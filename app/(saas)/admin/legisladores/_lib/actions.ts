"use server";

import { serverApi } from "@/lib/server-api";
import { revalidatePath } from "next/cache";
import {
  CreatePersonRequest,
  UpdatePersonRequest,
  CreateLegislatorPeriodRequest,
  CreateCandidateRequest,
  updateLegislatorPeriodRequest,
} from "@/interfaces/admin";
import {
  BulkUpdateLegislatorsRequest,
  BulkUpdateLegislatorsResponse,
} from "./types";

// ============= PERSONAS =============

export async function createPerson(data: CreatePersonRequest) {
  try {
    const result = await serverApi.post(
      "/api/v1/politics/admin/personas",
      data,
    );
    revalidatePath("/admin/persons");
    revalidatePath("/admin/legislators");
    revalidatePath("/admin/candidates");
    return { success: true, data: result };
  } catch (error) {
    console.error("Error creating person:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al crear persona",
    };
  }
}

export async function updatePerson(
  personId: string,
  data: UpdatePersonRequest,
) {
  try {
    const result = await serverApi.put(
      `/api/v1/politics/admin/personas/${personId}`,
      data,
    );
    revalidatePath("/admin/persons");
    revalidatePath("/admin/legislators");
    revalidatePath("/admin/candidates");
    return { success: true, data: result };
  } catch (error) {
    console.error("Error updating person:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Error al actualizar persona",
    };
  }
}

// ============= LEGISLADORES =============

export async function createLegislatorPeriod(
  data: CreateLegislatorPeriodRequest,
) {
  try {
    const result = await serverApi.post(
      `/api/v1/politics/admin/legislators/new-period`,
      data,
    );
    revalidatePath("/admin/legislators");
    return { success: true, data: result };
  } catch (error) {
    console.error("Error creating legislator period:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error al crear periodo legislativo",
    };
  }
}

export async function updateLegislatorPeriod(
  data: updateLegislatorPeriodRequest,
) {
  try {
    const result = await serverApi.put(
      `/api/v1/politics/admin/legislators/${data.id}`,
      data,
    );
    revalidatePath("/admin/legislators");
    return { success: true, data: result };
  } catch (error) {
    console.error("Error updating legislator period:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error al actualizar periodo legislativo",
    };
  }
}

export async function deleteLegislatorPeriod(legislatorId: string) {
  try {
    const result = await serverApi.delete(
      `/api/v1/politics/admin/legislators/${legislatorId}`,
    );
    revalidatePath("/admin/legislators");
    return { success: true, data: result };
  } catch (error) {
    console.error("Error deleting legislator period:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error al eliminar periodo legislativo",
    };
  }
}

export async function bulkUpdateLegislators(
  input: BulkUpdateLegislatorsRequest,
) {
  try {
    const result = await serverApi.patch<BulkUpdateLegislatorsResponse>(
      "/api/v1/politics/admin/legislators/bulk-update",
      input,
    );

    revalidatePath("/admin/legislators");

    return {
      data: result,
      error: null,
    };
  } catch (error) {
    console.error("Error updating legislators:", error);
    return {
      data: null,
      error:
        error instanceof Error
          ? error.message
          : "Error al actualizar legisladores",
    };
  }
}
// ============= CANDIDATOS =============

export async function createCandidate(data: CreateCandidateRequest) {
  try {
    const result = await serverApi.post(
      "/api/v1/politics/admin/candidaturas",
      data,
    );
    revalidatePath("/admin/candidates");
    return { success: true, data: result };
  } catch (error) {
    console.error("Error creating candidate:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Error al crear candidatura",
    };
  }
}

export async function updateCandidate(
  candidateId: string,
  data: CreateCandidateRequest,
) {
  try {
    const result = await serverApi.put(
      `/api/v1/politics/admin/candidaturas/${candidateId}`,
      data,
    );
    revalidatePath("/admin/candidates");
    return { success: true, data: result };
  } catch (error) {
    console.error("Error updating candidate:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error al actualizar candidatura",
    };
  }
}
