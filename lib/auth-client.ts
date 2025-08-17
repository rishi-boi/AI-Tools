import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || undefined,
});

export const { signIn, signUp, useSession, signOut, requestPasswordReset } =
  authClient;
