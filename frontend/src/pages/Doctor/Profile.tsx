import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { toast } from "sonner";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Field, { inputClass } from "../../components/ui/Field";
import ProfileImageUpload from "../../components/ProfileImageUpload";
import Skeleton from "../../components/ui/Skeleton";
import {
  useGetMeQuery,
  useUpdateDoctorProfileMutation,
  type User,
} from "../../app/auth/authApi";
import { getToken, saveSession } from "../../utils/auth";

interface ProfileForm {
  fullName: string;
  phone: string;
  gender: string;
  bloodType: string;
  specialization: string;
  qualifications: string;
  experiences: string;
  bio: string;
  about: string;
  location: string;
  hospital: string;
  ticketPrice: string;
}

const DoctorProfile = () => {
  const { data, isLoading, isError, refetch } = useGetMeQuery();
  const [updateDoctorProfile] = useUpdateDoctorProfileMutation();
  const [form, setForm] = useState<ProfileForm>({
    fullName: "",
    phone: "",
    gender: "other",
    bloodType: "",
    specialization: "",
    qualifications: "",
    experiences: "",
    bio: "",
    about: "",
    location: "",
    hospital: "",
    ticketPrice: "",
  });

  const user = data?.data as User | undefined;

  useEffect(() => {
    if (!user) return;
    setForm({
      fullName: user.fullName || "",
      phone: user.phone || "",
      gender: user.gender || "other",
      bloodType: user.bloodType || "",
      specialization: user.specialization || "",
      qualifications: Array.isArray(user.qualifications) ? user.qualifications.join(", ") : "",
      experiences: Array.isArray(user.experiences) ? user.experiences.join(", ") : "",
      bio: typeof user.bio === "string" ? user.bio : "",
      about: typeof user.about === "string" ? user.about : "",
      location: typeof user.location === "string" ? user.location : "",
      hospital: typeof user.hospital === "string" ? user.hospital : "",
      ticketPrice: typeof user.ticketPrice === "number" ? String(user.ticketPrice) : "",
    });
  }, [user]);

  const getErrorMessage = (error: unknown) => {
    if (
      typeof error === "object" &&
      error !== null &&
      "data" in error &&
      typeof error.data === "object" &&
      error.data !== null &&
      "message" in error.data &&
      typeof error.data.message === "string"
    )
      return error.data.message;
    return "Unable to update profile";
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("fullName", form.fullName);
    formData.append("phone", form.phone);
    formData.append("gender", form.gender);
    formData.append("bloodType", form.bloodType);
    formData.append("specialization", form.specialization);
    formData.append("qualifications", form.qualifications);
    formData.append("experiences", form.experiences);
    formData.append("bio", form.bio);
    formData.append("about", form.about);
    formData.append("location", form.location);
    formData.append("hospital", form.hospital);
    formData.append("ticketPrice", form.ticketPrice);

    try {
      const result = await updateDoctorProfile(formData).unwrap();
      saveSession({ ...result.data, token: getToken() ?? undefined });
      toast.success("Profile updated successfully");
      refetch();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  if (isLoading) return <Skeleton className="h-72" />;
  if (isError || !user) {
    return (
      <Card className="p-6 text-center">
        <p className="text-red-600">Unable to load your doctor profile.</p>
        <Button className="mt-4" variant="outline" onClick={() => refetch()}>
          Retry
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-[#2563EB]">Doctor Profile</p>
        <h1 className="mt-1 text-3xl font-semibold text-slate-900">Profile</h1>
        <p className="mt-2 text-slate-500">
          Manage your professional information and availability.
        </p>
      </div>

      <Card className="max-w-3xl p-5 sm:p-8">
        <ProfileImageUpload
          profilePic={user.profilePic}
          onUploaded={(updated) =>
            saveSession({ ...updated, token: getToken() ?? undefined })
          }
        />
        <div className="my-6 border-t border-slate-100" />
        <form onSubmit={submit} className="space-y-5">
          <Field label="Full name">
            <input
              required
              className={inputClass}
              value={form.fullName}
              onChange={(event) => setForm({ ...form, fullName: event.target.value })}
            />
          </Field>
          <Field label="Email address">
            <input
              readOnly
              className={`${inputClass} bg-slate-50 text-slate-500`}
              value={user.email || ""}
            />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Phone">
              <input
                className={inputClass}
                value={form.phone}
                onChange={(event) => setForm({ ...form, phone: event.target.value })}
              />
            </Field>
            <Field label="Gender">
              <select
                className={inputClass}
                value={form.gender}
                onChange={(event) => setForm({ ...form, gender: event.target.value })}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </Field>
          </div>
          <Field label="Blood type">
            <input
              className={inputClass}
              value={form.bloodType}
              onChange={(event) => setForm({ ...form, bloodType: event.target.value })}
            />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Specialization">
              <input
                className={inputClass}
                value={form.specialization}
                onChange={(event) => setForm({ ...form, specialization: event.target.value })}
              />
            </Field>
            <Field label="Consultation fee">
              <input
                type="number"
                min="0"
                className={inputClass}
                value={form.ticketPrice}
                onChange={(event) => setForm({ ...form, ticketPrice: event.target.value })}
              />
            </Field>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Hospital / Clinic">
              <input
                className={inputClass}
                value={form.hospital}
                onChange={(event) => setForm({ ...form, hospital: event.target.value })}
              />
            </Field>
            <Field label="Location">
              <input
                className={inputClass}
                value={form.location}
                onChange={(event) => setForm({ ...form, location: event.target.value })}
              />
            </Field>
          </div>
          <Field label="Qualifications (comma separated)">
            <input
              className={inputClass}
              value={form.qualifications}
              onChange={(event) => setForm({ ...form, qualifications: event.target.value })}
            />
          </Field>
          <Field label="Experience (comma separated)">
            <input
              className={inputClass}
              value={form.experiences}
              onChange={(event) => setForm({ ...form, experiences: event.target.value })}
            />
          </Field>
          <Field label="Biography">
            <textarea
              className={inputClass}
              rows={4}
              value={form.bio}
              onChange={(event) => setForm({ ...form, bio: event.target.value })}
            />
          </Field>
          <Field label="About / Consultation information">
            <textarea
              className={inputClass}
              rows={4}
              value={form.about}
              onChange={(event) => setForm({ ...form, about: event.target.value })}
            />
          </Field>
          <div className="pt-4">
            <p className="text-xs text-slate-500 mb-2">
              Role, account status, and verification status cannot be changed from here.
            </p>
            <Button type="submit">
              Save changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default DoctorProfile;