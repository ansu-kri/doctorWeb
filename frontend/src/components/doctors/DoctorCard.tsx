import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { formatCurrency, mediaUrl } from "../../utils/assets";
import fallback from "../../assets/images/doctor-img01.png";

export interface DoctorCardProps {
  doctor: {
    _id: string;
    fullName: string;
    specialization?: string;
    averageRating?: number | string;
    hospital?: string;
    location?: string;
    ticketPrice?: number | string;
    profilePic?: string;
  };
}

const DoctorCard = ({ doctor }: DoctorCardProps) => {
  const photo = mediaUrl(doctor.profilePic ?? undefined) ?? fallback;
  return (
    <Card className="flex h-full flex-col p-5 transition hover:-translate-y-1 hover:shadow-lg">
      <img src={photo} alt={doctor.fullName} className="h-48 w-full rounded-xl object-cover object-top" />
      <div className="mt-4 flex items-center justify-between">
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[#2563EB]">
          {doctor.specialization || "General Consultation"}
        </span>
        <span className="flex items-center gap-1 text-sm text-amber-500">
          <FaStar /> {doctor.averageRating || "New"}
        </span>
      </div>
      <h3 className="mt-3 text-lg font-semibold text-slate-900">{doctor.fullName}</h3>
      <p className="text-sm text-slate-500">
        {doctor.hospital || "Medicare Clinic"} · {doctor.location || "India"}
      </p>
      <p className="mt-2 text-sm font-medium text-slate-700">{formatCurrency(doctor.ticketPrice)} consultation</p>
      <div className="mt-auto flex gap-2 pt-4">
        <Link to={`/doctors/${doctor._id}`} className="flex-1">
          <Button variant="outline" className="w-full">
            View profile
          </Button>
        </Link>
        <Link to={`/book/${doctor._id}`} className="flex-1">
          <Button className="w-full">Book</Button>
        </Link>
      </div>
    </Card>
  );
};

export default DoctorCard;