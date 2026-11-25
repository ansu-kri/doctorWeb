import { useMemo, useState, ChangeEvent, FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import DoctorCard from "../../components/doctors/DoctorCard";
import Skeleton from "../../components/ui/Skeleton";
import EmptyState from "../../components/ui/EmptyState";
import Button from "../../components/ui/Button";
import {
  useGetAlldoctorsQuery,
  useGetSpecialtiesQuery,
} from "../../app/auth/authApi";

interface DoctorFilterForm {
  search: string;
  specialization: string;
  location: string;
  available: string;
}

interface QueryParams {
  search?: string;
  specialization?: string;
  location?: string;
  available?: string;
}

const Doctors = () => {
  const [params, setParams] = useSearchParams();
  const [form, setForm] = useState<DoctorFilterForm>({
    search: params.get("search") || "",
    specialization: params.get("specialization") || "",
    location: params.get("location") || "",
    available: params.get("available") || "",
  });

  const query = useMemo<QueryParams>(
    () => ({
      search: params.get("search") || undefined,
      specialization: params.get("specialization") || undefined,
      location: params.get("location") || undefined,
      available: params.get("available") || undefined,
    }),
    [params]
  );

  const { data, isLoading, isError, error } = useGetAlldoctorsQuery(query);
  const { data: specialtiesData } = useGetSpecialtiesQuery();
  const doctors = data?.data || [];
  const specialties = specialtiesData?.data || [];

  const apply = (e: FormEvent) => {
    e.preventDefault();
    const next = new URLSearchParams();
    Object.entries(form).forEach(([k, v]) => v && next.set(k, v));
    setParams(next);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-semibold">Find a doctor</h1>
      <p className="mt-2 text-slate-500">
        Filter by specialty, city, and doctors currently accepting visits.
      </p>

      <form
        onSubmit={apply}
        className="mt-8 grid gap-3 rounded-2xl bg-white p-4 shadow-sm md:grid-cols-5"
      >
        <input
          list="doctor-suggestions"
          className="rounded-xl border border-slate-200 px-4 py-3"
          placeholder="Search name or specialty"
          value={form.search}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setForm({ ...form, search: e.target.value })
          }
        />
        <datalist id="doctor-suggestions">
          {doctors.map((d) => (
            <option key={d._id} value={d.fullName} />
          ))}
        </datalist>
        <select
          className="rounded-xl border border-slate-200 px-4 py-3"
          value={form.specialization}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            setForm({ ...form, specialization: e.target.value })
          }
        >
          <option value="">Specialization</option>
          {specialties.map((item) => (
            <option key={item._id} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>
        <input
          className="rounded-xl border border-slate-200 px-4 py-3"
          placeholder="Location"
          value={form.location}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setForm({ ...form, location: e.target.value })
          }
        />
        <select
          className="rounded-xl border border-slate-200 px-4 py-3"
          value={form.available}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            setForm({ ...form, available: e.target.value })
          }
        >
          <option value="">Availability</option>
          <option value="true">Accepting appointments</option>
        </select>
        <Button type="submit">Apply filters</Button>
      </form>

      {isLoading && (
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <Skeleton key={n} className="h-96" />
          ))}
        </div>
      )}
      {isError && (
        <p className="mt-8 text-red-600">
          {error?.data?.message || "Unable to load doctors"}
        </p>
      )}
      {!isLoading && !isError && doctors.length === 0 && (
        <div className="mt-8">
          <EmptyState
            title="No doctors match these filters"
            description="Try another specialty or city."
          />
        </div>
      )}
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {doctors.map((doctor) => (
          <DoctorCard key={doctor._id} doctor={doctor} />
        ))}
      </div>
    </div>
  );
};

export default Doctors;