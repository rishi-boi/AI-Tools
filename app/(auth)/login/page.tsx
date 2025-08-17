import UserForm from "@/components/UserForm";
import React from "react";

const page = () => {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <div className="space-y-4 border p-8 rounded-md min-w-[400px]">
        <h1 className="text-3xl font-bold">Login</h1>
        <UserForm type="login" />
      </div>
    </div>
  );
};

export default page;
