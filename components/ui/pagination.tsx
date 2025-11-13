import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

interface SimplePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  baseUrl: string;
  pageSizeOptions?: number[];
  currentFilters?: Record<string, unknown>;
}

export function SimplePagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  baseUrl,
  pageSizeOptions = [10, 20, 30, 40, 50],
  currentFilters = {},
}: SimplePaginationProps) {
  const router = useRouter();

  const buildUrl = (newOffset: number, newLimit?: number) => {
    const params = new URLSearchParams();

    // Mantener filtros actuales
    Object.entries(currentFilters).forEach(([key, value]) => {
      if (key !== "offset" && key !== "limit" && value) {
        params.set(key, String(value));
      }
    });

    // Agregar nuevos valores de paginación
    params.set("offset", String(newOffset));
    params.set("limit", String(newLimit ?? itemsPerPage));

    return `${baseUrl}?${params.toString()}`;
  };

  const handlePageSizeChange = (value: string) => {
    const newLimit = Number(value);
    router.push(buildUrl(0, newLimit));
  };

  const goToPage = (page: number) => {
    const newOffset = (page - 1) * itemsPerPage;
    router.push(buildUrl(newOffset));
  };

  const canPreviousPage = currentPage > 1;
  const canNextPage = currentPage < totalPages;

  // Calcular el rango de items mostrados
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex w-full flex-col-reverse items-center justify-between gap-4 overflow-auto p-1 sm:flex-row sm:gap-8">
      <div className="flex-1 whitespace-nowrap text-sm text-muted-foreground">
        Mostrando {startItem} a {endItem} de {totalItems} resultado(s)
      </div>

      <div className="flex flex-col-reverse items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
        <div className="flex items-center space-x-2">
          <p className="whitespace-nowrap text-sm font-medium">
            Filas por pág.
          </p>
          <Select
            value={`${itemsPerPage}`}
            onValueChange={handlePageSizeChange}
          >
            <SelectTrigger className="h-8 w-[4.5rem]">
              <SelectValue placeholder={itemsPerPage} />
            </SelectTrigger>
            <SelectContent side="top">
              {pageSizeOptions.map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-center text-sm font-medium">
          Pág. {currentPage} de {totalPages}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            aria-label="Ir a la primera página"
            variant="outline"
            className="hidden size-8 p-0 lg:flex cursor-pointer"
            onClick={() => goToPage(1)}
            disabled={!canPreviousPage}
          >
            <ChevronsLeft className="size-4" aria-hidden="true" />
          </Button>

          <Button
            aria-label="Ir a la página anterior"
            variant="outline"
            size="icon"
            className="size-8 cursor-pointer"
            onClick={() => goToPage(currentPage - 1)}
            disabled={!canPreviousPage}
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </Button>

          <Button
            aria-label="Ir a la página siguiente"
            variant="outline"
            size="icon"
            className="size-8 cursor-pointer"
            onClick={() => goToPage(currentPage + 1)}
            disabled={!canNextPage}
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </Button>

          <Button
            aria-label="Ir a la última página"
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex cursor-pointer"
            onClick={() => goToPage(totalPages)}
            disabled={!canNextPage}
          >
            <ChevronsRight className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  );
}
