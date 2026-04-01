"use client";

import { useMemo, useState } from "react";

import { AppShell } from "@/components/layout/AppShell";
import { FilterPanel } from "@/components/filters/FilterPanel";
import type { AudienceViewMode } from "@/components/filters/ViewToggle";
import { MomentumScoreView } from "@/components/momentum/MomentumScoreView";
import { AudienceTable } from "@/components/table/AudienceTable";
import { MerchantDrawer } from "@/components/table/MerchantDrawer";
import { TableControls } from "@/components/table/TableControls";
import { useAudienceData, type SortKey } from "@/hooks/useAudienceData";
import { useMerchantData } from "@/hooks/useMerchantData";
import { BRANDS } from "@/lib/data/brands";
import { CATEGORIES } from "@/lib/data/categories";
import { formatBrandDisplayName } from "@/lib/text";
import type { AudienceRow } from "@/lib/types";

export default function HomePage() {
  const [selectedBrandId, setSelectedBrandId] = useState<string | undefined>();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>();
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<AudienceViewMode>("standard");
  const [selectedCommunity, setSelectedCommunity] = useState<AudienceRow | null>(null);
  const selectedBrand = useMemo(
    () => BRANDS.find((brand) => brand.id === selectedBrandId),
    [selectedBrandId],
  );
  const selectedCategory = useMemo(
    () => CATEGORIES.find((category) => category.id === selectedCategoryId),
    [selectedCategoryId],
  );

  const audienceQuery = useMemo(
    () => ({
      merchantKey: selectedBrand?.merchantKey,
      categoryName: selectedCategory?.name,
      states: selectedStates,
    }),
    [selectedBrand, selectedCategory, selectedStates],
  );

  const {
    isLoading: isAudienceLoading,
    error: audienceError,
    sortConfig,
    setSortConfig,
    searchQuery,
    setSearchQuery,
    rowsPerPage,
    setRowsPerPage,
    currentPage,
    setCurrentPage,
    processedData,
    pagedData,
  } = useAudienceData(audienceQuery);

  const {
    data: merchants,
    isLoading: isMerchantLoading,
    error: merchantError,
  } = useMerchantData({
    communityId: selectedCommunity?.communityId,
    merchantKey: selectedBrand?.merchantKey,
    categoryName: selectedCategory?.name,
    states: selectedStates,
  });

  function handleSort(key: SortKey) {
    if (!sortConfig || sortConfig.key !== key) {
      setSortConfig({ key, direction: "asc" });
      return;
    }
    if (sortConfig.direction === "asc") {
      setSortConfig({ key, direction: "desc" });
      return;
    }
    setSortConfig(null);
  }

  const hasCoreSelection = Boolean(selectedBrandId || selectedCategoryId);
  const selectedHeaderSegments = [
    selectedCategory?.name,
    selectedBrand ? formatBrandDisplayName(selectedBrand.name) : undefined,
  ].filter(
    (segment): segment is string => Boolean(segment),
  );
  const audienceHeaderTitle = selectedHeaderSegments.length
    ? `Audience Intelligence - ${selectedHeaderSegments.join(" / ")}`
    : "Audience Intelligence";

  const rightColumnContent =
    viewMode === "momentum" ? (
      selectedBrand ? (
        <MomentumScoreView brand={selectedBrand} />
      ) : (
        <section className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
          <h2 className="font-heading text-2xl text-black">Momentum Score View</h2>
          <p className="mt-2 text-black/70">
            Select a brand to enable Momentum Score.
          </p>
        </section>
      )
    ) : (
      <>
        <h1 className="mb-4 font-heading text-3xl text-black">{audienceHeaderTitle}</h1>
        <TableControls
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(nextRowsPerPage) => {
            setRowsPerPage(nextRowsPerPage);
            setCurrentPage(1);
          }}
          searchQuery={searchQuery}
          onSearchChange={(nextSearch) => {
            setSearchQuery(nextSearch);
            setCurrentPage(1);
          }}
          totalRows={processedData.length}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
        <AudienceTable
          rows={pagedData}
          selectedCommunityId={selectedCommunity?.communityId}
          isLoading={isAudienceLoading}
          canRenderTable={hasCoreSelection}
          sortConfig={sortConfig}
          onSort={handleSort}
          onRowClick={(row) =>
            setSelectedCommunity((current) =>
              current?.communityId === row.communityId ? null : row,
            )
          }
        />
        {audienceError && <p className="mt-3 text-sm text-red-300">{audienceError}</p>}
        {selectedCommunity && (
          <MerchantDrawer
            communityName={selectedCommunity.communityName}
            merchantCount={merchants.length}
            rows={merchants}
            isLoading={isMerchantLoading}
            onClose={() => setSelectedCommunity(null)}
          />
        )}
        {merchantError && selectedCommunity && (
          <p className="mt-3 text-sm text-red-300">{merchantError}</p>
        )}
      </>
    );

  return (
    <AppShell
      sidebar={
        <FilterPanel
          selectedBrandId={selectedBrandId}
          selectedCategoryId={selectedCategoryId}
          selectedStates={selectedStates}
          viewMode={viewMode}
          onBrandChange={(brandId) => {
            setSelectedBrandId(brandId);
            setSelectedCommunity(null);
            if (!brandId && viewMode === "momentum") {
              setViewMode("standard");
            }
          }}
          onCategoryChange={(categoryId) => {
            setSelectedCategoryId(categoryId);
            setSelectedCommunity(null);
            if (categoryId && viewMode === "momentum") {
              setViewMode("standard");
            }
          }}
          onStatesChange={(states) => {
            setSelectedStates(states);
            setSelectedCommunity(null);
          }}
          onViewModeChange={(nextMode) => {
            if (nextMode === "momentum" && !selectedBrandId) {
              return;
            }
            setViewMode(nextMode);
          }}
        />
      }
    >
      {rightColumnContent}
    </AppShell>
  );
}
