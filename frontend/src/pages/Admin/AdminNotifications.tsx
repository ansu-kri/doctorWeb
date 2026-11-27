import { toast } from "sonner";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Skeleton from "../../components/ui/Skeleton";
import { useGetNotificationsQuery, useMarkNotificationsReadMutation } from "../../app/auth/authApi";
import { formatDate } from "../../utils/assets";

const AdminNotifications = () => {
  const { data, isLoading, isError, refetch } = useGetNotificationsQuery();
  const [markRead, { isLoading: marking }] = useMarkNotificationsReadMutation();
  const notifications = data?.data || [];

  const markAllRead = async () => {
    try {
      await markRead().unwrap();
      toast.success("Notifications marked as read");
    } catch {
      toast.error("Unable to update notifications");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><p className="text-sm font-semibold text-[#2563EB]">Administration</p><h1 className="mt-1 text-3xl font-semibold">Notifications</h1></div>
        <Button variant="outline" disabled={marking || notifications.every((item) => item.isRead)} onClick={markAllRead}>{marking ? "Updating…" : "Mark all read"}</Button>
      </div>
      {isLoading ? <Skeleton className="h-64" /> : isError ? (
        <Card className="p-6 text-center"><p className="text-red-600">Unable to load notifications.</p><Button className="mt-4" variant="outline" onClick={() => refetch()}>Retry</Button></Card>
      ) : notifications.length === 0 ? (
        <Card className="p-10 text-center text-slate-500">You have no notifications.</Card>
      ) : (
        <div className="space-y-3">{notifications.map((item) => (
          <Card key={item._id} className={`p-5 ${item.isRead ? "" : "border-blue-200 bg-blue-50/40"}`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div><h2 className="font-semibold text-slate-900">{item.title}</h2><p className="mt-1 text-sm text-slate-600">{item.message}</p></div>
              <div className="flex items-center gap-2 text-xs text-slate-500">{!item.isRead && <span className="rounded-full bg-blue-100 px-2 py-1 text-blue-700">Unread</span>}{item.createdAt ? formatDate(item.createdAt) : ""}</div>
            </div>
          </Card>
        ))}</div>
      )}
    </div>
  );
};

export default AdminNotifications;
