import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { listShareholders } from "@/lib/shareholders/shareholder-service";

export default async function ShareholdersPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const { items, total } = await listShareholders(searchParams);
  type ShareholderRow = (typeof items)[number];

  return (
    <div className="space-y-5">
      <header>
        <p className="text-sm uppercase tracking-wide text-slate-500">Equity register</p>
        <h2 className="text-2xl font-bold">Shareholders</h2>
        <p className="text-sm text-slate-600">{total} shareholder records</p>
      </header>
      <DataTable<ShareholderRow>
        rows={items}
        empty="No shareholders found."
        columns={[
          { header: "Legal name", cell: (row) => <span className="font-medium text-slate-950">{row.legalName}</span> },
          { header: "Email", cell: (row) => row.email },
          { header: "Class", cell: (row) => <Badge tone="blue">{row.shareClass}</Badge> },
          { header: "Shares", cell: (row) => row.shares.toString() },
          { header: "Country", cell: (row) => row.country },
        ]}
      />
    </div>
  );
}
