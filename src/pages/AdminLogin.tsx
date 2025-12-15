import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card } from "../components/ui/card";
import { Eye, EyeOff, Mail, Lock, Loader2, AlertCircle, ArrowRight } from "lucide-react";
import adminHero from "../assets/about-hero.jpg";
import logo from "../assets/otic-logo.png";
import { useToast } from "../hooks/use-toast";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth(); // your firebase auth hook
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // call your useAuth login (assumed to throw on error)
      await login(email, password);

      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });

      // navigate to admin panel
      navigate("/admin", { replace: true });
    } catch (err: unknown) {
      // unify firebase error handling but keep graceful fallback
      const firebaseError = err as { code?: string; message?: string };

      // handle several common firebase auth codes
      if (firebaseError?.code === "auth/wrong-password" || firebaseError?.code === "auth/invalid-credential") {
        setError("Invalid email or password");
      } else if (firebaseError?.code === "auth/user-not-found") {
        setError("No account found with that email");
      } else if (firebaseError?.code === "auth/too-many-requests") {
        setError("Too many attempts. Please try again later.");
      } else if (firebaseError?.code === "auth/invalid-email") {
        setError("Invalid email address");
      } else {
        setError(firebaseError?.message || "An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword((s) => !s);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#061024] via-[#0a1930] to-[#0c2148] overflow-hidden p-4">
      {/* subtle radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,115,255,0.06)_0%,transparent_65%)]" />

      <Card className="w-full max-w-6xl bg-[#0f1f3d]/95 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.7)] overflow-hidden flex flex-col lg:flex-row border border-[#1b2d55] relative z-10 backdrop-blur-md transform transition-all hover:scale-[1.01] hover:shadow-[0_0_50px_rgba(0,115,255,0.3)]">
        {/* Left hero */}
        <div className="lg:w-1/2 relative bg-gradient-to-br from-[#13274b] to-[#1b2d55] shadow-inner">
          <img
            src={adminHero}
            alt="Admin hero"
            className="w-full h-64 lg:h-full object-cover opacity-50 mix-blend-overlay"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6 bg-gradient-to-b from-transparent via-[#0a1836]/40 to-[#0a1836]/80">
            <div className="space-y-3">
              <p className="text-3xl lg:text-4xl font-semibold text-blue-100 drop-shadow-[0_0_10px_rgba(0,115,255,0.5)]">
                Secure. Powerful.
              </p>
              <p className="text-3xl lg:text-4xl font-semibold text-blue-200 drop-shadow-[0_0_10px_rgba(0,115,255,0.4)]">
                Admin Access.
              </p>
              <p className="text-3xl lg:text-4xl font-semibold text-blue-300 drop-shadow-[0_0_15px_rgba(0,115,255,0.4)]">
                Manage Everything.
              </p>
            </div>
          </div>
        </div>

        {/* Right form */}
        <div className="lg:w-1/2 p-8 lg:p-12 text-white relative z-20 shadow-[0_0_30px_rgba(0,115,255,0.15)]">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="p-3 bg-[#18356c] rounded-xl shadow-md">
              <img src={logo} alt="OTIC Logo" className="h-8 w-8 object-contain" />
            </div>
            <h2 className="text-2xl font-bold text-blue-200 tracking-tight">OTIC ADMIN</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-semibold text-blue-100">Admin Login</h2>
              <p className="text-blue-300 text-sm">Enter credentials to access the admin panel</p>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-red-600/10 p-3 text-sm text-red-200 border border-red-600/20">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-blue-200">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-200/70" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 bg-[#162a52] border border-[#2a4375] text-white placeholder:text-blue-200 pl-10 focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-blue-200">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-200/70" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 bg-[#162a52] border border-[#2a4375] text-white placeholder:text-blue-200 pl-10 pr-10 focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    disabled={isLoading}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300 hover:text-blue-100 transition-colors disabled:opacity-50"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 text-base font-semibold bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 shadow-lg shadow-blue-500/30 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default AdminLogin;