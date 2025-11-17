// import { DateRangePicker } from "@/components/date-range-picker";
import { type SearchParams } from "@/lib/types";
import { Shell } from "@/components/shell";
import { Data2TableSkeleton, Skeleton } from "@/components/ui/skeletons";
import React, { Suspense } from "react";
import { LegislatorsTable } from "./_components/legislator-table";
import { searchParamsCache } from "./_lib/validation";
import {
  getLegislators,
  getChamberTypeCounts,
  getDistrictsCounts,
  getLegislatorConditionCounts,
} from "./_lib/data";
import { CreateLegislator } from "./_components/buttons";
import { AdminLegislatorProvider } from "@/components/context/admin-legislator";
import { publicApi } from "@/lib/public-api";
import {
  ElectoralDistrictBase,
  PoliticalPartyListPaginated,
} from "@/interfaces/politics";
import { ParliamentaryGroupBasic } from "@/interfaces/parliamentary-membership";

interface IndexPageProps {
  searchParams: Promise<SearchParams>;
}
export default async function ClearancePage(props: IndexPageProps) {
  const searchParams = await props.searchParams;
  const search = searchParamsCache.parse(searchParams);
  const promises = Promise.all([
    getLegislators(search),
    getChamberTypeCounts(),
    getLegislatorConditionCounts(),
    getDistrictsCounts(),
  ]);
  const [districts, parties, parliamentaryGroups] = await Promise.all([
    publicApi.getDistritos() as Promise<ElectoralDistrictBase[]>,
    publicApi.getPartidos({
      active: true,
      limit: 100,
    }) as Promise<PoliticalPartyListPaginated>,
    publicApi.getParliamentaryGroups(true) as Promise<
      ParliamentaryGroupBasic[]
    >,
  ]);
  return (
    <Shell className="gap-2 mx-auto">
      <AdminLegislatorProvider
        districts={districts}
        parties={parties.items}
        parliamentaryGroups={parliamentaryGroups}
      >
        {/* <FeatureFlagsProvider> */}
        <Suspense fallback={<Skeleton className="h-7 w-52" />}>
          <div className="flex flex-row justify-between px-1">
            {/* <DateRangePicker
          triggerSize="sm"
          triggerClassName="ml-auto w-56 sm:w-60"
          align="end"
          shallow={false}
        /> */}
            <CreateLegislator />
          </div>
        </Suspense>
        <Suspense
          fallback={
            <Data2TableSkeleton
              columnCount={6}
              searchableColumnCount={1}
              filterableColumnCount={2}
              cellWidths={["10rem", "40rem", "12rem", "12rem", "8rem", "8rem"]}
              shrinkZero
            />
          }
        >
          <LegislatorsTable promises={promises} />
        </Suspense>
        {/* </FeatureFlagsProvider> */}
      </AdminLegislatorProvider>
    </Shell>
  );
}
