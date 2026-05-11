import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { listInvestors } from "@/lib/investors/investor-service";

export default async function InvestorsPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const { items, total } = await listInvestors(searchParams);
  type InvestorRow = (typeof items)[number];

  return (
    <div className="space-y-5">
      <header>
        <p className="text-sm uppercase tracking-wide text-slate-500">Capital pipeline</p>
        <h2 className="text-2xl font-bold">Investors</h2>
        <p className="text-sm text-slate-600">{total} investor profiles</p>
      </header>
      <DataTable<InvestorRow>
        rows={items}
        empty="No investors found."
        columns={[
          { header: "Legal name", cell: (row) => <span className="font-medium text-slate-950">{row.legalName}</span> },
          { header: "Contact", cell: (row) => row.contactEmail },
          { header: "Status", cell: (row) => <Badge tone={row.status === "ACTIVE" ? "green" : "amber"}>{row.status}</Badge> },
          { header: "Committed USD", cell: (row) => `$${row.committedUsd.toString()}` },
        ]}
      />
    </div>
  );
}
