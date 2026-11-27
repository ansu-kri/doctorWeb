import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Field, { inputClass } from "../components/ui/Field";
import { useLoginMutation } from "../app/auth/authApi";
import { saveSession } from "../utils/auth";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (!email || !password) {
    toast.error("Enter email and password");
    return;
  }

  try {
    const response = await login({ email, password }).unwrap();

    saveSession(response);

    toast.success("Welcome back");

    if (response.role === "admin") {
      navigate("/admin");
    } else if (response.role === "doctor" || response.role === "doctors") {
      navigate("/doctor/dashboard");
    } else {
      const state = location.state as { from?: string } | null;
      navigate(state?.from && state.from.startsWith("/book") ? state.from : "/dashboard");
    }
  } catch (err: unknown) {
    const error = err as {
      data?: {
        message?: string;
      };
    };

    toast.error(error.data?.message || "Login failed");
  }
};

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-2xl font-semibold">Welcome back</h1>
        <p className="mt-1 text-sm text-slate-500">
          Sign in to manage appointments and records.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Field label="Email">
            <input
              type="email"
              className={inputClass}
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            />
          </Field>
          <Field label="Password">
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                className={inputClass}
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-slate-500"
                onClick={() => setShow(!show)}
                aria-label="Toggle password"
              >
                {show ? (
                  <AiOutlineEyeInvisible size={20} />
                ) : (
                  <AiOutlineEye size={20} />
                )}
              </button>
            </div>
          </Field>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Login"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-500">
          New to Medicare?{" "}
          <Link to="/signup" className="font-semibold text-[#2563EB]">
            Create an account
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default LoginPage;