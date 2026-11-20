const bcrypt = require("bcrypt");
const User = require("./Model/user");
const Specialty = require("./Model/Specialty");
const Service = require("./Model/Service");

const defaultSlots = [
  { day: "Monday", startTime: "10:00", endTime: "13:00" },
  { day: "Monday", startTime: "15:00", endTime: "18:00" },
  { day: "Tuesday", startTime: "10:00", endTime: "13:00" },
  { day: "Wednesday", startTime: "10:00", endTime: "13:00" },
  { day: "Wednesday", startTime: "16:00", endTime: "19:00" },
  { day: "Thursday", startTime: "11:00", endTime: "15:00" },
  { day: "Friday", startTime: "10:00", endTime: "14:00" },
  { day: "Saturday", startTime: "09:00", endTime: "13:00" },
];

const specialties = [
  { name: "General Consultation", description: "Primary care for everyday health concerns and follow-ups.", icon: "stethoscope" },
  { name: "Cardiology", description: "Heart health, hypertension, and preventive cardiac screening.", icon: "heart" },
  { name: "Dermatology", description: "Skin, hair, and cosmetic dermatology consultations.", icon: "sparkles" },
  { name: "Neurology", description: "Headache, stroke risk, and neurological disorder care.", icon: "brain" },
  { name: "Pediatrics", description: "Child wellness visits, vaccinations, and development support.", icon: "baby" },
  { name: "Orthopedics", description: "Joint, bone, and sports injury evaluation and treatment.", icon: "bone" },
  { name: "Dental Care", description: "Preventive dentistry, restorations, and oral health exams.", icon: "smile" },
];

const services = [
  { name: "General Consultation", category: "clinic", description: "Same-week visits with experienced physicians for diagnosis and care plans.", icon: "stethoscope" },
  { name: "Cardiology", category: "specialty", description: "ECG review, cardiac risk assessment, and specialist follow-up.", icon: "heart" },
  { name: "Dermatology", category: "specialty", description: "Acne, eczema, allergy, and skin lesion evaluation.", icon: "sparkles" },
  { name: "Neurology", category: "specialty", description: "Migraine, neuropathy, and seizure care with neurologists.", icon: "brain" },
  { name: "Pediatrics", category: "family", description: "Growth checks, immunizations, and pediatric sick visits.", icon: "baby" },
  { name: "Orthopedics", category: "specialty", description: "Fracture follow-up, arthritis care, and physiotherapy guidance.", icon: "bone" },
  { name: "Dental Care", category: "clinic", description: "Cleaning, fillings, and oral examinations in a sterile clinic setting.", icon: "smile" },
  { name: "Diagnostic Services", category: "diagnostics", description: "Lab tests, imaging referrals, and structured result reviews.", icon: "flask" },
  { name: "Online Consultation", category: "virtual", description: "Secure video visits for follow-ups and second opinions.", icon: "video" },
];

const doctors = [
  {
    fullName: "Dr. Ananya Sharma",
    email: "ananya.sharma@medicare.clinic",
    specialization: "Cardiology",
    hospital: "Medicare Heart Centre",
    location: "Bengaluru",
    ticketPrice: 1200,
    gender: "female",
    bio: "Interventional cardiologist focused on preventive heart care.",
    about: "Dr. Sharma has 14 years of experience treating hypertension, arrhythmia, and coronary disease. She emphasizes lifestyle coaching alongside clinical treatment.",
    qualifications: ["MBBS, AIIMS Delhi", "DM Cardiology, NIMHANS"],
    experiences: ["Senior Consultant, Apollo Hospitals (2016–2022)", "Head of Preventive Cardiology, Medicare (2022–present)"],
  },
  {
    fullName: "Dr. Rohan Mehta",
    email: "rohan.mehta@medicare.clinic",
    specialization: "Neurology",
    hospital: "Medicare Neurosciences",
    location: "Mumbai",
    ticketPrice: 1100,
    gender: "male",
    bio: "Neurologist specializing in migraine and stroke recovery.",
    about: "Dr. Mehta combines evidence-based neurology with clear patient education so families understand next steps after a diagnosis.",
    qualifications: ["MBBS, KEM Hospital", "DM Neurology, PGI Chandigarh"],
    experiences: ["Consultant Neurologist, Fortis (2015–2021)", "Lead Neurologist, Medicare (2021–present)"],
  },
  {
    fullName: "Dr. Priya Nair",
    email: "priya.nair@medicare.clinic",
    specialization: "Dermatology",
    hospital: "Medicare Skin Clinic",
    location: "Hyderabad",
    ticketPrice: 900,
    gender: "female",
    bio: "Board-certified dermatologist for medical and aesthetic skin care.",
    about: "Dr. Nair treats chronic skin conditions and offers conservative aesthetic procedures with a focus on safety.",
    qualifications: ["MBBS, CMC Vellore", "MD Dermatology, JIPMER"],
    experiences: ["Consultant Dermatologist, Manipal Hospitals"],
  },
  {
    fullName: "Dr. Arjun Patel",
    email: "arjun.patel@medicare.clinic",
    specialization: "Pediatrics",
    hospital: "Medicare Children's Clinic",
    location: "Ahmedabad",
    ticketPrice: 700,
    gender: "male",
    bio: "Pediatrician supporting families from newborn care through adolescence.",
    about: "Dr. Patel is known for unhurried well-child visits and vaccination counseling.",
    qualifications: ["MBBS, BJ Medical College", "MD Pediatrics, AIIMS"],
    experiences: ["Pediatric Consultant, Rainbow Children's Hospital"],
  },
  {
    fullName: "Dr. Meera Iyer",
    email: "meera.iyer@medicare.clinic",
    specialization: "Orthopedics",
    hospital: "Medicare Bone & Joint",
    location: "Chennai",
    ticketPrice: 1000,
    gender: "female",
    bio: "Orthopedic surgeon focused on sports injuries and joint preservation.",
    about: "Dr. Iyer helps patients return to activity with a mix of surgical and non-surgical plans.",
    qualifications: ["MBBS, Madras Medical College", "MS Orthopedics, CMC Vellore"],
    experiences: ["Sports Medicine Fellow, UK", "Consultant, Medicare Orthopedics"],
  },
  {
    fullName: "Dr. Kabir Khan",
    email: "kabir.khan@medicare.clinic",
    specialization: "Dental Care",
    hospital: "Medicare Dental Studio",
    location: "Delhi",
    ticketPrice: 600,
    gender: "male",
    bio: "Restorative dentist with a gentle approach to family dental care.",
    about: "Dr. Khan provides preventive dentistry, root canal therapy, and smile rehabilitation.",
    qualifications: ["BDS, Maulana Azad", "MDS Conservative Dentistry"],
    experiences: ["Lead Dentist, Clove Dental", "Consultant, Medicare Dental"],
  },
  {
    fullName: "Dr. Sana Qureshi",
    email: "sana.qureshi@medicare.clinic",
    specialization: "General Consultation",
    hospital: "Medicare Primary Care",
    location: "Pune",
    ticketPrice: 500,
    gender: "female",
    bio: "Family physician coordinating whole-person primary care.",
    about: "Dr. Qureshi manages chronic disease, annual physicals, and referrals across the Medicare network.",
    qualifications: ["MBBS, BJMC Pune", "DNB Family Medicine"],
    experiences: ["Family Physician, Medicare Primary Care"],
  },
];

const seedIfNeeded = async () => {
  try {
    if ((await Specialty.countDocuments()) === 0) {
      await Specialty.insertMany(specialties);
      console.log("Seeded specialties");
    }
    if ((await Service.countDocuments()) === 0) {
      await Service.insertMany(services);
      console.log("Seeded services");
    }

    const adminEmail = process.env.ADMIN_EMAIL || "admin@medicare.clinic";
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin@12345";
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      await User.create({
        fullName: "Medicare Admin",
        email: adminEmail,
        password: await bcrypt.hash(adminPassword, 10),
        role: "admin",
        gender: "other",
        isApproved: "approved",
      });
      console.log(`Seeded admin account: ${adminEmail}`);
    }

    for (const doctor of doctors) {
      const exists = await User.findOne({ email: doctor.email });
      if (exists) continue;
      await User.create({
        ...doctor,
        password: await bcrypt.hash("Doctor@12345", 10),
        role: "doctors",
        phone: "9876543210",
        isApproved: "approved",
        isAvailable: true,
        timeSlots: defaultSlots,
      });
    }
  } catch (error) {
    console.error("Seed failed:", error.message);
  }
};

module.exports = seedIfNeeded;
