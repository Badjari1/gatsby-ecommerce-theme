import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { listDocuments } from "@/lib/documents/document-service";

export default async function DocumentsPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const { items, total } = await listDocuments(searchParams);
  type DocumentRow = (typeof items)[number];

  return (
    <div className="space-y-5">
      <header>
        <p className="text-sm uppercase tracking-wide text-slate-500">Controlled records</p>
        <h2 className="text-2xl font-bold">Documents</h2>
        <p className="text-sm text-slate-600">{total} documents</p>
      </header>
      <DataTable<DocumentRow>
        rows={items}
        empty="No documents found."
        columns={[
          { header: "Title", cell: (row) => <span className="font-medium text-slate-950">{row.title}</span> },
          { header: "Classification", cell: (row) => <Badge tone={row.classification === "CONFIDENTIAL" ? "amber" : "slate"}>{row.classification}</Badge> },
          { header: "Status", cell: (row) => row.status },
          { header: "Property", cell: (row) => row.property?.name ?? "—" },
          { header: "Uploaded by", cell: (row) => row.uploadedBy.name },
        ]}
      />
    </div>
  );
}
