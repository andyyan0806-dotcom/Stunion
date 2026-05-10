export type LanguageOption = 'korean' | 'english' | 'both';

export interface Tutor {
  id: string;
  name: string;
  bio: string;
  education: string;
  scores: string;
  subjects: string[];
  rate: number;
  rating: number;
  language: LanguageOption;
}
