import { useEffect, useState } from "react";
import { toast } from "sonner";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";
import Field, { inputClass } from "../../components/ui/Field";
import Skeleton from "../../components/ui/Skeleton";
import {
  FiPlus,
  FiTrash2,
  FiClock,
  FiToggleRight,
  FiToggleLeft,
} from "react-icons/fi";

import {
  useGetDoctorAvailabilityQuery,
  useUpdateDoctorAvailabilityMutation,
  type DoctorAvailability,
} from "../../app/auth/authApi";

const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const DoctorAvailability = () => {
  const [day, setDay] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [timeSlots, setTimeSlots] = useState<
    Array<{ day: string; startTime: string; endTime: string }>
  >([]);

  const [isAvailable, setIsAvailable] = useState(true);

  const {
    data: availabilityData,
    isLoading: availabilityLoading,
    isError: availabilityError,
    refetch: refetchAvailability,
  } = useGetDoctorAvailabilityQuery(undefined, {
    pollingInterval: 60000,
  });

  const [updateAvailability, { isLoading: isSaving }] =
    useUpdateDoctorAvailabilityMutation();

  const availability: DoctorAvailability | undefined = availabilityData?.data;

  // Sync local state when API data changes
  useEffect(() => {
    if (availability) {
      setTimeSlots(availability.timeSlots ?? []);
      setIsAvailable(availability.isAvailable ?? true);
    }
  }, [availability]);

  // Add working hours
  const handleAddSlot = () => {
    if (!day || !startTime || !endTime) {
      toast.error("Please fill in all fields");
      return;
    }

    // Convert time into total minutes
    const [startHour = 0, startMinute = 0] = startTime.split(":").map(Number);
    const [endHour = 0, endMinute = 0] = endTime.split(":").map(Number);

    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;

    if (startMinutes >= endMinutes) {
      toast.error("Start time must be before end time");
      return;
    }

    // Prevent duplicate slots
    const duplicate = timeSlots.some(
      (slot) =>
        slot.day === day &&
        slot.startTime === startTime &&
        slot.endTime === endTime,
    );

    if (duplicate) {
      toast.error("This time slot already exists");
      return;
    }

    setTimeSlots((prev) => [...prev, { day, startTime, endTime }]);

    setDay("");
    setStartTime("");
    setEndTime("");

    toast.success("Time slot added");
  };

  // Remove working hours
  const handleRemoveSlot = (index: number) => {
    setTimeSlots((prev) => prev.filter((_, i) => i !== index));
  };

  // Toggle availability
  const handleToggleAvailable = () => {
    setIsAvailable((prev) => !prev);
  };

  // Save availability
  const handleSave = async () => {
    try {
      await updateAvailability({
        timeSlots,
        isAvailable,
      }).unwrap();

      toast.success("Availability updated successfully");

      await refetchAvailability();
    } catch (error: unknown) {
      const err = error as {
        data?: { message?: string };
      };

      toast.error(err.data?.message || "Failed to update availability");
    }
  };

  // Loading state
  if (availabilityLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-48" />
        ))}
      </div>
    );
  }

  // Error state
  if (availabilityError) {
    return (
      <Card className="p-6 text-center">
        <p className="text-red-600">Unable to load availability.</p>

        <Button
          className="mt-4"
          variant="outline"
          onClick={() => refetchAvailability()}
        >
          Retry
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <p className="text-sm font-semibold text-[#2563EB]">
          Schedule Management
        </p>

        <h1 className="mt-1 text-3xl font-semibold text-slate-900">
          Availability
        </h1>

        <p className="mt-2 text-slate-500">
          Configure your working days and consultation hours.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Working Hours */}
        <Card className="lg:col-span-2 p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Working Hours</h2>

              <p className="text-sm text-slate-500">
                Set your available days and consultation times.
              </p>
            </div>

            <Button onClick={handleToggleAvailable} variant="outline">
              {isAvailable ? "Pause Availability" : "Resume Availability"}
            </Button>
          </div>

          {/* Availability Switch */}
          <div className="mb-6 p-4 rounded-xl border border-slate-200 bg-slate-50">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-600">
                Accepting appointments
              </span>

              <button
                type="button"
                role="switch"
                aria-checked={isAvailable}
                onClick={handleToggleAvailable}
                className={`relative inline-flex w-14 h-7 rounded-full transition-colors focus:outline-none ${
                  isAvailable ? "bg-[#2563EB]" : "bg-slate-200"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 rounded-full bg-white transition-transform ${
                    isAvailable ? "translate-x-8" : "translate-x-1"
                  }`}
                  aria-hidden="true"
                />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              {isAvailable
                ? "You are currently accepting appointments."
                : "You are not accepting new appointments."}
            </p>
          </div>

          {/* Add Time Slot */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Day">
              <select
                className={inputClass}
                value={day}
                onChange={(e) => setDay(e.target.value)}
              >
                <option value="">Select day</option>

                {WEEKDAYS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Start time">
              <input
                type="time"
                className={inputClass}
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </Field>

            <Field label="End time">
              <input
                type="time"
                className={inputClass}
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </Field>

            <div className="flex items-end">
              <Button onClick={handleAddSlot} disabled={!isAvailable}>
                <FiPlus size={18} />
                Add Slot
              </Button>
            </div>
          </div>

          {/* Empty State */}
          {timeSlots.length === 0 && (
            <EmptyState
              title="No working hours configured"
              description="Add your working days and consultation times to start receiving appointments."
            />
          )}

          {/* Time Slot List */}
          {timeSlots.map((slot, index) => (
            <div
              key={`${slot.day}-${slot.startTime}-${index}`}
              className="flex items-center justify-between rounded-xl border border-slate-100 p-3 mb-2"
            >
              <div>
                <p className="font-medium">{slot.day}</p>

                <p className="text-sm text-slate-500">
                  {slot.startTime} - {slot.endTime}
                </p>
              </div>

              <Button variant="danger" onClick={() => handleRemoveSlot(index)}>
                <FiTrash2 size={16} />
              </Button>
            </div>
          ))}
        </Card>

        {/* Status Card */}
        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Status</h2>

            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                isAvailable
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {isAvailable ? "Available" : "Unavailable"}
            </span>
          </div>

          <Card className="p-5">
            <p className="text-sm text-slate-500 mb-4">
              Configure when you are available for consultations. Patients can
              only book appointments during your configured working hours.
            </p>

            <div className="space-y-3">
              {/* Working Days */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <FiClock size={20} />

                  <div>
                    <p className="text-sm font-medium">Working days</p>

                    <p className="text-xs text-slate-500">
                      {timeSlots.length} time slot(s) configured
                    </p>
                  </div>
                </div>

                <span className="text-sm text-slate-400">
                  {timeSlots.length > 0 ? "Configured" : "Not set"}
                </span>
              </div>

              {/* Appointment Status */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full ${
                      isAvailable
                        ? "bg-blue-100 text-blue-600"
                        : "bg-slate-200 text-slate-400"
                    } flex items-center justify-center`}
                  >
                    {isAvailable ? (
                      <FiToggleRight size={16} />
                    ) : (
                      <FiToggleLeft size={16} />
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-medium">
                      Accepting appointments
                    </p>

                    <p className="text-xs text-slate-500">
                      {isAvailable ? "On" : "Off"}
                    </p>
                  </div>
                </div>

                <span className="text-sm text-slate-400">
                  {isAvailable ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            {/* Save Button */}
            <Button
              className="w-full mt-4"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Availability"}
            </Button>
          </Card>
        </Card>
      </div>
    </div>
  );
};

export default DoctorAvailability;
