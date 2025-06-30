

export interface IProfilePic {
  url: string;
  fileId: string;
}

export interface IEducation {
  _id?: string; 
  degree: string;
  institution: string;
  fieldOfStudy: string;
  startDate: string; 
  endDate?: string;  
  description?: string;
}

export interface IExperience {
  _id?: string; 
  title: string;
  company: string;
  location: string;
  startDate: string; 
  endDate?: string;  
  description?: string;
  current: boolean; // True if this is the current role
}

export interface IUserProfile {
  _id: string; // User ID
  name: string; 
  
  email: string;
  specialty: string;
  institution: string; 
  location: string;
  accountType: string;
  profilePic?: IProfilePic;
  headline?: string;
  bio?: string;
  education: IEducation[];
  experience: IExperience[];
  createdAt?: string;
  updatedAt?: string;
}