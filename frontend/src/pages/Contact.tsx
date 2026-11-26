import { useState, ChangeEvent, FormEvent } from "react";
import { toast } from "sonner";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Field, { inputClass } from "../components/ui/Field";
import { useSendContactMutation } from "../app/auth/authApi";

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface Errors {
  email?: string;
  subject?: string;
  message?: string;
}
const getErrorMessage = (
  error: unknown,
  fallback = "Something went wrong",
): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "object" && error !== null && "data" in error) {
    const data = error.data;
    if (
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof data.message === "string"
    ) {
      return data.message;
    }
  }
  return fallback;
};

const Contact = () => {
  const [form, setForm] = useState<ContactForm>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [sendContact, { isLoading }] = useSendContactMutation();

  const validate = () => {
    const next: Errors = {};
    if (!form.email.includes("@")) next.email = "Enter a valid email";
    if (!form.subject.trim()) next.subject = "Subject is required";
    if (form.message.trim().length < 10)
      next.message = "Please add a bit more detail";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await sendContact(form).unwrap();
      toast.success("Message sent. Our team will reply shortly.");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err: unknown) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-3xl font-semibold">Contact Medicare</h1>
      <p className="mt-2 text-slate-500">
        Clinic support for appointments, records, and specialist questions.
      </p>
      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        <div className="space-y-4">
          {[
            ["Phone", "+91 98765 43210"],
            ["Email", "support@medicare.clinic"],
            ["Location", "Koramangala, Bengaluru"],
            ["Hours", "Monday–Saturday, 8am–8pm"],
          ].map(([label, value]) => (
            <Card key={label} className="p-5">
              <p className="text-sm text-slate-500">{label}</p>
              <p className="font-semibold">{value}</p>
            </Card>
          ))}
        </div>
        <Card className="p-8 lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Name">
              <input
                className={inputClass}
                value={form.name}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setForm({ ...form, name: e.target.value })
                }
              />
            </Field>
            <Field label="Email" error={errors.email}>
              <input
                type="email"
                required
                className={inputClass}
                value={form.email}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setForm({ ...form, email: e.target.value })
                }
              />
            </Field>
            <Field label="Subject" error={errors.subject}>
              <input
                required
                className={inputClass}
                value={form.subject}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setForm({ ...form, subject: e.target.value })
                }
              />
            </Field>
            <Field label="Message" error={errors.message}>
              <textarea
                required
                rows={6}
                className={inputClass}
                value={form.message}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  setForm({ ...form, message: e.target.value })
                }
              />
            </Field>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send message"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Contact;