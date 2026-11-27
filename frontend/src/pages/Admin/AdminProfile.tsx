import { useState } from "react";
import type { FormEvent } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Field, { inputClass } from "../../components/ui/Field";
import Modal from "../../components/ui/Modal";
import Skeleton from "../../components/ui/Skeleton";
import {
  useCreateAdminUserMutation,
  useDeleteAdminServiceMutation,
  useDeleteAdminSpecialtyMutation,
  useDeleteAdminUserMutation,
  useGetAdminAppointmentsQuery,
  useGetAdminServicesQuery,
  useGetAdminSpecialtiesQuery,
  useGetAdminStatsQuery,
  useGetAdminUsersQuery,
  useSaveAdminServiceMutation,
  useSaveAdminSpecialtyMutation,
  useUpdateAdminAppointmentMutation,
  useUpdateAdminUserMutation,
  type Appointment,
  type User,
} from "../../app/auth/authApi";
import { formatCurrency, formatDate } from "../../utils/assets";

interface CatalogItem {
  _id?: string;
  name: string;
  description?: string;
  icon?: string;
  kind: "specialty" | "service";
  category?: string;
  isActive?: boolean;
}

interface ConfirmAction {
  label: string;
  run: () => Promise<void>;
}

const emptyCatalog: Omit<CatalogItem, "kind"> = {
  name: "",
  description: "",
  icon: "stethoscope",
  category: "clinic",
  isActive: true,
};

const emptyUser: User = {
  fullName: "",
  email: "",
  password: "",
  role: "doctor",
  gender: "other",
  specialization: "",
  hospital: "",
  location: "",
  ticketPrice: 800,
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (
    typeof error === "object" &&
    error !== null &&
    "data" in error &&
    typeof error.data === "object" &&
    error.data !== null &&
    "message" in error.data &&
    typeof error.data.message === "string"
  ) {
    return error.data.message;
  }
  return fallback;
};

const AdminDashboard = () => {
  const { pathname } = useLocation();
  const section = pathname.split("/")[2] || "dashboard";
  const sectionTitle = section.charAt(0).toUpperCase() + section.slice(1);
  const [userSearch, setUserSearch] = useState("");
  const [userActive, setUserActive] = useState<"true" | "false" | "">("");
  const [userPage, setUserPage] = useState(1);
  const [appointmentSearch, setAppointmentSearch] = useState("");
  const [appointmentStatus, setAppointmentStatus] = useState("");
  const [appointmentPage, setAppointmentPage] = useState(1);
  const [userModal, setUserModal] = useState<User | null>(null);
  const [catalogModal, setCatalogModal] = useState<CatalogItem | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);
  const [appointmentDetails, setAppointmentDetails] = useState<Appointment | null>(null);

  const {
    data: statsData,
    isLoading: statsLoading,
    isError: statsError,
    refetch: refetchStats,
  } = useGetAdminStatsQuery(undefined, {
    pollingInterval: 15000,
    skip: section !== "dashboard",
  });
  const {
    data: usersData,
    isLoading: usersLoading,
    isError: usersError,
    refetch: refetchUsers,
  } = useGetAdminUsersQuery({
    search: userSearch || undefined,
    role: section === "doctors" ? "doctor" : "patient",
    isActive: userActive || undefined,
    page: userPage,
    limit: 20,
  }, { skip: section !== "doctors" && section !== "patients" });
  const {
    data: appointmentsData,
    isLoading: appointmentsLoading,
    isError: appointmentsError,
    refetch: refetchAppointments,
  } = useGetAdminAppointmentsQuery({
    search: appointmentSearch || undefined,
    status: appointmentStatus || undefined,
    page: appointmentPage,
    limit: 20,
  }, { skip: section !== "appointments" });
  const { data: specialtiesData, isLoading: specialtiesLoading } =
    useGetAdminSpecialtiesQuery(undefined, { skip: section !== "specialties" });
  const { data: servicesData, isLoading: servicesLoading } =
    useGetAdminServicesQuery(undefined, { skip: section !== "services" });

  const [createUser, { isLoading: creatingUser }] = useCreateAdminUserMutation();
  const [updateUser, { isLoading: updatingUser }] = useUpdateAdminUserMutation();
  const [deleteUser, { isLoading: deletingUser }] = useDeleteAdminUserMutation();
  const [updateAppointment, { isLoading: updatingAppointment }] = useUpdateAdminAppointmentMutation();
  const [saveSpecialty, { isLoading: savingSpecialty }] = useSaveAdminSpecialtyMutation();
  const [deleteSpecialty, { isLoading: deletingSpecialty }] = useDeleteAdminSpecialtyMutation();
  const [saveService, { isLoading: savingService }] = useSaveAdminServiceMutation();
  const [deleteService, { isLoading: deletingService }] = useDeleteAdminServiceMutation();

  const stats = statsData?.data;
  const users = usersData?.data || [];
  const appointments = appointmentsData?.data || [];
  const userPagination = usersData?.pagination;
  const appointmentPagination = appointmentsData?.pagination;
  const specialties = specialtiesData?.data || [];
  const services = servicesData?.data || [];
  const maxTrend = Math.max(1, ...(stats?.trend || []).map((point) => point.count));

  const saveUser = async (event: FormEvent) => {
    event.preventDefault();
    if (!userModal) return;
    if (!userModal.fullName || !userModal.email) {
      toast.error("Name and email are required");
      return;
    }
    if (!userModal._id && (!userModal.password || String(userModal.password).length < 6)) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    try {
      if (userModal._id) {
        await updateUser({ id: userModal._id, ...userModal }).unwrap();
        toast.success("User updated");
      } else {
        await createUser(userModal).unwrap();
        toast.success("User created");
      }
      setUserModal(null);
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to save user"));
    }
  };

  const toggleUserActive = (user: User) => {
    if (!user._id) return;
    const nextActive = user.isActive === false;
    setConfirmAction({
      label: `${nextActive ? "Activate" : "Deactivate"} ${String(user.fullName || "this user")}?`,
      run: async () => {
        await updateUser({ id: user._id as string, isActive: nextActive }).unwrap();
        toast.success(nextActive ? "User activated" : "User deactivated");
      },
    });
  };

  const confirmDeleteUser = (user: User) => {
    if (!user._id) return;
    setConfirmAction({
      label: `Delete ${String(user.fullName || "this user")} and associated appointments? This cannot be undone.`,
      run: async () => {
        await deleteUser(user._id as string).unwrap();
        toast.success("User deleted");
      },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-[#2563EB]">Administration</p>
        <h1 className="text-3xl font-semibold text-slate-900">{sectionTitle}</h1>
      </div>

      {section === "dashboard" && (
        statsLoading ? (
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((item) => <Skeleton key={item} className="h-32" />)}
          </div>
        ) : statsError ? (
          <Card className="p-6 text-center">
            <p className="text-red-600">Unable to load dashboard statistics.</p>
            <Button className="mt-4" variant="outline" onClick={() => refetchStats()}>Retry</Button>
          </Card>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="p-5"><p className="text-sm text-slate-500">Patients</p><p className="mt-2 text-3xl font-semibold">{stats?.patients ?? 0}</p></Card>
              <Card className="p-5"><p className="text-sm text-slate-500">Doctors</p><p className="mt-2 text-3xl font-semibold">{stats?.doctors ?? 0}</p></Card>
              <Card className="p-5"><p className="text-sm text-slate-500">Appointments</p><p className="mt-2 text-3xl font-semibold">{stats?.appointments ?? 0}</p></Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="p-6">
                <h2 className="font-semibold">Bookings in the last 14 days</h2>
                <div className="mt-6 flex h-40 items-end gap-2">
                  {(stats?.trend || []).map((point) => (
                    <div key={point._id} className="flex-1 text-center">
                      <div className="mx-auto w-full max-w-8 rounded-t bg-[#2563EB]" style={{ height: `${(point.count / maxTrend) * 140}px` }} />
                      <p className="mt-1 truncate text-[10px] text-slate-400">{point._id.slice(5)}</p>
                    </div>
                  ))}
                  {(stats?.trend || []).length === 0 && <p className="m-auto text-sm text-slate-400">No bookings in this period</p>}
                </div>
              </Card>
              <Card className="p-6">
                <h2 className="font-semibold">Appointment status</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {Object.entries(stats?.status || {}).map(([status, count]) => (
                    <div key={status} className="rounded-xl bg-slate-50 p-4">
                      <p className="capitalize text-slate-500">{status}</p>
                      <p className="mt-1 text-2xl font-semibold">{count}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="overflow-hidden">
                <h2 className="border-b p-5 font-semibold">Recent appointments</h2>
                {(stats?.recentAppointments || []).map((item) => (
                  <div key={item._id} className="flex items-center justify-between border-b px-5 py-3 text-sm last:border-0">
                    <div><p className="font-medium">{item.patientName || "Patient"}</p><p className="text-slate-500">{item.doctor?.fullName || "Doctor"}</p></div>
                    <span className="capitalize text-slate-500">{item.status}</span>
                  </div>
                ))}
                {(stats?.recentAppointments || []).length === 0 && <p className="p-5 text-sm text-slate-500">No recent appointments</p>}
              </Card>
              <Card className="overflow-hidden">
                <h2 className="border-b p-5 font-semibold">Recent users</h2>
                {(stats?.recentUsers || []).map((item) => (
                  <div key={item._id} className="flex items-center justify-between border-b px-5 py-3 text-sm last:border-0">
                    <div><p className="font-medium">{item.fullName}</p><p className="text-slate-500">{item.email}</p></div>
                    <span className="capitalize text-slate-500">{item.role}</span>
                  </div>
                ))}
                {(stats?.recentUsers || []).length === 0 && <p className="p-5 text-sm text-slate-500">No recent users</p>}
              </Card>
            </div>
          </>
        )
      )}

      {(section === "doctors" || section === "patients") && (
        <Card className="p-4 sm:p-6">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end">
            <Field label="Search">
              <input className={inputClass} placeholder="Name, email, or specialty" value={userSearch} onChange={(event) => { setUserSearch(event.target.value); setUserPage(1); }} />
            </Field>
            <Field label="Status">
              <select className={inputClass} value={userActive} onChange={(event) => { setUserActive(event.target.value as "true" | "false" | ""); setUserPage(1); }}>
                <option value="">All statuses</option><option value="true">Active</option><option value="false">Inactive</option>
              </select>
            </Field>
            <Button onClick={() => setUserModal({ ...emptyUser, role: section === "doctors" ? "doctor" : "patient" })}>
              Add {section === "doctors" ? "doctor" : "patient"}
            </Button>
          </div>

          {usersLoading ? <Skeleton className="h-64" /> : usersError ? (
            <div className="py-8 text-center"><p className="text-red-600">Unable to load users.</p><Button className="mt-4" variant="outline" onClick={() => refetchUsers()}>Retry</Button></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-slate-50 text-slate-500"><tr><th className="p-3">Name</th><th>Email</th><th>Role</th><th>Specialty/city</th><th>Status</th><th className="text-right">Actions</th></tr></thead>
                <tbody>
                  {users.filter((user) => section === "doctors" ? user.role === "doctor" || user.role === "doctors" : user.role === "patient").map((user) => (
                    <tr key={user._id} className="border-t">
                      <td className="p-3 font-medium">{user.fullName}</td><td>{user.email}</td><td className="capitalize">{user.role}</td>
                      <td>{String(user.specialization || user.location || "—")}</td>
                      <td><span className={`rounded-full px-2 py-1 text-xs ${user.isActive === false ? "bg-red-50 text-red-600" : "bg-green-50 text-green-700"}`}>{user.isActive === false ? "Inactive" : "Active"}</span></td>
                      <td className="p-3 text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setUserModal(user)}>Edit</Button>
                          <Button variant="outline" onClick={() => toggleUserActive(user)}>{user.isActive === false ? "Activate" : "Deactivate"}</Button>
                          <Button variant="danger" disabled={deletingUser} onClick={() => confirmDeleteUser(user)}>Delete</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.filter((user) => section === "doctors" ? user.role === "doctor" || user.role === "doctors" : user.role === "patient").length === 0 && <p className="py-10 text-center text-slate-500">No users found</p>}
            </div>
          )}
          {userPagination && userPagination.pages > 1 && (
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-slate-500">Page {userPagination.page} of {userPagination.pages}</span>
              <div className="flex gap-2">
                <Button variant="outline" disabled={userPage <= 1} onClick={() => setUserPage((page) => Math.max(1, page - 1))}>Previous</Button>
                <Button variant="outline" disabled={userPage >= userPagination.pages} onClick={() => setUserPage((page) => Math.min(userPagination.pages, page + 1))}>Next</Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {section === "appointments" && (
        <Card className="p-4 sm:p-6">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row">
            <Field label="Search">
              <input className={inputClass} placeholder="Patient or doctor" value={appointmentSearch} onChange={(event) => { setAppointmentSearch(event.target.value); setAppointmentPage(1); }} />
            </Field>
            <Field label="Status">
              <select className={inputClass} value={appointmentStatus} onChange={(event) => { setAppointmentStatus(event.target.value); setAppointmentPage(1); }}>
                <option value="">All statuses</option>{["pending", "confirmed", "completed", "cancelled"].map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
            </Field>
          </div>
          {appointmentsLoading ? <Skeleton className="h-64" /> : appointmentsError ? (
            <div className="py-8 text-center"><p className="text-red-600">Unable to load appointments.</p><Button className="mt-4" variant="outline" onClick={() => refetchAppointments()}>Retry</Button></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-slate-50 text-slate-500"><tr><th className="p-3">Patient</th><th>Doctor</th><th>When</th><th>Fee</th><th>Status</th><th></th></tr></thead>
                <tbody>
                  {appointments.map((item) => (
                    <tr key={item._id} className="border-t">
                      <td className="p-3">{item.patientName || "—"}</td><td>{item.doctor?.fullName || "—"}</td><td>{formatDate(item.appointmentDate)} · {item.timeSlot}</td><td>{formatCurrency(item.ticketPrice)}</td>
                      <td><select
                        aria-label="Appointment status"
                        className="rounded-lg border border-slate-200 px-2 py-1"
                        value={item.status}
                        disabled={updatingAppointment}
                        onChange={async (event) => {
                          try {
                            await updateAppointment({ id: item._id, status: event.target.value }).unwrap();
                            toast.success("Appointment status updated");
                          } catch (error) {
                            toast.error(getErrorMessage(error, "Unable to update appointment"));
                          }
                        }}
                      >{["pending", "confirmed", "completed", "cancelled"].map((status) => <option key={status} value={status}>{status}</option>)}</select></td>
                      <td className="p-3"><Button variant="outline" onClick={() => setAppointmentDetails(item)}>View</Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {appointments.length === 0 && <p className="py-10 text-center text-slate-500">No appointments found</p>}
            </div>
          )}
          {appointmentPagination && appointmentPagination.pages > 1 && (
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-slate-500">Page {appointmentPagination.page} of {appointmentPagination.pages}</span>
              <div className="flex gap-2">
                <Button variant="outline" disabled={appointmentPage <= 1} onClick={() => setAppointmentPage((page) => Math.max(1, page - 1))}>Previous</Button>
                <Button variant="outline" disabled={appointmentPage >= appointmentPagination.pages} onClick={() => setAppointmentPage((page) => Math.min(appointmentPagination.pages, page + 1))}>Next</Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {(section === "specialties" || section === "services") && (
        <Card className="p-4 sm:p-6">
          {section === "specialties" ? (
            <>
              <Button className="mb-4" onClick={() => setCatalogModal({ ...emptyCatalog, kind: "specialty", icon: "stethoscope" })}>Add specialty</Button>
              {specialtiesLoading ? <Skeleton className="h-48" /> : specialties.map((item) => (
                <div key={item._id} className="flex flex-col gap-3 border-b py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div><p className="font-medium">{item.name}</p><p className="mt-1 text-sm text-slate-500">{item.description}</p></div>
                  <div className="flex gap-2"><Button variant="outline" onClick={() => setCatalogModal({ ...item, kind: "specialty" })}>Edit</Button><Button variant="danger" disabled={deletingSpecialty} onClick={() => setConfirmAction({ label: `Delete specialty "${item.name}"?`, run: async () => { await deleteSpecialty(item._id).unwrap(); toast.success("Specialty deleted"); } })}>Delete</Button></div>
                </div>
              ))}
              {!specialtiesLoading && specialties.length === 0 && <p className="py-10 text-center text-slate-500">No specialties found</p>}
            </>
          ) : (
            <>
              <Button className="mb-4" onClick={() => setCatalogModal({ ...emptyCatalog, kind: "service", icon: "heart" })}>Add service</Button>
              {servicesLoading ? <Skeleton className="h-48" /> : services.map((item) => (
                <div key={item._id} className="flex flex-col gap-3 border-b py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div><p className="font-medium">{item.name}</p><p className="mt-1 text-sm text-slate-500">{item.description}</p></div>
                  <div className="flex gap-2"><Button variant="outline" onClick={() => setCatalogModal({ ...item, kind: "service" })}>Edit</Button><Button variant="danger" disabled={deletingService} onClick={() => setConfirmAction({ label: `Delete service "${item.name}"?`, run: async () => { await deleteService(item._id).unwrap(); toast.success("Service deleted"); } })}>Delete</Button></div>
                </div>
              ))}
              {!servicesLoading && services.length === 0 && <p className="py-10 text-center text-slate-500">No services found</p>}
            </>
          )}
        </Card>
      )}

      <Modal open={!!userModal} title={userModal?._id ? "Edit user" : "Add user"} onClose={() => setUserModal(null)}>
        {userModal && (
          <form onSubmit={saveUser} className="max-h-[70vh] space-y-3 overflow-y-auto pr-1">
            <Field label="Name"><input required className={inputClass} value={String(userModal.fullName || "")} onChange={(event) => setUserModal({ ...userModal, fullName: event.target.value })} /></Field>
            <Field label="Email"><input required type="email" className={inputClass} value={String(userModal.email || "")} onChange={(event) => setUserModal({ ...userModal, email: event.target.value })} /></Field>
            {!userModal._id && <Field label="Password"><input required type="password" className={inputClass} value={String(userModal.password || "")} onChange={(event) => setUserModal({ ...userModal, password: event.target.value })} /></Field>}
            {userModal._id && <Field label="New password (optional)"><input type="password" className={inputClass} value={String(userModal.password || "")} onChange={(event) => setUserModal({ ...userModal, password: event.target.value })} /></Field>}
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Role"><select className={inputClass} value={String(userModal.role || "patient")} onChange={(event) => setUserModal({ ...userModal, role: event.target.value })}><option value="patient">Patient</option><option value="doctor">Doctor</option><option value="admin">Admin</option></select></Field>
              <Field label="Gender"><select className={inputClass} value={String(userModal.gender || "other")} onChange={(event) => setUserModal({ ...userModal, gender: event.target.value })}><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select></Field>
            </div>
            <Field label="Phone"><input className={inputClass} value={String(userModal.phone || "")} onChange={(event) => setUserModal({ ...userModal, phone: event.target.value })} /></Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Specialization"><input className={inputClass} value={typeof userModal.specialization === "string" ? userModal.specialization : ""} onChange={(event) => setUserModal({ ...userModal, specialization: event.target.value })} /></Field>
              <Field label="Consultation fee"><input type="number" min="0" className={inputClass} value={String(userModal.ticketPrice || "")} onChange={(event) => setUserModal({ ...userModal, ticketPrice: event.target.value })} /></Field>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Hospital"><input className={inputClass} value={String(userModal.hospital || "")} onChange={(event) => setUserModal({ ...userModal, hospital: event.target.value })} /></Field>
              <Field label="Location"><input className={inputClass} value={String(userModal.location || "")} onChange={(event) => setUserModal({ ...userModal, location: event.target.value })} /></Field>
            </div>
            <Field label="Qualifications (comma separated)"><input className={inputClass} value={Array.isArray(userModal.qualifications) ? userModal.qualifications.join(", ") : ""} onChange={(event) => setUserModal({ ...userModal, qualifications: event.target.value.split(",").map((value) => value.trim()).filter(Boolean) })} /></Field>
            <Field label="Experience (comma separated)"><input className={inputClass} value={Array.isArray(userModal.experiences) ? userModal.experiences.join(", ") : ""} onChange={(event) => setUserModal({ ...userModal, experiences: event.target.value.split(",").map((value) => value.trim()).filter(Boolean) })} /></Field>
            <label className="flex items-center gap-2 text-sm text-slate-600"><input type="checkbox" checked={userModal.isAvailable !== false} onChange={(event) => setUserModal({ ...userModal, isAvailable: event.target.checked })} />Accepting appointments</label>
            <Button type="submit" disabled={creatingUser || updatingUser}>{creatingUser || updatingUser ? "Saving..." : "Save"}</Button>
          </form>
        )}
      </Modal>

      <Modal open={!!catalogModal} title={catalogModal?._id ? `Edit ${catalogModal?.kind}` : `Add ${catalogModal?.kind}`} onClose={() => setCatalogModal(null)}>
        {catalogModal && (
          <form onSubmit={async (event) => {
            event.preventDefault();
            if (!catalogModal.name.trim() || !catalogModal.description?.trim()) { toast.error("Name and description are required"); return; }
            try {
              if (catalogModal.kind === "specialty") await saveSpecialty({ id: catalogModal._id, name: catalogModal.name, description: catalogModal.description, icon: catalogModal.icon, isActive: catalogModal.isActive }).unwrap();
              else await saveService({ id: catalogModal._id, name: catalogModal.name, description: catalogModal.description, category: catalogModal.category, icon: catalogModal.icon, isActive: catalogModal.isActive }).unwrap();
              toast.success(catalogModal._id ? "Updated" : "Created");
              setCatalogModal(null);
            } catch (error) {
              toast.error(getErrorMessage(error, "Unable to save item"));
            }
          }} className="space-y-3">
            <Field label="Name"><input required className={inputClass} value={catalogModal.name} onChange={(event) => setCatalogModal({ ...catalogModal, name: event.target.value })} /></Field>
            <Field label="Description"><textarea required rows={4} className={inputClass} value={catalogModal.description || ""} onChange={(event) => setCatalogModal({ ...catalogModal, description: event.target.value })} /></Field>
            {catalogModal.kind === "service" && <Field label="Category"><input className={inputClass} value={catalogModal.category || ""} onChange={(event) => setCatalogModal({ ...catalogModal, category: event.target.value })} /></Field>}
            <label className="flex items-center gap-2 text-sm text-slate-600"><input type="checkbox" checked={catalogModal.isActive !== false} onChange={(event) => setCatalogModal({ ...catalogModal, isActive: event.target.checked })} />Active</label>
            <Button type="submit" disabled={savingSpecialty || savingService}>{savingSpecialty || savingService ? "Saving..." : "Save"}</Button>
          </form>
        )}
      </Modal>

      <Modal open={!!confirmAction} title="Confirm action" onClose={() => setConfirmAction(null)}>
        {confirmAction && <div><p className="text-slate-600">{confirmAction.label}</p><div className="mt-6 flex justify-end gap-2"><Button variant="outline" onClick={() => setConfirmAction(null)}>Cancel</Button><Button variant="danger" onClick={async () => {
          try { await confirmAction.run(); setConfirmAction(null); } catch (error) { toast.error(getErrorMessage(error, "Action failed")); }
        }}>Confirm</Button></div></div>}
      </Modal>

      <Modal open={!!appointmentDetails} title="Appointment details" onClose={() => setAppointmentDetails(null)}>
        {appointmentDetails && <dl className="grid gap-3 text-sm"><div><dt className="text-slate-500">Patient</dt><dd className="font-medium">{appointmentDetails.patientName || "—"}</dd></div><div><dt className="text-slate-500">Doctor</dt><dd className="font-medium">{appointmentDetails.doctor?.fullName || "—"}</dd></div><div><dt className="text-slate-500">Date and time</dt><dd className="font-medium">{formatDate(appointmentDetails.appointmentDate)} · {appointmentDetails.timeSlot}</dd></div><div><dt className="text-slate-500">Status</dt><dd className="font-medium capitalize">{appointmentDetails.status}</dd></div><div><dt className="text-slate-500">Fee</dt><dd className="font-medium">{formatCurrency(appointmentDetails.ticketPrice)}</dd></div></dl>}
      </Modal>
    </div>
  );
};

export default AdminDashboard;
