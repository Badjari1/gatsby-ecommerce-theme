import { prisma } from "@/lib/db/prisma";

const cards = [
  { label: "Shareholders", key: "shareholders" },
  { label: "Investors", key: "investors" },
  { label: "Properties", key: "properties" },
  { label: "Documents", key: "documents" },
];

export default async function DashboardPage() {
  const [shareholders, investors, properties, documents, audits] = await prisma.$transaction([
    prisma.shareholder.count(),
    prisma.investor.count(),
    prisma.property.count(),
    prisma.document.count(),
    prisma.auditEvent.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
  ]);
  const values: Record<string, number> = { shareholders, investors, properties, documents };

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-navy-950 p-8 text-white shadow-soft">
        <p className="text-sm uppercase tracking-wide text-gold">Executive command center</p>
        <h2 className="mt-2 text-3xl font-bold">Governance, capital, property, and records oversight</h2>
        <p className="mt-3 max-w-3xl text-slate-300">A secure operating layer for board workflows, investor relations, shareholder records, property operations, and auditable document management.</p>
      </section>
      <section className="grid gap-4 md:grid-cols-4">
        {cards.map((card) => <div key={card.key} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft"><p className="text-sm text-slate-500">{card.label}</p><p className="mt-2 text-3xl font-bold text-slate-950">{values[card.key]}</p></div>)}
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
        <h3 className="text-lg font-semibold">Recent audit events</h3>
        <div className="mt-4 space-y-3">
          {audits.length ? audits.map((event) => <div key={event.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm"><span className="font-medium">{event.action}</span><span className="text-slate-500">{event.createdAt.toISOString()}</span></div>) : <p className="text-sm text-slate-500">No audit events recorded yet.</p>}
        </div>
      </section>
    </div>
  );
}
