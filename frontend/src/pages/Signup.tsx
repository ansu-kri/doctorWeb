import { useState, ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Button from "../components/ui/Button";
import Field, { inputClass } from "../components/ui/Field";
import { useSignupMutation } from "../app/auth/authApi";
import { saveSession } from "../utils/auth";

interface SignupForm {
  fullName: string;
  email: string;
  password: string;
  role: string;
  gender: string;
  phone: string;
}

export default function Signup() {
  const [signup, { isLoading }] = useSignupMutation();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [form, setForm] = useState<SignupForm>({
    fullName: "",
    email: "",
    password: "",
    role: "patient",
    gender: "female",
    phone: "",
  });
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    const payload = new FormData();
    Object.entries(form).forEach(([k, v]) => payload.append(k, v));
    if (profilePic) payload.append("profilePic", profilePic);
    try {
      const response = await signup(payload).unwrap();
      saveSession(response);
      toast.success("Account created");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="mx-auto grid min-h-[80vh] max-w-6xl md:grid-cols-2">
      <div className="hidden items-center justify-center bg-[#2563EB] p-10 text-white md:flex">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-blue-100">
            Medicare
          </p>
          <h1 className="mt-3 text-4xl font-semibold">
            Join a clinic built around real appointments.
          </h1>
          <p className="mt-4 text-blue-100">
            Patients book verified specialists. Doctors keep a live schedule.
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center p-6">
        <form className="w-full max-w-md space-y-4" onSubmit={handleSubmit}>
          <h2 className="text-3xl font-semibold">Create an account</h2>
          <Field label="Full name">
            <input
              required
              name="fullName"
              className={inputClass}
              value={form.fullName}
              onChange={handleChange}
            />
          </Field>
          <Field label="Email">
            <input
              required
              type="email"
              name="email"
              className={inputClass}
              value={form.email}
              onChange={handleChange}
            />
          </Field>
          <Field label="Phone">
            <input
              name="phone"
              className={inputClass}
              value={form.phone}
              onChange={handleChange}
            />
          </Field>
          <Field label="Password">
            <div className="relative">
              <input
                required
                type={show ? "text" : "password"}
                name="password"
                className={inputClass}
                value={form.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute right-3 top-3"
                onClick={() => setShow(!show)}
              >
                {show ? (
                  <AiOutlineEyeInvisible size={20} />
                ) : (
                  <AiOutlineEye size={20} />
                )}
              </button>
            </div>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="I am a">
              <select
                name="role"
                className={inputClass}
                value={form.role}
                onChange={handleChange}
              >
                <option value="patient">Patient</option>
                <option value="doctors">Doctor</option>
              </select>
            </Field>
            <Field label="Gender">
              <select
                name="gender"
                className={inputClass}
                value={form.gender}
                onChange={handleChange}
              >
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </Field>
          </div>
          <div className="flex items-center gap-3">
            <img
              src={preview || "https://placehold.co/80x80"}
              alt="Preview"
              className="h-14 w-14 rounded-full object-cover"
            />
            <label className="cursor-pointer rounded-xl bg-slate-100 px-4 py-2 text-sm">
              Upload photo
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const file = e.target.files?.[0] ?? null;
                  setProfilePic(file);
                  if (file) setPreview(URL.createObjectURL(file));
                }}
              />
            </label>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating..." : "Sign up"}
          </Button>
          <p className="text-center text-sm text-slate-500">
            Already registered?{" "}
            <Link to="/login" className="font-semibold text-[#2563EB]">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
