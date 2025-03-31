
import * as React from "react";
import { SignIn } from "@/components/auth/SignIn";

const SignInPage = () => {
  return (
    <div className="min-h-screen bg-[#1A1A1A] flex flex-col items-center justify-center p-4">
      <SignIn />
    </div>
  );
};

export default SignInPage;
