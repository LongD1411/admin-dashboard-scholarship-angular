export interface ScholashipResponse {
  id: number;
  name: string;
  description: string;
  eligibility: string;
  benefit: string;
  type: string;
  grantAmount: string;
  gpa: string;
  degreeLevelRequired: number;
  deadline: Date;
  endDate: Date;
  startDate: Date;
  quantity: number;
  schoolName: string;
  schoolId: string;
  isActive: boolean;
  fieldOfStudyName: string;
  fieldOfStudyId: string;
  createdAt: Date;
  updatedAt: Date;
}
