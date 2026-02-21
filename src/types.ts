export interface Education {
  id: string;
  school: string;
  degree: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  link: string;
}

export type TemplateType = 'modern' | 'classic' | 'minimal' | 'executive' | 'creative';

export interface ResumeData {
  template: TemplateType;
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    website: string;
    objective: string;
  };
  education: Education[];
  experience: Experience[];
  skills: string[];
  projects: Project[];
  certifications: string[];
}
