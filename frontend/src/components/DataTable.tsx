'use client';

import { useMemo, useState } from 'react';

export interface DataTableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (row: any) => React.ReactNode;
}

interface DataTableProps {
  columns: DataTableColumn[];
  data: any[];
  onRowClick?: (row: any) => void;
  pageSize?: number;
  loading?: boolean;
}

export function DataTable({
  columns,
  data,
  onRowClick,
  pageSize = 20,
  loading = false,
}: DataTableProps) {
  const [sortKey, setSortKey] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);

  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    const sorted = [...data].sort((a, b) => {
      const aVal = a[sortKey] ?? '';
      const bVal = b[sortKey] ?? '';
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return sortOrder === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
    return sorted;
  }, [data, sortKey, sortOrder]);

  const total = sortedData.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const currentData = sortedData.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (column: DataTableColumn) => {
    if (!column.sortable) return;
    if (sortKey === column.key) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(column.key);
      setSortOrder('asc');
    }
    setPage(1);
  };

  const showCardView = typeof window !== 'undefined' ? window.innerWidth < 768 : false;

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: pageSize }).map((_, idx) => (
          <div key={idx} className="h-10 bg-gray-200 animate-pulse rounded" />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <p className="text-gray-500">Nenhum registro encontrado.</p>;
  }

  if (showCardView) {
    return (
      <div className="space-y-3">
        {currentData.map((row, idx) => (
          <div
            key={idx}
            onClick={() => onRowClick?.(row)}
            className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition cursor-pointer"
          >
            {columns.map((col) => (
              <div key={col.key} className="mb-1 text-sm">
                <span className="font-semibold">{col.label}: </span>
                <span>{col.render ? col.render(row) : row[col.key]}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="sticky top-0 bg-gray-50 z-10">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                onClick={() => handleSort(column)}
                className={`px-4 py-2 text-left text-sm font-semibold text-gray-700 ${column.sortable ? 'cursor-pointer select-none' : ''}`}
              >
                <div className="inline-flex items-center gap-2">
                  {column.label}
                  {column.sortable && sortKey === column.key && (
                    <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentData.map((row, idx) => (
            <tr
              key={idx}
              onClick={() => onRowClick?.(row)}
              className="hover:bg-gray-50 cursor-pointer"
            >
              {columns.map((column) => (
                <td key={column.key} className="px-4 py-3 text-sm text-gray-700 border-t border-gray-100">
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center justify-between gap-2 mt-3 text-sm">
        <div className="text-gray-600">
          {Math.min((page - 1) * pageSize + 1, total)}-{Math.min(page * pageSize, total)} de {total}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1}
            className="px-3 py-1 rounded bg-gray-100 disabled:opacity-50"
          >
            Anterior
          </button>
          <span>{page} / {pageCount}</span>
          <button
            onClick={() => setPage((prev) => Math.min(pageCount, prev + 1))}
            disabled={page === pageCount}
            className="px-3 py-1 rounded bg-gray-100 disabled:opacity-50"
          >
            Próximo
          </button>
        </div>
      </div>
    </div>
  );
}
