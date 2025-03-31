
import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export const Navbar = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="flex justify-between items-center h-[75px] bg-[#2A2A2A] px-9 py-0 border-b-[#333] border-b border-solid max-sm:px-4 max-sm:py-0">
      <nav className="flex items-center gap-10">
        <a href="/" className="flex items-center gap-4 text-2xl">
          <span aria-hidden="true">🖌️</span>
          <span className="text-white text-xl font-semibold">DesignPro</span>
        </a>
        <div className="flex gap-8 max-md:hidden">
          <a
            href="#features"
            className="text-[#666] text-base hover:text-white transition-colors"
          >
            Features
          </a>
          <a
            href="#pricing"
            className="text-[#666] text-base hover:text-white transition-colors"
          >
            Pricing
          </a>
          <a
            href="#resources"
            className="text-[#666] text-base hover:text-white transition-colors"
          >
            Resources
          </a>
          <a
            href="#enterprise"
            className="text-[#666] text-base hover:text-white transition-colors"
          >
            Enterprise
          </a>
        </div>
      </nav>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-[#999] text-sm hidden md:inline">
              {user.email}
            </span>
            <Button
              variant="ghost"
              className="text-[#666] text-base hover:text-white transition-colors"
              onClick={signOut}
              disabled={loading}
            >
              Sign out
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="ghost"
              className="text-[#666] text-base hover:text-white transition-colors"
              onClick={() => navigate("/sign-in")}
            >
              Sign in
            </Button>
            <Button
              className="text-white text-base font-medium bg-[#4318D1] px-5 py-2.5 rounded-lg hover:bg-[#3614B8] transition-colors"
              onClick={() => navigate("/sign-up")}
            >
              Get started for free
            </Button>
          </>
        )}
      </div>
    </header>
  );
};
