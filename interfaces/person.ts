import { BackgroundBase } from "./background";
import { CandidateToPerson } from "./candidate";
import { LegislatorDetail } from "./legislator";
import { BiographyDetail, PreviousCase, WorkExperience } from "./politics";

export interface PersonBasicInfo {
  id: string;
  fullname: string;
  image_url: string | null;
  profession: string | null;
}

export interface PersonBase {
  id: string;
  name: string;
  lastname: string;
  fullname: string;
  image_url: string | null;
  profession: string | null;
  birth_date: Date | null;
  detailed_biography: BiographyDetail[] | [];
  technical_education: string | null;
  university_education: string | null;
  academic_degree: string | null;
  professional_title: string | null;
  postgraduate_education: string | null;
  resume_url: string | null;
  work_experience: WorkExperience[] | [];
  // previous_cases: PreviousCase[] | [];
  facebook_url: string | null;
  twitter_url: string | null;
  instagram_url: string | null;
  tiktok_url: string | null;
  created_at: Date;
}

export interface PersonWithActivePeriod extends PersonBase {
  active_period: LegislatorDetail;
}

export interface PersonDetail extends PersonBase {
  backgrounds: BackgroundBase[] | null;
  legislative_periods: LegislatorDetail[];
  candidacies: CandidateToPerson[];
}

export interface CreatePersonRequest {
  name: string;
  lastname: string;
  image_url?: string;
  birth_date?: string;
  profession?: string;
  technical_education?: string;
  university_education?: string;
  academic_degree?: string;
  professional_title?: string;
  postgraduate_education?: string;
  resume_url?: string;
  work_experience?: WorkExperience[];
  detailed_biography?: BiographyDetail[];
  previous_cases?: PreviousCase[];
  facebook_url?: string;
  twitter_url?: string;
  instagram_url?: string;
  tiktok_url?: string;
}

export interface UpdatePersonRequest extends Partial<CreatePersonRequest> {
  id: string;
}
