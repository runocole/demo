import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card } from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import authHero from "@/assets/auth-hero.jpg";
import { useNavigate } from "react-router-dom";
import { Package, ArrowRight } from "lucide-react";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

type UserRole = "customer" | "staff" | "admin";

const Login = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerRole, setRegisterRole] = useState<UserRole>("customer");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.detail || "Invalid credentials");
        return;
      }

      localStorage.setItem(ACCESS_TOKEN, data.access);
      localStorage.setItem(REFRESH_TOKEN, data.refresh);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("userRole", data.user.role);

      setTimeout(() => {
        const role = data.user.role;
        if (role === "admin") navigate("/dashboard", { replace: true });
        else if (role === "staff") navigate("/staff/dashboard", { replace: true });
        else navigate("/login", { replace: true });
      }, 100);
    } catch (err) {
      console.error("Login error:", err);
      alert("Something went wrong during login.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/auth/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: registerUsername,
          email: registerEmail,
          password: registerPassword,
          role: registerRole,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        if (data.username) alert(`Username: ${data.username[0]}`);
        else if (data.email) alert(`Email: ${data.email[0]}`);
        else if (data.password) alert(`Password: ${data.password[0]}`);
        else alert(data.detail || "Registration failed");
        return;
      }

      alert("Registration successful! Please login.");
      setRegisterUsername("");
      setRegisterEmail("");
      setRegisterPassword("");
      setRegisterRole("customer");
    } catch (err) {
      console.error("Registration error:", err);
      alert("Something went wrong during registration.");
    } finally {
      setIsLoading(false);
    }
  };

  const roleOptions: { value: UserRole; label: string; description: string }[] = [
    { value: "customer", label: "Customer", description: "Browse and purchase products" },
    { value: "staff", label: "Staff", description: "Manage inventory and orders" },
    { value: "admin", label: "Admin", description: "Full system access" },
  ];
return (
  <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#061024] via-[#0a1930] to-[#0c2148] overflow-hidden p-4">
    {/* Soft radial glow in the background */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,115,255,0.08)_0%,transparent_70%)]" />

    {/* Main floating card */}
    <Card className="w-full max-w-6xl bg-[#0f1f3d]/95 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.7)] overflow-hidden flex flex-col lg:flex-row border border-[#1b2d55] relative z-10 backdrop-blur-md transform transition-all hover:scale-[1.01] hover:shadow-[0_0_50px_rgba(0,115,255,0.3)]">

      {/* Left side hero */}
        <div className="lg:w-1/2 relative bg-gradient-to-br from-[#13274b] to-[#1b2d55] shadow-inner shadow-[inset_0_0_25px_rgba(0,0,0,0.6)]">
       <img
      src={authHero}
    alt="Authentication"
    className="w-full h-64 lg:h-full object-cover opacity-50 mix-blend-overlay"
  />
  <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6 bg-gradient-to-b from-transparent via-[#0a1836]/40 to-[#0a1836]/80">
    <div className="space-y-3">
      <p className="text-3xl lg:text-4xl font-semibold text-blue-100 animate-fadeInLine1 drop-shadow-[0_0_10px_rgba(0,115,255,0.5)]">
        Manage your tools.
      </p>
      <p className="text-3xl lg:text-4xl font-semibold text-blue-200 animate-fadeInLine2 drop-shadow-[0_0_10px_rgba(0,115,255,0.4)]">
        Track your sales.
      </p>
      <p className="text-3xl lg:text-4xl font-semibold text-blue-300 animate-fadeInLine3 drop-shadow-[0_0_15px_rgba(0,115,255,0.4)]">
        Stay in control.
      </p>
    </div>
  </div>
</div>


      {/* Right side form */}
      <div className="lg:w-1/2 p-8 lg:p-12 text-white relative z-20 shadow-[0_0_30px_rgba(0,115,255,0.15)]">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="p-3 bg-[#18356c] rounded-xl shadow-md">
            <Package className="h-8 w-8 text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-blue-200 tracking-tight">
            OTIC SURVEYS
          </h2>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-[#162c56] p-1 rounded-lg">
            <TabsTrigger
              value="login"
              className="text-base font-medium data-[state=active]:bg-[#1e3a78] data-[state=active]:text-white text-blue-200 rounded-md transition-all"
            >
              Login
            </TabsTrigger>
            <TabsTrigger
              value="register"
              className="text-base font-medium data-[state=active]:bg-[#1e3a78] data-[state=active]:text-white text-blue-200 rounded-md transition-all"
            >
              Register
            </TabsTrigger>
          </TabsList>

            {/* --- Login Form --- */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2 text-center">
                  <h2 className="text-xl font-semibold text-blue-100">Sign In</h2>
                  <p className="text-blue-300 text-sm">
                    Enter your credentials to access your account
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-blue-200">Email</Label>
                    <Input
                      type="email"
                      placeholder="name@example.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                      disabled={isLoading}
                      className="h-11 bg-[#162a52] border border-[#2a4375] text-white placeholder:text-blue-200 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-blue-200">Password</Label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      className="h-11 bg-[#162a52] border border-[#2a4375] text-white placeholder:text-blue-200 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 text-base font-semibold bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 shadow-lg shadow-blue-500/30"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </TabsContent>

            {/* --- Register Form --- */}
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-6">
                <div className="space-y-2 text-center">
                  <h2 className="text-xl font-semibold text-blue-100">
                    Create Account
                  </h2>
                  <p className="text-blue-300 text-sm">
                    Sign up to get started with OTIC Surveys
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-blue-200">Username</Label>
                    <Input
                      type="text"
                      placeholder="johndoe"
                      value={registerUsername}
                      onChange={(e) => setRegisterUsername(e.target.value)}
                      required
                      disabled={isLoading}
                      className="h-11 bg-[#162a52] border border-[#2a4375] text-white placeholder:text-blue-200 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-blue-200">Email</Label>
                    <Input
                      type="email"
                      placeholder="name@example.com"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      required
                      disabled={isLoading}
                      className="h-11 bg-[#162a52] border border-[#2a4375] text-white placeholder:text-blue-200 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-blue-200">Password</Label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      className="h-11 bg-[#162a52] border border-[#2a4375] text-white placeholder:text-blue-200 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-blue-200">Role</Label>
                    <Select
                      value={registerRole}
                      onValueChange={(v: UserRole) => setRegisterRole(v)}
                      disabled={isLoading}
                    >
                      <SelectTrigger className="h-11 bg-[#162a52] border border-[#2a4375] text-white">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roleOptions.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 text-base font-semibold bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 shadow-lg shadow-blue-500/30"
                  disabled={isLoading}
                >
                  {isLoading ? "Registering..." : "Register"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </Card>
    </div>
  );
};

export default Login;