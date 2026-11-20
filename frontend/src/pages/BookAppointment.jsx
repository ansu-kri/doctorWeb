import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Field, { inputClass } from "../components/ui/Field";
import {
  useCreateAppointmentMutation,
  useGetAlldoctorsQuery,
  useGetAvailabilityQuery,
  useGetDoctorQuery,
} from "../app/auth/authApi";
import { formatCurrency } from "../utils/assets";
import { getStoredUser, getToken } from "../utils/auth";

const todayIso = () => new Date().toISOString().slice(0, 10);

const BookAppointment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = getStoredUser();

  if (!getToken()) {
    navigate("/login");
  }
  const [doctorId, setDoctorId] = useState(id || "");
  const [step, setStep] = useState(id ? 2 : 1);
  const [form, setForm] = useState({
    consultationType: "in-person",
    appointmentDate: todayIso(),
    timeSlot: "",
    patientName: user?.fullName || "",
    phone: user?.phone || "",
    notes: "",
  });

  const { data: doctorsData } = useGetAlldoctorsQuery();
  const { data: doctorData } = useGetDoctorQuery(doctorId, { skip: !doctorId });
  const { data: slotsData, isFetching } = useGetAvailabilityQuery(
    { id: doctorId, date: form.appointmentDate },
    { skip: !doctorId || !form.appointmentDate },
  );
  const [createAppointment, { isLoading }] = useCreateAppointmentMutation();

  const doctor = doctorData?.data;
  const slots = slotsData?.data || [];

  const summary = useMemo(() => doctor, [doctor]);

  const submit = async (e) => {
    e.preventDefault();
    if (!user) return navigate("/login");
    if (!form.timeSlot) return toast.error("Select an available time");
    try {
      const result = await createAppointment({
        doctorId,
        ...form,
      }).unwrap();
      toast.success("Appointment confirmed");
      navigate("/checkout-success", { state: { appointment: result.data } });
    } catch (err) {
      toast.error(err?.data?.message || "Booking failed");
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-semibold">Book an appointment</h1>
      <p className="mt-2 text-slate-500">
        Choose a doctor, consultation type, and a live time slot.
      </p>

      <div className="mt-6 flex gap-2 text-sm">
        {["Doctor", "Schedule", "Patient", "Confirm"].map((label, i) => (
          <span
            key={label}
            className={`rounded-full px-3 py-1 ${step === i + 1 ? "bg-[#2563EB] text-white" : "bg-slate-100 text-slate-500"}`}
          >
            {i + 1}. {label}
          </span>
        ))}
      </div>

      <Card className="mt-6 p-6">
        {step === 1 && (
          <div className="space-y-4">
            <Field label="Select doctor">
              <select
                className={inputClass}
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
              >
                <option value="">Choose</option>
                {(doctorsData?.data || []).map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.fullName} · {d.specialization}
                  </option>
                ))}
              </select>
            </Field>
            <Button disabled={!doctorId} onClick={() => setStep(2)}>
              Continue
            </Button>
          </div>
        )}

        {step === 2 && !doctor && (
          <p className="text-slate-500">Loading doctor details…</p>
        )}
        {step === 2 && doctor && (
          <div className="space-y-4">
            <p className="font-medium">
              {doctor.fullName} · {formatCurrency(doctor.ticketPrice)}
            </p>
            <Field label="Consultation type">
              <select
                className={inputClass}
                value={form.consultationType}
                onChange={(e) =>
                  setForm({ ...form, consultationType: e.target.value })
                }
              >
                <option value="in-person">In-person clinic visit</option>
                <option value="online">Online consultation</option>
              </select>
            </Field>
            <Field label="Date">
              <input
                type="date"
                min={todayIso()}
                className={inputClass}
                value={form.appointmentDate}
                onChange={(e) =>
                  setForm({
                    ...form,
                    appointmentDate: e.target.value,
                    timeSlot: "",
                  })
                }
              />
            </Field>
            <div>
              <p className="mb-2 text-sm font-medium text-slate-600">
                Available times
              </p>
              {isFetching && (
                <p className="text-sm text-slate-400">
                  Checking live availability…
                </p>
              )}
              <div className="flex flex-wrap gap-2">
                {slots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setForm({ ...form, timeSlot: slot })}
                    className={`rounded-xl border px-3 py-2 text-sm ${form.timeSlot === slot ? "border-[#2563EB] bg-blue-50 text-[#2563EB]" : "border-slate-200"}`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
              {!isFetching && slots.length === 0 && (
                <p className="text-sm text-slate-500">
                  No open slots on this date. Try another day.
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button disabled={!form.timeSlot} onClick={() => setStep(3)}>
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setStep(4);
            }}
          >
            <Field label="Patient name">
              <input
                required
                className={inputClass}
                value={form.patientName}
                onChange={(e) =>
                  setForm({ ...form, patientName: e.target.value })
                }
              />
            </Field>
            <Field label="Phone">
              <input
                required
                className={inputClass}
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </Field>
            <Field label="Notes for the clinician">
              <textarea
                className={inputClass}
                rows="3"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </Field>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button type="submit">Review booking</Button>
            </div>
          </form>
        )}

        {step === 4 && summary && (
          <form onSubmit={submit} className="space-y-3">
            <p>
              <strong>Doctor:</strong> {summary.fullName}
            </p>
            <p>
              <strong>Type:</strong> {form.consultationType}
            </p>
            <p>
              <strong>When:</strong> {form.appointmentDate} at {form.timeSlot}
            </p>
            <p>
              <strong>Patient:</strong> {form.patientName} · {form.phone}
            </p>
            <p>
              <strong>Fee:</strong> {formatCurrency(summary.ticketPrice)}
            </p>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={() => setStep(3)}>
                Back
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Confirming..." : "Confirm appointment"}
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
};

export default BookAppointment;
