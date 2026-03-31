"use client";

type TableControlsProps = {
  rowsPerPage: number;
  onRowsPerPageChange: (value: number) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  totalRows: number;
  currentPage: number;
  onPageChange: (page: number) => void;
};

export function TableControls({
  rowsPerPage,
  onRowsPerPageChange,
  searchQuery,
  onSearchChange,
  totalRows,
  currentPage,
  onPageChange,
}: TableControlsProps) {
  const first = totalRows === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
  const last = Math.min(currentPage * rowsPerPage, totalRows);
  const totalPages = Math.max(Math.ceil(totalRows / rowsPerPage), 1);

  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-4 rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-3">
        <label className="text-xs uppercase tracking-wide text-black/70">Rows per page</label>
        <select
          value={rowsPerPage}
          onChange={(event) => onRowsPerPageChange(Number(event.target.value))}
          className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm text-black focus:border-accent focus:outline-none"
        >
          {[10, 25, 50, 100].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-3">
        <input
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search communities..."
          className="w-56 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-black placeholder:text-black/40 focus:border-accent focus:outline-none"
        />
        <p className="text-xs text-black/70">
          Showing {first} to {last} of {totalRows} entries
        </p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
            className="rounded border border-slate-300 px-2 py-1 text-xs text-black/80 disabled:opacity-40"
          >
            Prev
          </button>
          <span className="px-2 text-xs text-black/70">
            {currentPage}/{totalPages}
          </span>
          <button
            type="button"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage >= totalPages}
            className="rounded border border-slate-300 px-2 py-1 text-xs text-black/80 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
