import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { listProperties } from "@/lib/properties/property-service";

export default async function PropertiesPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const { items, total } = await listProperties(searchParams);
  type PropertyRow = (typeof items)[number];

  return (
    <div className="space-y-5">
      <header>
        <p className="text-sm uppercase tracking-wide text-slate-500">Real assets</p>
        <h2 className="text-2xl font-bold">Properties</h2>
        <p className="text-sm text-slate-600">{total} properties</p>
      </header>
      <DataTable<PropertyRow>
        rows={items}
        empty="No properties found."
        columns={[
          { header: "Name", cell: (row) => <span className="font-medium text-slate-950">{row.name}</span> },
          { header: "Code", cell: (row) => row.code },
          { header: "Location", cell: (row) => `${row.city}, ${row.region}` },
          { header: "Status", cell: (row) => <Badge tone="blue">{row.status}</Badge> },
          { header: "Acquisition", cell: (row) => `$${row.acquisitionUsd.toString()}` },
        ]}
      />
    </div>
  );
}
