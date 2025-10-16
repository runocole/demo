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

  // ✅ Login handler (uses your working logic)
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
      console.log("Login response:", data);

      if (!res.ok) {
        alert(data.detail || "Invalid credentials");
        return;
      }

      // ✅ Save tokens & user info
      localStorage.setItem(ACCESS_TOKEN, data.access);
      localStorage.setItem(REFRESH_TOKEN, data.refresh);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("userRole", data.user.role);

      // ✅ Redirect based on role
      setTimeout(() => {
        const role = data.user.role;
        console.log("Detected role:", role);
        if (role === "admin") {
          navigate("/dashboard", { replace: true });
        } else if (role === "staff") {
          navigate("/staff/dashboard", { replace: true });
        } else {
          navigate("/login", { replace: true });
        }
      }, 100);
    } catch (err) {
      console.error("Login error:", err);
      alert("Something went wrong during login.");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Registration handler
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8000/api/auth/register/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: registerUsername,
            email: registerEmail,
            password: registerPassword,
            role: registerRole,
          }),
        }
      );

      const data = await response.json();
      console.log("Register response:", data);

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

  const roleOptions: { value: UserRole; label: string; description: string }[] =
    [
      {
        value: "customer",
        label: "Customer",
        description: "Browse and purchase products",
      },
      {
        value: "staff",
        label: "Staff",
        description: "Manage inventory and orders",
      },
      { value: "admin", label: "Admin", description: "Full system access" },
    ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-sky-100 to-sky-200 p-4">
      <Card className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        {/* Left side image */}
        <div className="lg:w-1/2 relative bg-gradient-to-br from-sky-100 to-sky-200">
          <img
            src={authHero}
            alt="Authentication"
            className="w-full h-64 lg:h-full object-cover mix-blend-multiply opacity-80"
          />
          <div className="absolute inset-0 z-20 flex items-center justify-center p-8">
            <div className="text-center text-white">
              <h1 className="text-4xl lg:text-5xl font-bold mb-4 drop-shadow-lg">
                Welcome Back
              </h1>
              <p className="text-lg lg:text-xl drop-shadow-md mb-6">
                Secure access to your account
              </p>
            </div>
          </div>
        </div>

        {/* Right side form */}
        <div className="lg:w-1/2 p-8 lg:p-12">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="p-3 bg-sky-100 rounded-xl">
              <Package className="h-8 w-8 text-sky-600" />
            </div>
            <h2 className="text-2xl font-bold text-sky-700 tracking-tight">
              OTIC SURVEYS
            </h2>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-100 p-1 rounded-lg">
              <TabsTrigger
                value="login"
                className="text-base font-medium data-[state=active]:bg-white data-[state=active]:text-gray-900 rounded-md transition-all"
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="text-base font-medium data-[state=active]:bg-white data-[state=active]:text-gray-900 rounded-md transition-all"
              >
                Register
              </TabsTrigger>
            </TabsList>

            {/* --- Login Form --- */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2 text-center">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Sign In
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Enter your credentials to access your account
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      placeholder="name@example.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                      disabled={isLoading}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Password</Label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      className="h-11"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 text-base font-semibold bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700"
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
                  <h2 className="text-xl font-semibold text-gray-800">
                    Create Account
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Sign up to get started with GeoTrack
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Username</Label>
                    <Input
                      type="text"
                      placeholder="johndoe"
                      value={registerUsername}
                      onChange={(e) => setRegisterUsername(e.target.value)}
                      required
                      disabled={isLoading}
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      placeholder="name@example.com"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      required
                      disabled={isLoading}
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Password</Label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Select
                      value={registerRole}
                      onValueChange={(v: UserRole) => setRegisterRole(v)}
                      disabled={isLoading}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roleOptions.map((r) => (
                          <SelectItem key={r.value} value={r.value}>
                            <div>
                              <div className="font-medium">{r.label}</div>
                              <div className="text-xs text-gray-500">
                                {r.description}
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 text-base font-semibold bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
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
