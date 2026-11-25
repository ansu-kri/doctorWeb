import doctorImg01 from "../images/doctor-img01.png";
import doctorImg02 from "../images/doctor-img02.png";
import doctorImg03 from "../images/doctor-img03.png";

export interface DoctorData {
  id: string;
  name: string;
  specialty: string;
  avgRating: number;
  totalRating: number;
  photo: string;
  totalPatients: number;
  hospital: string;
}

export const doctors: DoctorData[] = [
  {
    id: "01",
    name: "Dr. Alfaz Ahmed",
    specialty: "Surgeon",
    avgRating: 4.8,
    totalRating: 272,
    photo: doctorImg01,
    totalPatients: 1500,
    hospital: "Mount Adora Hospital, Sylhet.",
  },
  {
    id: "02",
    name: "Dr. Saleh Mahmud",
    specialty: "Neurologist",
    avgRating: 4.8,
    totalRating: 272,
    photo: doctorImg02,
    totalPatients: 1500,
    hospital: "Mount Adora Hospital, Sylhet.",
  },
  {
    id: "03",
    name: "Dr. Farid Uddin",
    specialty: "Dermatologist",
    avgRating: 4.8,
    totalRating: 272,
    photo: doctorImg03,
    totalPatients: 1500,
    hospital: "Mount Adora Hospital, Sylhet.",
  },
];