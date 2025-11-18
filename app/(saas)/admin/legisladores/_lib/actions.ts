"use server";

import { serverApi } from "@/lib/server-api";
import { revalidatePath } from "next/cache";
import {
  CreatePersonRequest,
  UpdatePersonRequest,
  CreateLegislatorPeriodRequest,
  UpdateLegislatorPeriodRequest,
} from "@/interfaces/admin";
import {
  BulkUpdateLegislatorsRequest,
  BulkUpdateLegislatorsResponse,
} from "./types";
import { extractErrorMessage } from "@/lib/api-error-handler";
import {
  CreateParliamentaryMembership,
  UpdateParliamentaryMembership,
} from "@/interfaces/parliamentary-membership";

// ============= PERSONAS =============

export async function createPerson(data: CreatePersonRequest) {
  try {
    const result = await serverApi.post(
      "/api/v1/politics/admin/personas",
      data,
    );
    revalidatePath("/admin/legisladores");
    revalidatePath("/admin/candidatos");
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
    revalidatePath("/admin/legisladores");
    revalidatePath("/admin/candidatos");
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
      `/api/v1/politics/admin/legisladores/new-period`,
      data,
    );
    revalidatePath("/admin/legisladores");
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
  data: UpdateLegislatorPeriodRequest,
) {
  try {
    const result = await serverApi.put(
      `/api/v1/politics/admin/legisladores/${data.id}`,
      data,
    );
    revalidatePath("/admin/legisladores");
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
      `/api/v1/politics/admin/legisladores/${legislatorId}`,
    );
    revalidatePath("/admin/legisladores");
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
      "/api/v1/politics/admin/legisladores/bulk-update",
      input,
    );

    revalidatePath("/admin/legisladores");

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

export async function createParliamentaryMembership(
  legislator_id: string,
  data: CreateParliamentaryMembership,
) {
  try {
    const result = await serverApi.post(
      `/api/v1/admin/legislators/${legislator_id}/memberships`,
      data,
    );
    revalidatePath("/admin/legisladores");
    return { success: true, data: result };
  } catch (error) {
    console.error("Error creating membership:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error al crear cambio de bancada",
    };
  }
}

export async function updateParliamentaryMembership(
  legislator_id: string,
  data: UpdateParliamentaryMembership,
) {
  try {
    const { id, ...bodyData } = data;
    const result = await serverApi.put(
      `/api/v1/admin/legislators/${legislator_id}/memberships/${id}`,
      bodyData,
    );
    revalidatePath("/admin/legisladores");
    return { success: true, data: result };
  } catch (error) {
    console.error("Error updating membership:", error);
    return {
      success: false,
      error: extractErrorMessage(
        error,
        "Error al actualizar cambio de bancada",
      ),
    };
  }
}

export async function deleteParliamentaryMembership(
  legislator_id: string,
  membership_id: string,
) {
  try {
    await serverApi.delete(
      `/api/v1/admin/legislators/${legislator_id}/memberships/${membership_id}`,
    );

    revalidatePath("/admin/legisladores");

    return {
      success: true,
      message: "Cambio de bancada eliminado exitosamente",
    };
  } catch (error) {
    console.error("Error deleting membership:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error al eliminar cambio de bancada",
    };
  }
}
// ============= CANDIDATOS =============

// export async function createCandidate(data: CreateCandidateRequest) {
//   try {
//     const result = await serverApi.post(
//       "/api/v1/politics/admin/candidaturas",
//       data
//     );
//     revalidatePath("/admin/candidatos");
//     return { success: true, data: result };
//   } catch (error) {
//     console.error("Error creating candidate:", error);
//     return {
//       success: false,
//       error:
//         error instanceof Error ? error.message : "Error al crear candidatura",
//     };
//   }
// }

// export async function updateCandidate(
//   candidateId: string,
//   data: CreateCandidateRequest
// ) {
//   try {
//     const result = await serverApi.put(
//       `/api/v1/politics/admin/candidaturas/${candidateId}`,
//       data
//     );
//     revalidatePath("/admin/candidatos");
//     return { success: true, data: result };
//   } catch (error) {
//     console.error("Error updating candidate:", error);
//     return {
//       success: false,
//       error:
//         error instanceof Error
//           ? error.message
//           : "Error al actualizar candidatura",
//     };
//   }
// }
