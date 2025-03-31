
import * as React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

export const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Email and password are required",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      // This is where you would integrate with an auth service
      console.log("Signing in with:", { email, password, rememberMe });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success",
        description: "Signed in successfully",
      });
    } catch (error) {
      console.error("Error signing in:", error);
      toast({
        title: "Error",
        description: "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    console.log("Signing in with Google");
    toast({
      title: "Google Sign In",
      description: "This feature is not implemented yet",
    });
  };

  return (
    <div className="w-full max-w-[400px] bg-[#242424] rounded-lg p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-5 bg-gradient-to-b from-blue-400 to-purple-600 rounded"></div>
        <h1 className="text-xl font-medium text-white">Sign In</h1>
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
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="rememberMe" 
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              className="data-[state=checked]:bg-[#4318D1] border-gray-600"
            />
            <label 
              htmlFor="rememberMe" 
              className="text-xs text-gray-400 leading-none"
            >
              Remember me
            </label>
          </div>
          <Link to="/forgot-password" className="text-xs text-[#4318D1] hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          disabled={loading || !email || !password}
          className="w-full bg-[#4318D1] hover:bg-[#3614B8] text-white"
        >
          {loading ? "Signing in..." : "Sign In"}
        </Button>
        
        <div className="flex items-center justify-center gap-2 my-4">
          <div className="h-px bg-[#333333] flex-1"></div>
          <span className="text-xs text-gray-400">or</span>
          <div className="h-px bg-[#333333] flex-1"></div>
        </div>
        
        <Button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full bg-[#353535] hover:bg-[#404040] text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48" className="mr-2">
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
          </svg>
          Continue with Google
        </Button>
        
        <div className="text-center text-xs text-gray-400">
          Don't have an account?{" "}
          <Link to="/sign-up" className="text-[#4318D1] hover:underline">
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
