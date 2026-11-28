import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";
import Field, { inputClass } from "../../components/ui/Field";
import Skeleton from "../../components/ui/Skeleton";
import {
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiUser,
  FiX,
} from "react-icons/fi";
import {
  useGetDoctorStatsQuery,
  useGetDoctorAppointmentsQuery,
  type Appointment,
  type DoctorStats,
} from "../../app/auth/authApi";
import { formatDate } from "../../utils/assets";

const statusColors: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-100",
  confirmed: "bg-blue-50 text-blue-700 border-blue-100",
  completed: "bg-green-50 text-green-700 border-green-100",
  cancelled: "bg-red-50 text-red-700 border-red-100",
};

const DoctorDashboard = () => {
  const { date } = useParams<{ date?: string }>();
  const [statusFilter, setStatusFilter] = useState<string>("");

  const {
    data: statsData,
    isLoading: statsLoading,
    isError: statsError,
    refetch: refetchStats,
  } = useGetDoctorStatsQuery(undefined, {
    pollingInterval: 30000,
  });

  const {
    data: apptData,
    isLoading: apptLoading,
    isError: apptError,
    refetch: refetchAppointments,
  } = useGetDoctorAppointmentsQuery(
    {
      date: date || undefined,
      status: statusFilter || undefined,
    },
    { pollingInterval: 30000 }
  );

  const stats: DoctorStats | undefined = statsData?.data;
  const appointments: Appointment[] = apptData?.data || [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todays = appointments.filter(
    (a) => new Date(a.appointmentDate).toDateString() === today.toDateString()
  );
  const upcoming = appointments.filter(
    (a) =>
      ["pending", "confirmed"].includes(a.status) &&
      new Date(a.appointmentDate) > today
  );

  if (statsLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    );
  }

  if (statsError || apptError) {
    return (
      <Card className="p-6 text-center">
        <p className="text-red-600">
          Unable to load dashboard data. Please try again.
        </p>
        <Button
          className="mt-4"
          variant="outline"
          onClick={() => {
            refetchStats();
            refetchAppointments();
          }}
        >
          Retry
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-[#2563EB]">Doctor Dashboard</p>
        <h1 className="mt-1 text-3xl font-semibold text-slate-900">
          Welcome back
        </h1>
        <p className="mt-2 text-slate-500">
          Manage your appointments, patients, and availability.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Patients</p>
              <p className="text-2xl font-semibold">{stats?.totalPatients ?? 0}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
              <FiUser size={24} />
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Today's Appointments</p>
              <p className="text-2xl font-semibold">{stats?.todaysAppointments ?? 0}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
              <FiCalendar size={24} />
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Upcoming</p>
              <p className="text-2xl font-semibold">{stats?.upcomingAppointments ?? 0}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
              <FiClock size={24} />
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Pending Requests</p>
              <p className="text-2xl font-semibold">{stats?.pendingRequests ?? 0}</p>
            </div>
            <div className="p-3 rounded-lg bg-amber-50 text-amber-600">
              <FiClock size={24} />
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Completed</p>
              <p className="text-2xl font-semibold">{stats?.completedAppointments ?? 0}</p>
            </div>
            <div className="p-3 rounded-lg bg-green-50 text-green-600">
              <FiCheckCircle size={24} />
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Cancelled</p>
              <p className="text-2xl font-semibold">{stats?.cancelledAppointments ?? 0}</p>
            </div>
            <div className="p-3 rounded-lg bg-red-50 text-red-600">
              <FiX size={24} />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 p-4 sm:p-6">
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[#2563EB]">Today's Appointments</p>
              <p className="text-sm text-slate-500">
                {formatDate(new Date().toISOString())}
              </p>
            </div>
            <div className="flex gap-2">
              <Field label="Filter by status">
                <select
                  className={inputClass}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All statuses</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </Field>
            </div>
          </div>

          {apptLoading && <Skeleton className="h-64" />}

          {todays.length === 0 && !apptLoading && (
            <EmptyState
              title="No appointments today"
              description="You have no appointments scheduled for today."
              actionLabel="Manage Availability"
              onAction={() => {
                window.location.href = "/doctor/availability";
              }}
            />
          )}

          {todays.map((item) => (
            <div
              key={item._id}
              className="flex flex-col gap-3 rounded-xl border border-slate-100 p-4 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="font-semibold">{item.user?.fullName || item.patientName || "Patient"}</p>
                <p className="text-sm text-slate-500">
                  {formatDate(item.appointmentDate)} · {item.timeSlot} ·{" "}
                  {item.consultationType}
                </p>
                <p className="text-sm text-slate-500">
                  {item.phone || item.user?.phone || "No phone on file"}
                </p>
              </div>
              <div className="flex gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium border ${statusColors[item.status] || "bg-slate-50 text-slate-500 border-slate-100"}`}
                >
                  {item.status}
                </span>
                {item.status === "pending" && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      window.location.href = `/doctor/appointments`;
                    }}
                  >
                    View details
                  </Button>
                )}
              </div>
            </div>
          ))}
        </Card>

        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Upcoming Appointments</h2>
            <Link
              to="/doctor/appointments"
              className="text-sm text-[#2563EB] hover:underline"
            >
              View all
            </Link>
          </div>

          {upcoming.length === 0 && (
            <EmptyState
              title="No upcoming appointments"
              description="Your upcoming appointments will appear here."
            />
          )}

          {upcoming.slice(0, 5).map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between rounded-xl border border-slate-100 p-3 mb-2"
            >
              <div className="min-w-0">
                <p className="font-medium truncate">
                  {item.user?.fullName || item.patientName || "Patient"}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {formatDate(item.appointmentDate)} · {item.timeSlot}
                </p>
              </div>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium border ${statusColors[item.status] || "bg-slate-50 text-slate-500 border-slate-100"}`}
              >
                {item.status}
              </span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};

export default DoctorDashboard;