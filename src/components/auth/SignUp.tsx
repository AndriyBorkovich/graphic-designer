
import * as React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const { signUp, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword) {
      toast({
        title: "Error",
        description: "All fields are required",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (!termsAccepted) {
      toast({
        title: "Error",
        description: "You must accept the terms and policy",
        variant: "destructive",
      });
      return;
    }

    await signUp(email, password);
  };

  return (
    <div className="w-full max-w-[400px] bg-[#242424] rounded-lg p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-5 bg-gradient-to-b from-blue-400 to-purple-600 rounded"></div>
        <h1 className="text-xl font-medium text-white">Create account</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm text-gray-400">
            Email
          </label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#353535] border-none text-white placeholder-gray-500"
              placeholder="name@example.com"
              required
              disabled={loading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm text-gray-400">
            Password
          </label>
          <div className="relative">
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#353535] border-none text-white placeholder-gray-500"
              required
              disabled={loading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="block text-sm text-gray-400">
            Confirm password
          </label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-[#353535] border-none text-white placeholder-gray-500"
              required
              disabled={loading}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox 
            id="termsAccepted" 
            checked={termsAccepted}
            onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
            className="data-[state=checked]:bg-[#4318D1] border-gray-600"
            disabled={loading}
          />
          <label 
            htmlFor="termsAccepted" 
            className="text-xs text-gray-400 leading-none"
          >
            I agree to the{" "}
            <Link to="/terms" className="text-[#4318D1] hover:underline">
              Terms of Service
            </Link>
            {" "}and{" "}
            <Link to="/privacy" className="text-[#4318D1] hover:underline">
              Privacy Policy
            </Link>
          </label>
        </div>

        <Button
          type="submit"
          disabled={loading || !email || !password || !confirmPassword}
          className="w-full bg-[#4318D1] hover:bg-[#3614B8] text-white"
        >
          {loading ? "Creating..." : "Create account"}
        </Button>
        
        <div className="text-center text-xs text-gray-400">
          Already have an account?{" "}
          <Link to="/sign-in" className="text-[#4318D1] hover:underline">
            Sign in
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
