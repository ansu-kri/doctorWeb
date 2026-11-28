import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";
import Field, { inputClass } from "../../components/ui/Field";
import Modal from "../../components/ui/Modal";
import Skeleton from "../../components/ui/Skeleton";
import {
  useGetDoctorAppointmentsQuery,
  useUpdateAppointmentMutation,
  type Appointment,
} from "../../app/auth/authApi";
import { formatDate } from "../../utils/assets";

const statusColors: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-100",
  confirmed: "bg-blue-50 text-blue-700 border-blue-100",
  completed: "bg-green-50 text-green-700 border-green-100",
  cancelled: "bg-red-50 text-red-700 border-red-100",
};

const DoctorAppointments = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [page, setPage] = useState(1);
  const [actionAppt, setActionAppt] = useState<Appointment | null>(null);
  const [actionType, setActionType] = useState<"accept" | "reject" | "complete" | "cancel" | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const {
    data: apptData,
    isLoading: apptLoading,
    isError: apptError,
    refetch: refetchAppointments,
  } = useGetDoctorAppointmentsQuery(
    {
      search: search || undefined,
      status: statusFilter || undefined,
      date: dateFilter || undefined,
      page,
      limit: 20,
    },
    { pollingInterval: 30000 }
  );

  const [updateAppointment] = useUpdateAppointmentMutation();

  const appointments: Appointment[] = apptData?.data || [];
  const pagination = apptData?.pagination;

  const handleStatusChange = async (appt: Appointment, newStatus: string, reason?: string) => {
    try {
      await updateAppointment({
        id: appt._id!,
        status: newStatus,
        ...(reason && { rejectionReason: reason }),
      }).unwrap();
      toast.success(`Appointment ${newStatus}`);
      setActionAppt(null);
      setActionType(null);
      setRejectionReason("");
      refetchAppointments();
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err.data?.message || "Unable to update appointment");
    }
  };

  if (apptLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-48" />
        ))}
      </div>
    );
  }

  if (apptError) {
    return (
      <Card className="p-6 text-center">
        <p className="text-red-600">Unable to load appointments.</p>
        <Button className="mt-4" variant="outline" onClick={() => refetchAppointments()}>
          Retry
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-[#2563EB]">My Appointments</p>
        <h1 className="mt-1 text-3xl font-semibold text-slate-900">Appointments</h1>
        <p className="mt-2 text-slate-500">
          View and manage appointments assigned to you.
        </p>
      </div>

      <Card className="p-4 sm:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <Field label="Search by patient name">
            <input
              className={inputClass}
              placeholder="Search patients..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </Field>
          <Field label="Status">
            <select
              className={inputClass}
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </Field>
          <Field label="Date">
            <input
              type="date"
              className={inputClass}
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                setPage(1);
              }}
            />
          </Field>
          <Button onClick={() => navigate("/doctor/dashboard")}>
            Back to Dashboard
          </Button>
        </div>

        {appointments.length === 0 && (
          <EmptyState
            title="No appointments found"
            description="No appointments match your current filters."
          />
        )}

        {appointments.map((item) => (
          <div
            key={item._id}
            className="flex flex-col gap-3 rounded-xl border border-slate-100 p-4 md:flex-row md:items-center md:justify-between"
          >
            <div className="min-w-0">
              <p className="font-semibold">{item.user?.fullName || item.patientName || "Patient"}</p>
              <p className="text-sm text-slate-500">
                {formatDate(item.appointmentDate)} · {item.timeSlot} ·{" "}
                {item.consultationType}
              </p>
              <p className="text-sm text-slate-500">
                {item.phone || item.user?.phone || "No phone on file"}
              </p>
              {item.notes && (
                <p className="text-sm text-slate-400 mt-1">{item.notes}</p>
              )}
            </div>
            <div className="flex gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium border ${statusColors[item.status] || "bg-slate-50 text-slate-500 border-slate-100"}`}
              >
                {item.status}
              </span>
              {item.status === "pending" && (
                <>
                  <Button
                    onClick={() => {
                      setActionAppt(item);
                      setActionType("accept");
                    }}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setActionAppt(item);
                      setActionType("reject");
                    }}
                  >
                    Reject
                  </Button>
                </>
              )}
              {item.status === "confirmed" && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setActionAppt(item);
                    setActionType("complete");
                  }}
                >
                  Mark Complete
                </Button>
              )}
              {item.status === "confirmed" && (
                <Button
                  variant="danger"
                  onClick={() => {
                    setActionAppt(item);
                    setActionType("cancel");
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
        ))}

        {pagination && pagination.pages > 1 && (
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-slate-500">
              Page {pagination.page} of {pagination.pages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                disabled={page >= pagination.pages}
                onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      <Modal
        open={!!actionAppt && !!actionType}
        title={
          actionType === "accept"
            ? "Accept Appointment"
            : actionType === "reject"
            ? "Reject Appointment"
            : actionType === "complete"
            ? "Mark as Completed"
            : "Cancel Appointment"
        }
        onClose={() => {
          setActionAppt(null);
          setActionType(null);
          setRejectionReason("");
        }}
      >
        {actionAppt && actionType && (
          <div className="space-y-3">
            <p className="text-sm text-slate-600">
              <strong>Patient:</strong>{" "}
              {actionAppt.user?.fullName || actionAppt.patientName || "Patient"}
            </p>
            <p className="text-sm text-slate-600">
              <strong>Date:</strong>{" "}
              {formatDate(actionAppt.appointmentDate)} at {actionAppt.timeSlot}
            </p>
            {actionType === "reject" && (
              <div>
                <Field label="Rejection reason (optional)">
                  <textarea
                    className={inputClass}
                    rows={3}
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Explain why this appointment is being rejected..."
                  />
                </Field>
              </div>
            )}
            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setActionAppt(null);
                  setActionType(null);
                  setRejectionReason("");
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (actionType === "accept") {
                    handleStatusChange(actionAppt, "confirmed");
                  } else if (actionType === "reject") {
                    handleStatusChange(actionAppt, "cancelled", rejectionReason);
                  } else if (actionType === "complete") {
                    handleStatusChange(actionAppt, "completed");
                  } else if (actionType === "cancel") {
                    handleStatusChange(actionAppt, "cancelled");
                  }
                }}
              >
                {actionType === "accept" ? "Accept" : actionType === "reject" ? "Reject" : actionType === "complete" ? "Mark Complete" : "Cancel"}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DoctorAppointments;