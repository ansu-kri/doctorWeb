import {
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ComponentType,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUserMd,
  FaHeartbeat,
  FaHospital,
} from "react-icons/fa";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import DoctorCard from "../components/doctors/DoctorCard";
import Skeleton from "../components/ui/Skeleton";
import {
  useGetAlldoctorsQuery,
  useGetPublicStatsQuery,
  useGetServicesQuery,
  useGetSpecialtiesQuery,
} from "../app/auth/authApi";

import hero from "../assets/images/hero-img01.png";
import doctor2 from "../assets/images/doctor-img05.png";
import feature from "../assets/images/feature-img.png";
import about from "../assets/images/doctor-image04.png";

interface QueryState {
  search: string;
  specialization: string;
  location: string;
}
interface Stats {
  doctors: number;
  patients: number;
}
interface Feature {
  Icon: ComponentType<{ className?: string }>;
  text: string;
}
interface Statistic {
  value: string;
  label: string;
}
const Home = () => {
  const navigate = useNavigate();

  const [query, setQuery] = useState<QueryState>({
    search: "",
    specialization: "",
    location: "",
  });

  // API Queries
  const { data: doctorsData, isLoading: doctorsLoading } =
    useGetAlldoctorsQuery();
  const { data: specialtiesData } = useGetSpecialtiesQuery();
  const { data: servicesData } = useGetServicesQuery();
  const { data: statsData } = useGetPublicStatsQuery();
  // API Data
  const doctors = doctorsData?.data || [];
  const specialties = specialtiesData?.data || [];
  const services = (servicesData?.data || []).slice(0, 6);

  // Statistics
  const stats: Stats = {
    doctors: statsData?.data?.doctors ?? 0,
    patients: statsData?.data?.patients ?? 0,
  };

  // Featured Doctors
  const featured = useMemo(() => doctors.slice(0, 3), [doctors]);

  // Search Doctors
  const searchDoctors = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });
    navigate(`/doctors?${params.toString()}`);
  };
  // Statistics Data
  const statistics: Statistic[] = [
    {
      value: `${stats.doctors}+`,
      label: "Specialists",
    },
    {
      value: `${stats.patients}+`,
      label: "Patients",
    },
  ];
  // Why Choose Medicare Features
  const features: Feature[] = [
    {
      Icon: FaUserMd,
      text: "Verified specialists with transparent fees and live availability.",
    },
    {
      Icon: FaHeartbeat,
      text: "Continuity of care across clinic visits and online follow-ups.",
    },
    {
      Icon: FaHospital,
      text: "Coordinated diagnostics, referrals, and appointment records.",
    },
  ];
  return (
    <div>
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#2563EB]">
              Premium clinic care
            </p>
            <h1 className="text-4xl font-semibold leading-tight text-slate-900 md:text-5xl">
              Expert doctors, clearer answers, and appointments that actually
              stick.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
              Medicare connects you with verified specialists for in-person
              and online consultations. Search by specialty, compare fees, and
              book a real slot in minutes.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/doctors">
                <Button>Find a doctor</Button>
              </Link>
              <Link to="/services">
                <Button variant="outline">Explore services</Button>
              </Link>
            </div>
            <div className="mt-12 grid grid-cols-3 gap-6">
              {statistics.map(({ value, label }) => (
                <div key={label}>
                  <p className="text-3xl font-bold text-slate-900">
                    {value}
                  </p>
                  <div className="mt-1 h-1 w-12 rounded bg-[#2563EB]" />
                  <p className="mt-2 text-sm text-slate-500">{label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-center gap-4">
            <img
              src={hero}
              alt="Consulting physician"
              className="h-[380px] w-[250px] rounded-3xl object-cover shadow-xl"
            />
            <div className="hidden flex-col gap-4 sm:flex">
              <img
                src={feature}
                alt="Clinic care"
                className="h-44 w-48 rounded-2xl object-cover shadow-lg"
              />
              <img
                src={doctor2}
                alt="Specialist"
                className="h-48 w-48 rounded-2xl object-cover shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4">
        <Card className="-mt-6 p-6">
          <form
            onSubmit={searchDoctors}
            className="grid gap-3 md:grid-cols-4"
          >
            <input
              className="rounded-xl border border-slate-200 px-4 py-3"
              placeholder="Doctor name"
              value={query.search}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setQuery({ ...query, search: e.target.value })
              }
            />
            <select
              className="rounded-xl border border-slate-200 px-4 py-3"
              value={query.specialization}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setQuery({
                  ...query,
                  specialization: e.target.value,
                })
              }
            >
              <option value="">All specialties</option>
              {specialties.map((item) => (
                <option key={item._id} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
            <input
              className="rounded-xl border border-slate-200 px-4 py-3"
              placeholder="City or clinic"
              value={query.location}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setQuery({ ...query, location: e.target.value })
              }
            />
            <Button type="submit">Search doctors</Button>
          </form>
        </Card>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-semibold">Popular specialties</h2>
          <p className="mt-2 text-slate-500">
            Choose a department and see doctors who are accepting appointments.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {specialties.map((item) => (
            <Link
              key={item._id}
              to={`/doctors?specialization=${encodeURIComponent(item.name)}`}
            >
              <Card className="h-full p-5 transition hover:border-blue-200">
                <h3 className="font-semibold text-slate-900">
                  {item.name}
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  {item.description}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </section>
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-semibold">Featured doctors</h2>
              <p className="mt-2 text-slate-500">
                Highly rated clinicians across the Medicare network.
              </p>
            </div>
            <Link
              to="/doctors"
              className="text-sm font-semibold text-[#2563EB]"
            >
              View all
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {doctorsLoading
              ? [1, 2, 3].map((n) => (
                  <Skeleton key={n} className="h-96" />
                ))
              : featured.map((doctor) => (
                  <DoctorCard key={doctor._id} doctor={doctor} />
                ))}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="text-center text-3xl font-semibold">
          Healthcare services
        </h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {services.map((service) => (
            <Card key={service._id} className="p-6">
              <h3 className="text-lg font-semibold">{service.name}</h3>

              <p className="mt-2 text-sm text-slate-500">
                {service.description}
              </p>
            </Card>
          ))}
        </div>
      </section>
      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 md:grid-cols-2">
          <img
            src={about}
            alt="Medicare clinician"
            className="rounded-3xl shadow-xl"
          />
          <div>
            <h2 className="text-3xl font-semibold">
              Why patients choose Medicare
            </h2>
            <div className="mt-6 space-y-4">
              {features.map(({ Icon, text }) => (
                <div key={text} className="flex gap-3">
                  <Icon className="mt-1 text-[#2563EB]" />
                  <p className="text-slate-600">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="px-4 pb-16">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 rounded-3xl bg-[#2563EB] px-8 py-10 text-white md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-semibold">
              Ready to book a specialist?
            </h2>
            <p className="mt-2 text-blue-100">
              Choose a doctor, pick a live slot, and keep the visit on your
              dashboard.
            </p>
          </div>
          <Link to="/doctors">
            <Button variant="secondary">Book an appointment</Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;