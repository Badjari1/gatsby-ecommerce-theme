"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export function SignInForm() {
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="space-y-4"
      onSubmit={async (event) => {
        event.preventDefault();
        setError(null);
        const form = new FormData(event.currentTarget);
        const result = await signIn("credentials", {
          email: form.get("email"),
          password: form.get("password"),
          redirect: true,
          callbackUrl: "/dashboard",
        });
        if (result?.error) setError("Invalid credentials or inactive account.");
      }}
    >
      <label className="block text-sm font-medium text-slate-700">Email<input name="email" type="email" autoComplete="email" required className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" /></label>
      <label className="block text-sm font-medium text-slate-700">Password<input name="password" type="password" autoComplete="current-password" required minLength={12} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" /></label>
      {error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
      <button className="w-full rounded-xl bg-navy-950 px-4 py-2.5 font-semibold text-white hover:bg-navy-900">Continue</button>
    </form>
  );
}
