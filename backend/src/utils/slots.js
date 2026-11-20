const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const toMinutes = (hhmm) => {
  const [h, m] = String(hhmm).split(":").map(Number);
  return h * 60 + m;
};

const toTime = (mins) => {
  const h = String(Math.floor(mins / 60)).padStart(2, "0");
  const m = String(mins % 60).padStart(2, "0");
  return `${h}:${m}`;
};

const startOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const generateSlotsForDate = (timeSlots = [], date) => {
  const dayName = WEEKDAYS[new Date(date).getDay()];
  const windows = timeSlots.filter(
    (slot) => slot.day?.toLowerCase() === dayName.toLowerCase()
  );
  const slots = [];
  windows.forEach((window) => {
    let cursor = toMinutes(window.startTime);
    const end = toMinutes(window.endTime);
    while (cursor + 30 <= end) {
      slots.push(toTime(cursor));
      cursor += 30;
    }
  });
  return slots;
};

module.exports = { WEEKDAYS, generateSlotsForDate, startOfDay };
