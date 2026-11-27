import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { toast } from "sonner";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Field, { inputClass } from "../../components/ui/Field";
import ProfileImageUpload from "../../components/ProfileImageUpload";
import Skeleton from "../../components/ui/Skeleton";
import { useGetMeQuery, useUpdateMeMutation } from "../../app/auth/authApi";
import { getToken, saveSession } from "../../utils/auth";

interface AccountForm {
  fullName: string;
  phone: string;
  gender: string;
  bloodType: string;
}

const getErrorMessage = (error: unknown) => {
  if (
    typeof error === "object" &&
    error !== null &&
    "data" in error &&
    typeof error.data === "object" &&
    error.data !== null &&
    "message" in error.data &&
    typeof error.data.message === "string"
  ) return error.data.message;
  return "Unable to update profile";
};

const AdminAccount = () => {
  const { pathname } = useLocation();
  const isSettings = pathname.endsWith("/settings");
  const { data, isLoading, isError, refetch } = useGetMeQuery();
  const [updateMe, { isLoading: saving }] = useUpdateMeMutation();
  const [form, setForm] = useState<AccountForm>({
    fullName: "",
    phone: "",
    gender: "other",
    bloodType: "",
  });

  useEffect(() => {
    if (!data?.data) return;
    setForm({
      fullName: data.data.fullName || "",
      phone: data.data.phone || "",
      gender: data.data.gender || "other",
      bloodType: data.data.bloodType || "",
    });
  }, [data]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await updateMe(form).unwrap();
      toast.success("Administrator profile updated");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  if (isLoading) return <Skeleton className="h-72" />;
  if (isError || !data?.data) {
    return (
      <Card className="p-6 text-center">
        <p className="text-red-600">Unable to load your administrator profile.</p>
        <Button className="mt-4" variant="outline" onClick={() => refetch()}>Retry</Button>
      </Card>
    );
  }

  const user = data.data;
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-[#2563EB]">Administrator account</p>
        <h1 className="mt-1 text-3xl font-semibold text-slate-900">
          {isSettings ? "Profile settings" : "Admin profile"}
        </h1>
      </div>
      <Card className="max-w-3xl p-5 sm:p-8">
        <ProfileImageUpload
          profilePic={user.profilePic}
          onUploaded={(updated) =>
            saveSession({ ...updated, token: getToken() ?? undefined })
          }
        />
        <div className="my-6 border-t border-slate-100" />
        {isSettings ? (
          <form onSubmit={submit} className="space-y-5">
            <Field label="Full name">
              <input required className={inputClass} value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} />
            </Field>
            <Field label="Email address">
              <input readOnly className={`${inputClass} bg-slate-50 text-slate-500`} value={user.email || ""} />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Phone">
                <input className={inputClass} value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
              </Field>
              <Field label="Gender">
                <select className={inputClass} value={form.gender} onChange={(event) => setForm({ ...form, gender: event.target.value })}>
                  <option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
                </select>
              </Field>
            </div>
            <Field label="Blood type">
              <input className={inputClass} value={form.bloodType} onChange={(event) => setForm({ ...form, bloodType: event.target.value })} />
            </Field>
            <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button>
          </form>
        ) : (
          <div className="space-y-6">
            <div>
              <p className="text-sm text-slate-500">Name</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">{user.fullName}</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div><p className="text-sm text-slate-500">Email</p><p className="mt-1 font-medium">{user.email}</p></div>
              <div><p className="text-sm text-slate-500">Role</p><p className="mt-1 font-medium capitalize">{user.role}</p></div>
              <div><p className="text-sm text-slate-500">Phone</p><p className="mt-1 font-medium">{user.phone || "Not provided"}</p></div>
              <div><p className="text-sm text-slate-500">Account status</p><p className="mt-1 font-medium">{user.isActive === false ? "Inactive" : "Active"}</p></div>
            </div>
            <Link to="/admin/profile/settings"><Button>Edit profile settings</Button></Link>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdminAccount;
