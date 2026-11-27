import { useState } from "react";
import type { FormEvent } from "react";
import { toast } from "sonner";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";
import Field, { inputClass } from "../../components/ui/Field";
import Modal from "../../components/ui/Modal";
import ProfileImageUpload from "../../components/ProfileImageUpload";
import Skeleton from "../../components/ui/Skeleton";
import {
  useGetAppointmentsQuery,
  useGetMeQuery,
  useGetNotificationsQuery,
  useMarkNotificationsReadMutation,
  useUpdateAppointmentMutation,
  useUpdateMeMutation,
} from "../../app/auth/authApi";
import { formatCurrency, formatDate } from "../../utils/assets";
import { saveSession, getToken } from "../../utils/auth";

interface MedicalHistory {
  title: string;
  date: string;
  notes: string;
}

interface User {
  [key: string]: unknown;
  _id?: string;
  fullName?: string;
  email?: string;
  profilePic?: string;
  phone?: string;
  bloodType?: string;
  gender?: string;
  photo?: string;
  medicalHistory?: MedicalHistory[];
}

interface Appointment {
  _id: string;
  doctor?: {
    fullName: string;
  };
  appointmentDate: string;
  timeSlot: string;
  consultationType: string;
  status: string;
  ticketPrice: number | string;
}

// interface Notification {
//   _id: string;
//   title: string;
//   message: string;
//   isRead: boolean;
// }

interface SettingsForm {
  [key: string]: unknown;
  fullName: string;
  phone: string;
  bloodType: string;
  gender: string;
}

// interface AuthResponse {
//   success: boolean;
//   message: string;
//   data: User;
// }

interface SettingsForm {
  fullName: string;
  phone: string;
  bloodType: string;
  gender: string;
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

const PatientDashboard = () => {
  const { data: meData, isLoading: meLoading } = useGetMeQuery();
  const { data: apptData, isLoading: apptLoading } = useGetAppointmentsQuery(
    undefined,
    { pollingInterval: 12000 },
  );
  const { data: noteData } = useGetNotificationsQuery(undefined, {
    pollingInterval: 15000,
  });
  const [updateMe, { isLoading: saving }] = useUpdateMeMutation();
  const [updateAppointment] = useUpdateAppointmentMutation();
  const [markRead] = useMarkNotificationsReadMutation();

  const user = meData?.data as User | undefined;
  const appointments = apptData?.data || [];
  const notifications = noteData?.data || [];
  const [tab, setTab] = useState("upcoming");
  const [reschedule, setReschedule] = useState<Appointment | null>(null);
  const [settings, setSettings] = useState<SettingsForm | null>(null);

  const upcoming = appointments.filter(
    (a) =>
      ["pending", "confirmed"].includes(a.status) &&
      new Date(a.appointmentDate) >= new Date(new Date().toDateString()),
  );
  const previous = appointments.filter((a) => !upcoming.includes(a));

  const openSettings = () => {
    setSettings({
      fullName: user?.fullName || "",
      phone: user?.phone || "",
      bloodType: user?.bloodType || "",
      gender: user?.gender || "other",
    });
  };

  const saveSettings = async (
  e: FormEvent<HTMLFormElement>
): Promise<void> => {
  e.preventDefault();
  if (!settings) return;
  try {
    const result = await updateMe(settings).unwrap();
    saveSession({
      ...result.data,
      token: getToken() ?? undefined,
    });
    toast.success("Profile updated successfully");
    setSettings(null);

  } catch (error: unknown) {
    toast.error(
      getErrorMessage(error, "Update failed")
    );
  }
};

  const cancelAppt = async (id: string) => {
    try {
      await updateAppointment({
        id,
        status: "cancelled",
      }).unwrap();

      toast.success("Appointment cancelled");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Unable to cancel"));
    }
  };

  const submitReschedule = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!reschedule) return;

    try {
      await updateAppointment({
        id: reschedule._id,
        appointmentDate: reschedule.appointmentDate.slice(0, 10),
        timeSlot: reschedule.timeSlot,
      }).unwrap();

      toast.success("Appointment rescheduled");
      setReschedule(null);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Reschedule failed"));
    }
  };

  if (meLoading) return <Skeleton className="h-80" />;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <p className="text-sm text-[#2563EB]">Patient dashboard</p>
        <h1 className="mt-1 text-3xl font-semibold">Hello, {user?.fullName}</h1>
        <p className="mt-2 text-slate-500">
          Upcoming visits, history, and account settings in one place.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-5">
          <p className="text-sm text-slate-500">Upcoming</p>
          <p className="text-2xl font-semibold">{upcoming.length}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-slate-500">Past visits</p>
          <p className="text-2xl font-semibold">{previous.length}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-slate-500">Unread alerts</p>
          <p className="text-2xl font-semibold">
            {notifications.filter((n) => !n.isRead).length}
          </p>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <div className="flex gap-3">
            {["upcoming", "previous", "history", "settings"].map((item) => (
              <button
                key={item}
                onClick={() => setTab(item)}
                className={`rounded-full px-4 py-2 text-sm capitalize ${tab === item ? "bg-[#2563EB] text-white" : "bg-slate-100"}`}
              >
                {item}
              </button>
            ))}
          </div>

          {apptLoading && <Skeleton className="mt-6 h-40" />}

          {tab === "upcoming" && !apptLoading && (
            <div className="mt-6 space-y-3">
              {upcoming.length === 0 && (
                <EmptyState
                  title="No upcoming appointments"
                  description="Find a doctor and book a live slot."
                  actionLabel="Find a doctor"
                  onAction={() => (window.location.href = "/doctors")}
                />
              )}
              {upcoming.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col gap-3 rounded-xl border border-slate-100 p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="font-semibold">{item.doctor?.fullName}</p>
                    <p className="text-sm text-slate-500">
                      {formatDate(item.appointmentDate)} · {item.timeSlot} ·{" "}
                      {item.consultationType}
                    </p>
                    <p className="text-sm text-[#2563EB]">
                      {item.status} · {formatCurrency(item.ticketPrice)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() =>
                        setReschedule({
                          ...item,
                          appointmentDate: item.appointmentDate?.slice(0, 10),
                          timeSlot: item.timeSlot,
                        })
                      }
                    >
                      Reschedule
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => cancelAppt(item._id)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "previous" && (
            <div className="mt-6 space-y-3">
              {previous.length === 0 && (
                <EmptyState
                  title="No previous visits yet"
                  description="Your completed and past appointments will appear here."
                />
              )}
              {previous.map((item) => (
                <div
                  key={item._id}
                  className="rounded-xl border border-slate-100 p-4"
                >
                  <p className="font-semibold">{item.doctor?.fullName}</p>
                  <p className="text-sm text-slate-500">
                    {formatDate(item.appointmentDate)} · {item.status}
                  </p>
                </div>
              ))}
            </div>
          )}

          {tab === "history" && (
            <div className="mt-6 space-y-3">
              {(user?.medicalHistory || []).length === 0 && (
                <EmptyState
                  title="No medical history on file"
                  description="Add notes from your profile settings after visits."
                />
              )}
              {(user?.medicalHistory || []).map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-100 p-4"
                >
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-slate-500">
                    {formatDate(item.date)} · {item.notes}
                  </p>
                </div>
              ))}
            </div>
          )}

          {tab === "settings" && (
            <div className="mt-6">
              <p className="text-slate-600">{user?.email}</p>
              <p className="text-sm text-slate-500">
                {user?.phone || "No phone on file"} ·{" "}
                {user?.bloodType || "Blood type not set"}
              </p>
              <Button className="mt-4" onClick={openSettings}>
                Edit account
              </Button>
            </div>
          )}
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Notifications</h2>
            <button
              className="text-sm text-[#2563EB]"
              onClick={() => markRead()}
            >
              Mark read
            </button>
          </div>
          <div className="mt-4 space-y-3">
            {notifications.length === 0 && (
              <p className="text-sm text-slate-500">No alerts yet.</p>
            )}
            {notifications.slice(0, 8).map((note) => (
              <div
                key={note._id}
                className={`rounded-xl p-3 ${note.isRead ? "bg-slate-50" : "bg-blue-50"}`}
              >
                <p className="text-sm font-medium">{note.title}</p>
                <p className="text-xs text-slate-500">{note.message}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Modal
        open={!!reschedule}
        title="Reschedule appointment"
        onClose={() => setReschedule(null)}
      >
        {reschedule && (
          <form onSubmit={submitReschedule} className="space-y-3">
            <Field label="Date">
              <input
                type="date"
                className={inputClass}
                value={reschedule.appointmentDate}
                onChange={(e) =>
                  setReschedule({
                    ...reschedule,
                    appointmentDate: e.target.value,
                  })
                }
              />
            </Field>
            <Field label="Time (HH:MM)">
              <input
                className={inputClass}
                value={reschedule.timeSlot}
                onChange={(e) =>
                  setReschedule({ ...reschedule, timeSlot: e.target.value })
                }
              />
            </Field>
            <Button type="submit">Save new slot</Button>
          </form>
        )}
      </Modal>

      <Modal
        open={!!settings}
        title="Account settings"
        onClose={() => setSettings(null)}
      >
        {settings && (
          <div className="space-y-5">
            <ProfileImageUpload
              profilePic={user?.profilePic}
              onUploaded={(updated) =>
                saveSession({ ...updated, token: getToken() ?? undefined })
              }
            />
            <form onSubmit={saveSettings} className="space-y-3">
              <Field label="Full name">
                <input
                  className={inputClass}
                  value={settings.fullName}
                  onChange={(e) =>
                    setSettings({ ...settings, fullName: e.target.value })
                  }
                />
              </Field>
              <Field label="Phone">
                <input
                  className={inputClass}
                  value={settings.phone}
                  onChange={(e) =>
                    setSettings({ ...settings, phone: e.target.value })
                  }
                />
              </Field>
              <Field label="Blood type">
                <input
                  className={inputClass}
                  value={settings.bloodType}
                  onChange={(e) =>
                    setSettings({ ...settings, bloodType: e.target.value })
                  }
                />
              </Field>
              <Field label="Gender">
                <select
                  className={inputClass}
                  value={settings.gender}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      gender: e.target.value,
                    })
                  }
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </Field>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save changes"}
              </Button>
            </form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PatientDashboard;
