"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="border-zinc-700 text-zinc-300 hover:text-white hover:border-amber-500"
    >
      Sign Out
    </Button>
  );
}
