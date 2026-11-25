"use client";

import { useActionState } from "react";
import type { ReactNode } from "react";
import { mutate, signIn } from "./actions";

export function AdminForm({
  children,
  login = false,
}: {
  children: ReactNode;
  login?: boolean;
}) {
  const [result, action, pending] = useActionState(login ? signIn : mutate, {
    message: "",
  });
  return (
    <form action={action}>
      <fieldset disabled={pending}>{children}</fieldset>
      {pending && <p role="status">Operazione in corso…</p>}
      {result.message && (
        <p role="status" className="admin-message">
          {result.message}
        </p>
      )}
    </form>
  );
}
