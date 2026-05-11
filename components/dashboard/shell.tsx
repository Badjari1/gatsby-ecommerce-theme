import Link from "next/link";
import { Building2, FileText, Gauge, HandCoins, Users } from "lucide-react";
import type { Role } from "@prisma/client";

const nav = [
  { href: "/dashboard", label: "Overview", icon: Gauge },
  { href: "/dashboard/shareholders", label: "Shareholders", icon: Users },
  { href: "/dashboard/investors", label: "Investors", icon: HandCoins },
  { href: "/dashboard/properties", label: "Properties", icon: Building2 },
  { href: "/dashboard/documents", label: "Documents", icon: FileText },
];

export function DashboardShell({ children, user }: { children: React.ReactNode; user: { name?: string | null; email?: string | null; roles: Role[] } }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-slate-200 bg-navy-950 p-6 text-white lg:block">
        <div className="text-xl font-bold tracking-tight">SynergyInvest</div>
        <div className="mt-1 text-sm text-slate-300">Governance Portal</div>
        <nav className="mt-10 space-y-2">
          {nav.map((item) => <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-200 hover:bg-white/10 hover:text-white"><item.icon size={18} />{item.label}</Link>)}
        </nav>
      </aside>
      <main className="lg:pl-72">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 px-5 py-4 backdrop-blur lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Secure workspace</p>
              <h1 className="text-lg font-semibold text-slate-950">Governance operations</h1>
            </div>
            <div className="text-right text-sm">
              <div className="font-medium text-slate-900">{user.name}</div>
              <div className="text-slate-500">{user.roles.join(", ")}</div>
            </div>
          </div>
        </header>
        <div className="p-5 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
