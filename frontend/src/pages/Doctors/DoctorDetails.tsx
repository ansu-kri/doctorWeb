import { useState, ChangeEvent, FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { toast } from "sonner";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Skeleton from "../../components/ui/Skeleton";
import {
  useAddReviewMutation,
  useGetDoctorQuery,
} from "../../app/auth/authApi";
import { formatCurrency, mediaUrl } from "../../utils/assets";
import { getStoredUser } from "../../utils/auth";
import fallback from "../../assets/images/doctor-img01.png";

interface StoredUser {
  [key: string]: unknown;
  role?: string;
  fullName?: string;
}

interface Review {
  _id: string;
  user?: { fullName: string };
  rating: number;
  comment: string;
}

interface TimeSlot {
  day: string;
  startTime: string;
  endTime: string;
}

interface Doctor {
  _id: string;
  fullName: string;
  specialization?: string;
  averageRating?: number | string;
  totalRating?: number;
  hospital?: string;
  location?: string;
  ticketPrice?: number | string;
  profilePic?: string;
  bio?: string;
  qualifications?: string[];
  experiences?: string[];
  timeSlots?: TimeSlot[];
  reviews?: Review[];
}

const DoctorDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = getStoredUser() as StoredUser | null;
  const { data, isLoading, isError, error } = useGetDoctorQuery(id ?? "");
  const [addReview, { isLoading: reviewing }] = useAddReviewMutation();
  const [tab, setTab] = useState("about");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const doctor = data?.data as Doctor | undefined;

  const submitReview = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return navigate("/login");
    try {
      await addReview({ id: id ?? "", rating, comment }).unwrap();
      toast.success("Review published");
      setComment("");
    } catch (err) {
      toast.error(err?.data?.message || "Unable to submit review");
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10">
        <Skeleton className="h-[480px]" />
      </div>
    );
  }
  if (isError || !doctor) {
    return (
      <p className="px-4 py-10 text-center text-red-600">
        {error?.data?.message || "Doctor not found"}
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="grid gap-8 lg:grid-cols-12">
        <Card className="p-6 lg:col-span-8">
          <div className="flex flex-col gap-6 sm:flex-row">
            <img
              src={mediaUrl(doctor.profilePic ?? undefined) ?? fallback}
              alt={doctor.fullName}
              className="h-44 w-44 rounded-2xl object-cover"
            />
            <div>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-[#2563EB]">
                {doctor.specialization}
              </span>
              <h1 className="mt-3 text-3xl font-semibold">{doctor.fullName}</h1>
              <p className="mt-1 flex items-center gap-2 text-slate-600">
                <FaStar className="text-amber-500" />
                {doctor.averageRating || "New"} ({doctor.totalRating || 0} reviews)
              </p>
              <p className="mt-2 text-slate-500">
                {doctor.hospital} · {doctor.location}
              </p>
              <p className="mt-3 max-w-xl text-slate-600">{doctor.bio}</p>
            </div>
          </div>

          <div className="mt-8 flex gap-6 border-b">
            {["about", "reviews"].map((item) => (
              <button
                key={item}
                onClick={() => setTab(item)}
                className={`pb-3 capitalize ${tab === item ? "border-b-2 border-[#2563EB] font-semibold text-[#2563EB]" : "text-slate-500"}`}
              >
                {item}
              </button>
            ))}
          </div>

          {tab === "about" && (
            <div className="mt-6 space-y-6">
              <p className="leading-7 text-slate-600">{doctor.about}</p>
              <div>
                <h3 className="font-semibold">Qualifications</h3>
                <ul className="mt-2 list-disc pl-5 text-slate-600">
                  {(doctor.qualifications || []).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold">Experience</h3>
                <ul className="mt-2 list-disc pl-5 text-slate-600">
                  {(doctor.experiences || []).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {tab === "reviews" && (
            <div className="mt-6 space-y-6">
              {(doctor.reviews || []).length === 0 && (
                <p className="text-slate-500">No reviews yet.</p>
              )}
              {(doctor.reviews || []).map((review) => (
                <div
                  key={review._id}
                  className="border-b border-slate-100 pb-4"
                >
                  <p className="font-medium">{review.user?.fullName}</p>
                  <p className="text-amber-500">{"★".repeat(review.rating)}</p>
                  <p className="text-slate-600">{review.comment}</p>
                </div>
              ))}
              <form onSubmit={submitReview} className="space-y-3">
                <select
                  className="rounded-xl border px-4 py-3"
                  value={rating}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => setRating(Number(e.target.value))}
                >
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>
                      {n} stars
                    </option>
                  ))}
                </select>
                <textarea
                  required
                  rows="4"
                  className="w-full rounded-xl border px-4 py-3"
                  placeholder="Share how the visit went"
                  value={comment}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)}
                />
                <Button type="submit" disabled={reviewing}>
                  {reviewing ? "Submitting..." : "Submit review"}
                </Button>
              </form>
            </div>
          )}
        </Card>

        <Card className="h-fit p-6 lg:col-span-4">
          <p className="text-sm text-slate-500">Consultation fee</p>
          <p className="text-3xl font-semibold text-[#2563EB]">
            {formatCurrency(doctor.ticketPrice ?? 0)}
          </p>
          <p className="mt-4 text-sm font-medium">Weekly availability</p>
          <ul className="mt-2 space-y-1 text-sm text-slate-600">
            {(doctor.timeSlots || []).map((slot, i) => (
              <li key={`${slot.day}-${i}`}>
                {slot.day}: {slot.startTime} – {slot.endTime}
              </li>
            ))}
          </ul>
          <Link to={`/book/${doctor._id}`}>
            <Button className="mt-6 w-full">Book appointment</Button>
          </Link>
        </Card>
      </div>
    </div>
  );
};

export default DoctorDetails;