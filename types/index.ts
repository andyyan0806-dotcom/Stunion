export type LanguageOption = 'korean' | 'english' | 'both';

export type TutorStatus =
  | 'pending'
  | 'under_review'
  | 'verified'
  | 'active'
  | 'suspended'
  | 'rejected';

export interface Tutor {
  id: string;
  name: string;
  bio: string;
  education: string;
  scores: string;
  subjects: string[];
  rate: number;
  rating: number;
  review_count: number;
  language: LanguageOption;
  verified: boolean;
  status: TutorStatus;
  intro_call_enabled: boolean;
  photo_url?: string;
  transcript_url?: string;
  score_url?: string;
}

export interface Booking {
  id: string;
  tutor_id: string;
  parent_email: string;
  parent_phone: string;
  student_name?: string;
  booking_date: string;
  duration_minutes: number;
  location_preference: 'online' | 'offline' | 'hybrid';
  subject_focus?: string;
  amount: number;
  fee: number;
  withholding: number;
  payout_amount: number;
  promo_code_used?: string;
  status: 'pending' | 'accepted' | 'completed' | 'refunded' | 'cancelled';
  created_at: string;
}

export interface Review {
  id: string;
  booking_id: string;
  tutor_id: string;
  parent_email?: string;
  rating: number;
  comment?: string;
  response?: string;
  created_at: string;
}

export interface IntroCall {
  id: string;
  parent_email: string;
  parent_phone: string;
  tutor_id: string;
  preferred_times?: string;
  subject_focus?: string;
  discussion_notes?: string;
  zoom_link?: string;
  status: 'pending' | 'accepted' | 'completed' | 'cancelled';
  requested_at: string;
  scheduled_at?: string;
  completed_at?: string;
  converted_to_booking_id?: string;
}
