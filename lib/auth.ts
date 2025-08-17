import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js"; // handles cookie setting
import { prismaAdapter } from "better-auth/adapters/prisma";
import { sendMail } from "./send-mail";
import prisma from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
    sendOnSignup: true,
    requireEmailVerification: true, // ✅ enforces verification
    sendVerificationEmail: async ({ user, url }) => {
      await sendMail({
        email: process.env.SMTP_SERVER_USERNAME || "",
        sendTo: user.email,
        subject: "Verify your email",
        text: `Click this link to verify your email: ${url}`,
        html: `<a href="${url}">Verify Email</a>`,
      });
    },
    sendResetPassword: async ({ user, url, token }, request) => {
      await sendMail({
        email: process.env.SMTP_SERVER_USERNAME || "",
        sendTo: user.email,
        subject: "Reset your password",
        text: `Click this link to reset your password: ${url}`,
        html: `<a href="${url}">Reset Password</a>`,
      });
    },
    onPasswordReset: async ({ user }, request) => {
      // your logic here
      console.log(`Password for user ${user.email} has been reset.`);
    },
  },
  plugins: [nextCookies()], // ensures cookies are handled in Next.js
});
