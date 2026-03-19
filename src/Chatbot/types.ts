
export enum Language {
  EN = 'English',
  SI = 'Sinhala',
  TA = 'Tamil',
}

export type Role = 'user' | 'bot';
export type DoctorAction = 'view_profile' | 'leave_review';

export interface Doctor {
  doctor_id: string;
  full_name: string;
  slmc_number: string;
  specialty: string;
  gender: string;
  department_type: string;
  working_hospital: string;
  contact_email: string;
  years_of_experience: string;
  image_url: string;
  associated_hospitals: string; // This is a JSON string in the CSV
  bio: string;
  languages: string;
  second_opinion_available: string;
  second_opinion_dates?: string;
  educational_qualifications: string;
  reason: string; // Added by the AI to explain why this doctor was chosen
  translated_name?: string; // Added by the AI for the doctor's name in the user's language
}

export interface Message {
  id: string;
  role: Role;
  text: string;
  doctor?: Doctor;
  doctorAction?: DoctorAction;
}
