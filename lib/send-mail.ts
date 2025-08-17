"use server";
import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: process.env.SMTP_SERVER_HOST,
  port: 587,
  secure: true,
  auth: {
    user: process.env.SMTP_SERVER_USERNAME,
    pass: process.env.SMTP_SERVER_PASSWORD,
  },
});

export async function sendMail({
  email,
  sendTo,
  subject,
  text,
  html,
}: {
  email: string;
  sendTo?: string;
  subject: string;
  text: string;
  html?: string;
}) {
  try {
    const isVerified = await transporter.verify();
  } catch (error) {
    console.error(
      "Something Went Wrong",
      process.env.SMTP_SERVER_USERNAME,
      process.env.SMTP_SERVER_PASSWORD,
      error
    );
    return;
  }
  const info = await transporter.sendMail({
    from: email,
    to: sendTo,
    subject: subject,
    text: text,
    html: html ? html : "",
  });
  console.log("Message Sent", info.messageId);
  console.log("Mail sent to", sendTo);
  return info;
}
