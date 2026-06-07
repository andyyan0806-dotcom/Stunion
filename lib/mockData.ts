import { Tutor } from '../types';

export interface SubjectGroup {
  label: string;
  subjects: string[];
}

export interface SubjectCategory {
  category: string;
  groups: SubjectGroup[];
}

export const subjectCategories: SubjectCategory[] = [
  {
    category: 'IB',
    groups: [
      {
        label: 'Language & Literature',
        subjects: [
          'English Language & Literature HL',
          'English Language & Literature SL',
          'English Literature HL',
          'English Literature SL',
          'Korean Language & Literature HL',
          'Korean Language & Literature SL',
          'Korean Literature HL',
          'Korean Literature SL',
        ],
      },
      {
        label: 'Language Acquisition',
        subjects: ['Spanish HL', 'Spanish SL', 'Mandarin HL', 'Mandarin SL'],
      },
      {
        label: 'Mathematics',
        subjects: ['Math AI HL', 'Math AI SL', 'Math AA HL', 'Math AA SL'],
      },
      {
        label: 'Sciences',
        subjects: [
          'Biology HL', 'Biology SL',
          'Chemistry HL', 'Chemistry SL',
          'Physics HL', 'Physics SL',
          'Environmental Systems & Societies HL',
          'Environmental Systems & Societies SL',
        ],
      },
      {
        label: 'Individuals & Societies',
        subjects: [
          'Business Management HL', 'Business Management SL',
          'Economics HL', 'Economics SL',
          'Global Politics HL', 'Global Politics SL',
          'Psychology HL', 'Psychology SL',
          'Geography HL', 'Geography SL',
          'History HL', 'History SL',
        ],
      },
      {
        label: 'Arts',
        subjects: [
          'Visual Art HL', 'Visual Art SL',
          'Film HL', 'Film SL',
          'Media Art HL', 'Media Art SL',
        ],
      },
      {
        label: 'Core',
        subjects: ['Theory of Knowledge', 'Extended Essay'],
      },
    ],
  },
  {
    category: 'MYP',
    groups: [
      {
        label: 'MYP Subjects',
        subjects: [
          'Language Acquisition',
          'Language and Literature',
          'Individuals and Societies',
          'Sciences',
          'Mathematics',
          'Physical and Health Education',
          'Design',
        ],
      },
      {
        label: 'Arts',
        subjects: [
          'Visual Art',
          'Theatre',
          'Media Art',
          'Band',
          'Vocal Music',
          'General Music',
        ],
      },
    ],
  },
  {
    category: 'AP',
    groups: [
      {
        label: 'Arts',
        subjects: [
          'AP 2-D Art and Design',
          'AP 3-D Art and Design',
          'AP Drawing',
          'AP Art History',
          'AP Music Theory',
        ],
      },
      {
        label: 'English',
        subjects: [
          'AP English Language and Composition',
          'AP English Literature and Composition',
        ],
      },
      {
        label: 'History & Social Sciences',
        subjects: [
          'AP African American Studies',
          'AP Comparative Government and Politics',
          'AP European History',
          'AP Human Geography',
          'AP Macroeconomics',
          'AP Microeconomics',
          'AP Psychology',
          'AP United States Government and Politics',
          'AP United States History',
          'AP World History: Modern',
        ],
      },
      {
        label: 'Math & Computer Science',
        subjects: [
          'AP Calculus AB',
          'AP Calculus BC',
          'AP Computer Science A',
          'AP Computer Science Principles',
          'AP Precalculus',
          'AP Statistics',
        ],
      },
      {
        label: 'Sciences',
        subjects: [
          'AP Biology',
          'AP Chemistry',
          'AP Environmental Science',
          'AP Physics 1: Algebra-Based',
          'AP Physics 2: Algebra-Based',
          'AP Physics C: Electricity and Magnetism',
          'AP Physics C: Mechanics',
        ],
      },
      {
        label: 'World Languages & Cultures',
        subjects: [
          'AP Chinese Language and Culture',
          'AP French Language and Culture',
          'AP German Language and Culture',
          'AP Italian Language and Culture',
          'AP Japanese Language and Culture',
          'AP Latin',
          'AP Spanish Language and Culture',
          'AP Spanish Literature and Culture',
        ],
      },
      {
        label: 'Capstone',
        subjects: ['AP Research', 'AP Seminar'],
      },
      {
        label: 'Career Kickstart',
        subjects: ['AP Business with Personal Finance', 'AP Cybersecurity'],
      },
    ],
  },
  {
    category: 'College Counseling',
    groups: [
      {
        label: 'College Counseling',
        subjects: ['College Application'],
      },
    ],
  },
  {
    category: 'Other',
    groups: [
      {
        label: 'Other',
        subjects: ['Other'],
      },
    ],
  },
];

// Flat list for DB storage and backward compatibility
export const subjects = subjectCategories.flatMap(c => c.groups.flatMap(g => g.subjects));

export const tutors: Tutor[] = [
  {
    id: 'tutor-mina',
    name: 'Mina K.',
    bio: 'Experienced IB Math tutor with a strong record of 7/7 student outcomes and clear structured explanations.',
    education: 'Yonsei University, Applied Mathematics',
    scores: 'IB 45, SAT 1570',
    subjects: ['Math AA HL', 'Math AI HL', 'Physics HL'],
    rate: 95000,
    rating: 4.9,
    review_count: 18,
    language: 'both',
    verified: true,
    status: 'active',
    intro_call_enabled: true,
    vouch_count: 0,
  },
  {
    id: 'tutor-jun',
    name: 'Jun S.',
    bio: 'SAT and AP specialist who helps international school students improve exam strategy and essay structure.',
    education: 'KAIST, Computer Science',
    scores: 'SAT 1560, AP Calculus BC 5',
    subjects: ['AP Calculus BC', 'AP Computer Science A', 'AP Statistics'],
    rate: 110000,
    rating: 4.8,
    review_count: 12,
    language: 'english',
    verified: true,
    status: 'active',
    intro_call_enabled: false,
    vouch_count: 0,
  },
  {
    id: 'tutor-hana',
    name: 'Hana L.',
    bio: 'Korean returnee with deep IB and college counseling experience, focused on 1:1 targeted learning plans.',
    education: 'University of Michigan, Economics',
    scores: 'IB 44, SAT 1540',
    subjects: ['Economics HL', 'Business Management HL', 'College Application'],
    rate: 120000,
    rating: 4.7,
    review_count: 9,
    language: 'both',
    verified: true,
    status: 'active',
    intro_call_enabled: true,
    vouch_count: 0,
  },
  {
    id: 'tutor-soo',
    name: 'Soo B.',
    bio: 'High-performing tutor with verified IB scores and clear conceptual explanations for science subjects.',
    education: 'Chadwick International, IB Senior',
    scores: 'IB 43',
    subjects: ['Biology HL', 'Chemistry HL', 'Biology SL'],
    rate: 80000,
    rating: 4.6,
    review_count: 6,
    language: 'korean',
    verified: true,
    status: 'active',
    intro_call_enabled: false,
    vouch_count: 0,
  },
];
