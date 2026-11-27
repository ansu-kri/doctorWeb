import Card from "../../components/ui/Card";
import Skeleton from "../../components/ui/Skeleton";
import Button from "../../components/ui/Button";
import { useGetAdminStatsQuery } from "../../app/auth/authApi";

const AdminReports = () => {
  const { data, isLoading, isError, refetch } = useGetAdminStatsQuery();
  const stats = data?.data;
  const max = Math.max(1, ...(stats?.trend || []).map((item) => item.count));

  return (
    <div className="space-y-6">
      <div><p className="text-sm font-semibold text-[#2563EB]">Administration</p><h1 className="mt-1 text-3xl font-semibold">Reports</h1></div>
      {isLoading ? <Skeleton className="h-64" /> : isError ? (
        <Card className="p-6 text-center"><p className="text-red-600">Unable to load reports.</p><Button className="mt-4" variant="outline" onClick={() => refetch()}>Retry</Button></Card>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            {[["Patients", stats?.patients ?? 0], ["Doctors", stats?.doctors ?? 0], ["Appointments", stats?.appointments ?? 0]].map(([label, count]) => (
              <Card key={label} className="p-5"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-3xl font-semibold">{count}</p></Card>
            ))}
          </div>
          <Card className="p-6">
            <h2 className="font-semibold">Appointments created · last 14 days</h2>
            <div className="mt-6 flex h-48 items-end gap-2 overflow-x-auto">
              {(stats?.trend || []).map((item) => (
                <div key={item._id} className="flex min-w-8 flex-1 flex-col items-center justify-end">
                  <span className="mb-1 text-xs text-slate-500">{item.count}</span>
                  <div className="w-full max-w-10 rounded-t bg-[#2563EB]" style={{ height: `${Math.max(4, (item.count / max) * 145)}px` }} />
                  <span className="mt-1 text-[10px] text-slate-400">{item._id.slice(5)}</span>
                </div>
              ))}
              {(stats?.trend || []).length === 0 && <p className="m-auto text-sm text-slate-500">No appointment data for this period.</p>}
            </div>
          </Card>
          <Card className="p-6">
            <h2 className="font-semibold">Appointment status summary</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-4">
              {Object.entries(stats?.status || {}).map(([status, count]) => <div key={status} className="rounded-xl bg-slate-50 p-4"><p className="capitalize text-slate-500">{status}</p><p className="mt-1 text-2xl font-semibold">{count}</p></div>)}
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default AdminReports;
