"use client";
import { sendMail } from "@/lib/send-mail";
import React from "react";

const page = () => {
  const handleMail = async () => {
    sendMail({
      email: process.env.SMTP_SERVER_USERNAME || "",
      sendTo: "rishipardeshi567@gmail.com",
      subject: "Test Email",
      text: "This is a test email to verify SMTP configuration.",
      html: "<p>This is a test email to verify SMTP configuration.</p>",
    });
  };
  return (
    <div>
      <button onClick={() => handleMail()}>send mail</button>
    </div>
  );
};

export default page;
