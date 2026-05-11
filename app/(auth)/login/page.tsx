import { SignInForm } from "@/components/forms/sign-in-form";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-navy-950 px-6">
      <section className="w-full max-w-md rounded-3xl bg-white p-8 shadow-soft">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-gold">SynergyInvest Inc.</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950">Sign in</h1>
          <p className="mt-2 text-sm text-slate-600">Use your provisioned governance portal credentials.</p>
        </div>
        <SignInForm />
      </section>
    </main>
  );
}
