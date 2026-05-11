type Column<T> = { header: string; cell: (row: T) => React.ReactNode };

export function DataTable<T>({ columns, rows, empty }: { columns: Column<T>[]; rows: T[]; empty: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>{columns.map((column) => <th key={column.header} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{column.header}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.length ? rows.map((row, index) => <tr key={index} className="hover:bg-slate-50">{columns.map((column) => <td key={column.header} className="px-5 py-4 text-sm text-slate-700">{column.cell(row)}</td>)}</tr>) : <tr><td className="px-5 py-8 text-center text-sm text-slate-500" colSpan={columns.length}>{empty}</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
