import { Building2, FileCheck2, ShieldCheck, UsersRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";

const previewMetrics = [
  { label: "Shareholders", value: "248", description: "Verified equity holders" },
  { label: "Investor commitments", value: "$184.2M", description: "Active and pending capital" },
  { label: "Properties", value: "37", description: "Acquired and operating assets" },
  { label: "Controlled documents", value: "1,429", description: "Classified records under audit" },
];

const previewDocuments = [
  { title: "Q2 Board Resolution Package", classification: "BOARD_ONLY", owner: "Corporate Secretary", status: "ACTIVE" },
  { title: "Investor Capital Call Notice", classification: "CONFIDENTIAL", owner: "Investor Relations", status: "DRAFT" },
  { title: "Harbor Point Appraisal", classification: "INTERNAL", owner: "Property Operations", status: "ACTIVE" },
];

const workflows = [
  { icon: ShieldCheck, title: "Governance controls", text: "RBAC, audit trails, and classified document workflows protect board and shareholder operations." },
  { icon: UsersRound, title: "Shareholder registry", text: "Maintain share classes, holdings, certificates, and investor-facing governance records." },
  { icon: Building2, title: "Property oversight", text: "Track acquisition lifecycle, operating assets, and asset-level controlled documents." },
  { icon: FileCheck2, title: "Document evidence", text: "Checksum-backed storage metadata enables tamper-evident records and future object-storage integration." },
];

export default function PortalPreviewPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 shadow-2xl lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <Badge tone="amber">Preview environment</Badge>
              <h1 className="mt-5 max-w-4xl text-4xl font-bold tracking-tight lg:text-6xl">SynergyInvest governance portal</h1>
              <p className="mt-4 max-w-3xl text-lg text-slate-300">A production-oriented operating console for shareholder governance, investor relations, property oversight, document controls, and audit-ready enterprise workflows.</p>
            </div>
            <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-5 text-sm text-emerald-100">
              <p className="font-semibold">Secure-by-default architecture</p>
              <p className="mt-2 text-emerald-100/80">Next.js App Router, Prisma/PostgreSQL, NextAuth sessions, Zod validation, RBAC, and structured audit logging.</p>
            </div>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {previewMetrics.map((metric) => (
              <div key={metric.label} className="rounded-2xl border border-white/10 bg-white/10 p-5">
                <p className="text-sm text-slate-300">{metric.label}</p>
                <p className="mt-2 text-3xl font-bold">{metric.value}</p>
                <p className="mt-1 text-xs text-slate-400">{metric.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-3xl border border-white/10 bg-white p-6 text-slate-950 shadow-2xl">
            <h2 className="text-xl font-semibold">Core workflow coverage</h2>
            <div className="mt-5 space-y-4">
              {workflows.map((workflow) => (
                <div key={workflow.title} className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <workflow.icon className="mt-1 h-5 w-5 text-gold" />
                  <div>
                    <p className="font-semibold">{workflow.title}</p>
                    <p className="mt-1 text-sm text-slate-600">{workflow.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white p-6 text-slate-950 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-wide text-slate-500">Controlled records</p>
                <h2 className="text-xl font-semibold">Document register preview</h2>
              </div>
              <Badge tone="blue">Audit-ready</Badge>
            </div>
            <DataTable
              rows={previewDocuments}
              empty="No preview documents."
              columns={[
                { header: "Title", cell: (row) => <span className="font-medium text-slate-950">{row.title}</span> },
                { header: "Classification", cell: (row) => <Badge tone={row.classification === "CONFIDENTIAL" ? "amber" : "slate"}>{row.classification}</Badge> },
                { header: "Owner", cell: (row) => row.owner },
                { header: "Status", cell: (row) => row.status },
              ]}
            />
          </section>
        </div>
      </section>
    </main>
  );
}
