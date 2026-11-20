import { Link, useLocation } from "react-router-dom";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { formatCurrency, formatDate } from "../utils/assets";

const CheckoutSuccess = () => {
  const appointment = useLocation().state?.appointment;

  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <Card className="p-8 text-center">
        <p className="text-sm font-semibold text-emerald-600">
          Booking confirmed
        </p>
        <h1 className="mt-2 text-3xl font-semibold">
          Your visit is on the calendar
        </h1>
        {appointment ? (
          <div className="mt-6 space-y-1 text-slate-600">
            <p>{appointment.doctor?.fullName}</p>
            <p>
              {formatDate(appointment.appointmentDate)} at{" "}
              {appointment.timeSlot}
            </p>
            <p className="capitalize">
              {appointment.consultationType} · {appointment.status}
            </p>
            <p>{formatCurrency(appointment.ticketPrice)}</p>
          </div>
        ) : (
          <p className="mt-4 text-slate-500">
            Open your dashboard to see appointment status.
          </p>
        )}
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/dashboard">
            <Button>Go to dashboard</Button>
          </Link>
          <Link to="/doctors">
            <Button variant="outline">Book another</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default CheckoutSuccess;
