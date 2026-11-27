import { Link } from "react-router-dom";
import Card from "../components/ui/Card";
import Skeleton from "../components/ui/Skeleton";
import { useGetServicesQuery, useGetSpecialtiesQuery } from "../app/auth/authApi";
import EmptyState from "../components/ui/EmptyState";
import Button from "../components/ui/Button";

interface Service {
  _id: string;
  name: string;
  description?: string;
  category?: string;
}

const Services = () => {
  const { data, isLoading, isError, refetch } = useGetServicesQuery();
  const { data: specialtiesData } = useGetSpecialtiesQuery();
  const services: Service[] = data?.data || [];
  const specialties = specialtiesData?.data || [];

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
      {isError && (
        <div className="mt-8 rounded-xl border border-red-100 bg-red-50 p-5 text-center">
          <p className="text-red-700">Unable to load services.</p>
          <Button className="mt-4" variant="outline" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      )}
      {!isLoading && !isError && services.length === 0 && (
        <div className="mt-8">
          <EmptyState
            title="No services available"
            description="Please check again later."
          />
        </div>
      )}
      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <Card key={service._id} className="p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#2563EB]">
              {service.category}
            </p>
            <h2 className="mt-2 text-xl font-semibold">{service.name}</h2>
            <p className="mt-2 text-sm text-slate-500">
              {service.description}
            </p>
            <Link
              to={`/doctors?specialization=${encodeURIComponent(service.name)}`}
              className="mt-4 inline-block text-sm font-semibold text-[#2563EB]"
            >
              Find a specialist →
            </Link>
          </Card>
        ))}
      </div>
      {specialties.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-semibold">Medical specialties</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {specialties.map((specialty) => (
              <Link
                key={specialty._id}
                to={`/doctors?specialization=${encodeURIComponent(specialty.name)}`}
              >
                <Card className="h-full p-6 transition hover:border-blue-200">
                  <h3 className="font-semibold">{specialty.name}</h3>
                  {specialty.description && (
                    <p className="mt-2 text-sm text-slate-500">
                      {specialty.description}
                    </p>
                  )}
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Services;