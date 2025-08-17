"use client";
import React from "react";
import { signOut, useSession } from "@/lib/auth-client"; // better-auth client hook

const Page = () => {
  const { data: session, error } = useSession();
  return (
    <div>
      <p>
        {session ? `Welcome back, ${session.user.name}!` : "Please sign in."}
      </p>
      <button onClick={() => signOut()}>Signout</button>
    </div>
  );
};

export default Page;
