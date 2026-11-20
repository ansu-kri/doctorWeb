import { Link } from "react-router-dom";
import Card from "../components/ui/Card";
import Skeleton from "../components/ui/Skeleton";
import { useGetServicesQuery } from "../app/auth/authApi";

const Services = () => {
  const { data, isLoading, isError } = useGetServicesQuery();
  const services = data?.data || [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-3xl font-semibold">Healthcare services</h1>
      <p className="mt-2 max-w-2xl text-slate-500">
        Every service below is offered by Medicare clinics and can be booked
        with a matching specialist.
      </p>
      {isLoading && (
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <Skeleton key={n} className="h-40" />
          ))}
        </div>
      )}
      {isError && <p className="mt-8 text-red-600">Unable to load services.</p>}
      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <Card key={service._id} className="p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#2563EB]">
              {service.category}
            </p>
            <h2 className="mt-2 text-xl font-semibold">{service.name}</h2>
            <p className="mt-2 text-sm text-slate-500">{service.description}</p>
            <Link
              to={`/doctors?specialization=${encodeURIComponent(service.name)}`}
              className="mt-4 inline-block text-sm font-semibold text-[#2563EB]"
            >
              Find a specialist →
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Services;
