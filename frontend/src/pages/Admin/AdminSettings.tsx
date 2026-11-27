import { Link } from "react-router-dom";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { useGetMeQuery } from "../../app/auth/authApi";

const AdminSettings = () => {
  const { data, isLoading, isError } = useGetMeQuery();

  return (
    <div className="space-y-6">
      <div><p className="text-sm font-semibold text-[#2563EB]">Administration</p><h1 className="mt-1 text-3xl font-semibold">Settings</h1></div>
      <Card className="max-w-3xl p-6">
        <h2 className="text-lg font-semibold">Administrator account</h2>
        {isLoading ? <p className="mt-3 text-sm text-slate-500">Loading account…</p> : isError ? <p className="mt-3 text-sm text-red-600">Unable to load account settings.</p> : (
          <p className="mt-3 text-sm text-slate-600">Signed in as {data?.data.fullName} ({data?.data.email}).</p>
        )}
        <Link className="mt-5 inline-block" to="/admin/profile/settings"><Button variant="outline">Manage profile settings</Button></Link>
      </Card>
      <Card className="max-w-3xl p-6">
        <h2 className="text-lg font-semibold">System configuration</h2>
        <p className="mt-2 text-sm text-slate-600">System-wide configuration is managed through the deployment environment. No editable settings API is configured for this application.</p>
      </Card>
    </div>
  );
};

export default AdminSettings;
