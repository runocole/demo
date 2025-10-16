import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Package, Mail, Lock, ArrowRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login button clicked");

    try {
      setLoading(true);
      const res = await fetch("http://localhost:8000/api/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("Login response:", data);

      if (!res.ok) {
        alert(data.detail || "Invalid credentials");
        return;
      }

      // ✅ Save tokens & user info
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("userRole", data.user.role);

      // ✅ Wait a tick to ensure localStorage writes finish
      setTimeout(() => {
        const role = data.user.role;
        console.log("Detected role:", role);

        if (role === "admin") {
          console.log("Redirecting → /admin/dashboard");
          navigate("/admin/dashboard", { replace: true });
        } else if (role === "staff") {
          console.log("Redirecting → /dashboard");
          navigate("/dashboard", { replace: true });
        } else {
          console.log("Redirecting → /login (unknown role)");
          navigate("/login", { replace: true });
        }
      }, 100);
    } catch (err) {
      console.error("Login error:", err);
      alert("Something went wrong during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.1),transparent_50%)]" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000" />

      <Card className="w-full max-w-md relative z-10 border-border/50 shadow-2xl backdrop-blur-sm bg-card/95 animate-fade-in">
        <CardHeader className="space-y-6 pb-8">
          <div className="flex items-center justify-center gap-3 animate-scale-in">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Package className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              OTIC SURVEYS
            </h1>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login" className="gap-2">
                Sign In
              </TabsTrigger>
              <TabsTrigger value="signup" className="gap-2">
                Sign Up
              </TabsTrigger>
            </TabsList>

            {/* --- Login Tab --- */}
            <TabsContent value="login" className="space-y-6">
              <div className="space-y-1 text-center mb-6">
                <h2 className="text-2xl font-semibold">Welcome Back</h2>
                <p className="text-sm text-muted-foreground">
                  Sign in to manage your inventory
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-11"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 h-11"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full h-11 gap-2 mt-6" disabled={loading}>
                  {loading ? "Signing in..." : "Sign In"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </form>
            </TabsContent>

            {/* --- Signup Tab (static info) --- */}
            <TabsContent value="signup" className="space-y-6">
              <div className="space-y-1 text-center mb-6">
                <h2 className="text-2xl font-semibold">Create Account</h2>
                <p className="text-sm text-muted-foreground">
                  Contact admin to get your staff account activated.
                </p>
              </div>
              <div className="text-center text-sm text-muted-foreground">
                Need access?{" "}
                <a href="#" className="text-primary hover:underline font-medium">
                  Contact Administrator
                </a>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
