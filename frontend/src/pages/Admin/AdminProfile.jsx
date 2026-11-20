import { useState } from "react";
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
} from "../../app/auth/authApi";
import { formatCurrency, formatDate } from "../../utils/assets";

const emptyUser = {
  fullName: "",
  email: "",
  password: "",
  role: "doctors",
  specialization: "",
  hospital: "",
  location: "",
  ticketPrice: 800,
};
const emptyCatalog = { name: "", description: "", icon: "stethoscope" };

const AdminDashboard = () => {
  const [tab, setTab] = useState("overview");
  const [userSearch, setUserSearch] = useState("");
  const [apptSearch, setApptSearch] = useState("");
  const [userModal, setUserModal] = useState(null);
  const [catalogModal, setCatalogModal] = useState(null);

  const { data: statsData, isLoading: statsLoading } = useGetAdminStatsQuery(
    undefined,
    { pollingInterval: 15000 },
  );
  const { data: usersData } = useGetAdminUsersQuery({
    search: userSearch || undefined,
  });
  const { data: apptData } = useGetAdminAppointmentsQuery({
    search: apptSearch || undefined,
  });
  const { data: specData } = useGetAdminSpecialtiesQuery();
  const { data: svcData } = useGetAdminServicesQuery();

  const [createUser] = useCreateAdminUserMutation();
  const [updateUser] = useUpdateAdminUserMutation();
  const [deleteUser] = useDeleteAdminUserMutation();
  const [updateAppt] = useUpdateAdminAppointmentMutation();
  const [saveSpec] = useSaveAdminSpecialtyMutation();
  const [deleteSpec] = useDeleteAdminSpecialtyMutation();
  const [saveSvc] = useSaveAdminServiceMutation();
  const [deleteSvc] = useDeleteAdminServiceMutation();

  const stats = statsData?.data;
  const users = usersData?.data || [];
  const appointments = apptData?.data || [];
  const maxTrend = Math.max(1, ...(stats?.trend || []).map((t) => t.count));

  const saveUser = async (e) => {
    e.preventDefault();
    try {
      if (userModal._id) {
        await updateUser({ id: userModal._id, ...userModal }).unwrap();
        toast.success("User updated");
      } else {
        await createUser(userModal).unwrap();
        toast.success("User created");
      }
      setUserModal(null);
    } catch (err) {
      toast.error(err?.data?.message || "Save failed");
    }
  };

  const saveCatalog = async (e) => {
    e.preventDefault();
    try {
      if (catalogModal.kind === "specialty")
        await saveSpec(catalogModal).unwrap();
      else await saveSvc(catalogModal).unwrap();
      toast.success("Saved");
      setCatalogModal(null);
    } catch (err) {
      toast.error(err?.data?.message || "Save failed");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-[#2563EB]">Administration</p>
        <h1 className="text-3xl font-semibold">Clinic operations</h1>
      </div>
      <div className="flex flex-wrap gap-2">
        {[
          "overview",
          "doctors",
          "patients",
          "appointments",
          "specialties",
          "services",
        ].map((item) => (
          <button
            key={item}
            onClick={() => setTab(item)}
            className={`rounded-full px-4 py-2 text-sm capitalize ${tab === item ? "bg-[#2563EB] text-white" : "bg-white"}`}
          >
            {item}
          </button>
        ))}
      </div>

      {tab === "overview" &&
        (statsLoading ? (
          <Skeleton className="h-64" />
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="p-5">
                <p className="text-sm text-slate-500">Patients</p>
                <p className="text-3xl font-semibold">{stats?.patients || 0}</p>
              </Card>
              <Card className="p-5">
                <p className="text-sm text-slate-500">Doctors</p>
                <p className="text-3xl font-semibold">{stats?.doctors || 0}</p>
              </Card>
              <Card className="p-5">
                <p className="text-sm text-slate-500">Appointments</p>
                <p className="text-3xl font-semibold">
                  {stats?.appointments || 0}
                </p>
              </Card>
            </div>
            <Card className="p-6">
              <h2 className="font-semibold">Bookings in the last 14 days</h2>
              <div className="mt-6 flex h-40 items-end gap-2">
                {(stats?.trend || []).map((point) => (
                  <div key={point._id} className="flex-1">
                    <div
                      className="rounded-t bg-[#2563EB]"
                      style={{ height: `${(point.count / maxTrend) * 140}px` }}
                    />
                    <p className="mt-1 truncate text-[10px] text-slate-400">
                      {point._id.slice(5)}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="p-6">
              <h2 className="font-semibold">Status mix</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-4">
                {Object.entries(stats?.status || {}).map(([key, value]) => (
                  <div key={key} className="rounded-xl bg-slate-50 p-4">
                    <p className="capitalize text-slate-500">{key}</p>
                    <p className="text-2xl font-semibold">{value}</p>
                  </div>
                ))}
              </div>
            </Card>
          </>
        ))}

      {(tab === "doctors" || tab === "patients") && (
        <Card className="p-6">
          <div className="mb-4 flex flex-wrap gap-3">
            <input
              className={inputClass + " max-w-xs"}
              placeholder="Search users"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
            />
            <Button
              onClick={() =>
                setUserModal({
                  ...emptyUser,
                  role: tab === "doctors" ? "doctors" : "patient",
                })
              }
            >
              Add {tab.slice(0, -1)}
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="p-3">Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Specialty / city</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {users
                  .filter((u) =>
                    tab === "doctors"
                      ? u.role === "doctors"
                      : u.role === "patient",
                  )
                  .map((u) => (
                    <tr key={u._id} className="border-t">
                      <td className="p-3 font-medium">{u.fullName}</td>
                      <td>{u.email}</td>
                      <td>{u.role}</td>
                      <td>{u.specialization || u.location || "—"}</td>
                      <td className="space-x-2 p-3">
                        <Button
                          variant="outline"
                          onClick={() => setUserModal(u)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          onClick={async () => {
                            await deleteUser(u._id).unwrap();
                            toast.success("Removed");
                          }}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab === "appointments" && (
        <Card className="p-6">
          <input
            className={inputClass + " mb-4 max-w-xs"}
            placeholder="Search appointments"
            value={apptSearch}
            onChange={(e) => setApptSearch(e.target.value)}
          />
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="p-3">Patient</th>
                  <th>Doctor</th>
                  <th>When</th>
                  <th>Fee</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((item) => (
                  <tr key={item._id} className="border-t">
                    <td className="p-3">{item.patientName}</td>
                    <td>{item.doctor?.fullName}</td>
                    <td>
                      {formatDate(item.appointmentDate)} {item.timeSlot}
                    </td>
                    <td>{formatCurrency(item.ticketPrice)}</td>
                    <td className="p-3">
                      <select
                        className="rounded-lg border px-2 py-1"
                        value={item.status}
                        onChange={async (e) => {
                          await updateAppt({
                            id: item._id,
                            status: e.target.value,
                          }).unwrap();
                          toast.success("Status updated");
                        }}
                      >
                        {["pending", "confirmed", "completed", "cancelled"].map(
                          (s) => (
                            <option key={s}>{s}</option>
                          ),
                        )}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab === "specialties" && (
        <Card className="p-6">
          <Button
            className="mb-4"
            onClick={() =>
              setCatalogModal({ ...emptyCatalog, kind: "specialty" })
            }
          >
            Add specialty
          </Button>
          {(specData?.data || []).map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between border-b py-3"
            >
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-slate-500">{item.description}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() =>
                    setCatalogModal({ ...item, kind: "specialty" })
                  }
                >
                  Edit
                </Button>
                <Button variant="danger" onClick={() => deleteSpec(item._id)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </Card>
      )}

      {tab === "services" && (
        <Card className="p-6">
          <Button
            className="mb-4"
            onClick={() =>
              setCatalogModal({
                ...emptyCatalog,
                kind: "service",
                category: "clinic",
              })
            }
          >
            Add service
          </Button>
          {(svcData?.data || []).map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between border-b py-3"
            >
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-slate-500">{item.description}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCatalogModal({ ...item, kind: "service" })}
                >
                  Edit
                </Button>
                <Button variant="danger" onClick={() => deleteSvc(item._id)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </Card>
      )}

      <Modal
        open={!!userModal}
        title={userModal?._id ? "Edit user" : "Add user"}
        onClose={() => setUserModal(null)}
      >
        {userModal && (
          <form onSubmit={saveUser} className="space-y-3">
            <Field label="Name">
              <input
                className={inputClass}
                value={userModal.fullName}
                onChange={(e) =>
                  setUserModal({ ...userModal, fullName: e.target.value })
                }
              />
            </Field>
            <Field label="Email">
              <input
                className={inputClass}
                value={userModal.email}
                onChange={(e) =>
                  setUserModal({ ...userModal, email: e.target.value })
                }
              />
            </Field>
            {!userModal._id && (
              <Field label="Password">
                <input
                  className={inputClass}
                  value={userModal.password}
                  onChange={(e) =>
                    setUserModal({ ...userModal, password: e.target.value })
                  }
                />
              </Field>
            )}
            <Field label="Role">
              <select
                className={inputClass}
                value={userModal.role}
                onChange={(e) =>
                  setUserModal({ ...userModal, role: e.target.value })
                }
              >
                <option value="patient">patient</option>
                <option value="doctors">doctors</option>
                <option value="admin">admin</option>
              </select>
            </Field>
            <Field label="Specialization">
              <input
                className={inputClass}
                value={userModal.specialization || ""}
                onChange={(e) =>
                  setUserModal({ ...userModal, specialization: e.target.value })
                }
              />
            </Field>
            <Button type="submit">Save</Button>
          </form>
        )}
      </Modal>

      <Modal
        open={!!catalogModal}
        title="Catalog item"
        onClose={() => setCatalogModal(null)}
      >
        {catalogModal && (
          <form onSubmit={saveCatalog} className="space-y-3">
            <Field label="Name">
              <input
                className={inputClass}
                value={catalogModal.name}
                onChange={(e) =>
                  setCatalogModal({ ...catalogModal, name: e.target.value })
                }
              />
            </Field>
            <Field label="Description">
              <textarea
                className={inputClass}
                value={catalogModal.description}
                onChange={(e) =>
                  setCatalogModal({
                    ...catalogModal,
                    description: e.target.value,
                  })
                }
              />
            </Field>
            <Button type="submit">Save</Button>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default AdminDashboard;
