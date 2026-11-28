import { useState } from "react";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";
import Field, { inputClass } from "../../components/ui/Field";
import Skeleton from "../../components/ui/Skeleton";
import {
  useGetDoctorPatientsQuery,
  type DoctorPatient,
} from "../../app/auth/authApi";
import { formatDate } from "../../utils/assets";

const DoctorPatients = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const {
    data: patientsData,
    isLoading: patientsLoading,
    isError: patientsError,
    refetch: refetchPatients,
  } = useGetDoctorPatientsQuery(
    {
      search: search || undefined,
      page,
      limit: 20,
    },
    { pollingInterval: 30000 }
  );

  const patients: DoctorPatient[] = patientsData?.data || [];
  const pagination = patientsData?.pagination;

  if (patientsLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-48" />
        ))}
      </div>
    );
  }

  if (patientsError) {
    return (
      <Card className="p-6 text-center">
        <p className="text-red-600">Unable to load patients.</p>
        <Button className="mt-4" variant="outline" onClick={() => refetchPatients()}>
          Retry
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-[#2563EB]">Patient Management</p>
        <h1 className="mt-1 text-3xl font-semibold text-slate-900">Patients</h1>
        <p className="mt-2 text-slate-500">
          View patients associated with your appointments.
        </p>
      </div>

      <Card className="p-4 sm:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <Field label="Search by name or email">
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
        </div>

        {patients.length === 0 && (
          <EmptyState
            title="No patients found"
            description="No patients match your current search."
          />
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="p-3">Patient</th>
                <th className="p-3">Email</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Total Appointments</th>
                <th className="p-3">Last Visit</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient._id} className="border-t">
                  <td className="p-3 font-medium">{patient.fullName}</td>
                  <td className="p-3">{patient.email}</td>
                  <td className="p-3">{patient.phone || "Not provided"}</td>
                  <td className="p-3">{patient.totalAppointments}</td>
                  <td className="p-3">{formatDate(patient.lastAppointment)}</td>
                  <td className="p-3 text-right">
                    <Button variant="outline">
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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
    </div>
  );
};

export default DoctorPatients;