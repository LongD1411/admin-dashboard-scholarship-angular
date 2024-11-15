export class ScholarshipDTO {
  name: string;
  description: string;
  grantAmount: string;
  quantity: number;
  eligibility: string;
  gpa: string;
  schoolId: number;
  fieldOfStudyId: number;
  startDate: Date;
  endDate: Date;

  constructor(data: any) {
    this.name = data.name;
    this.description = data.description;
    this.grantAmount = data.grantAmount;
    this.quantity = data.quantity;
    this.eligibility = data.eligibility;
    this.schoolId = data.schoolId;
    this.fieldOfStudyId = data.fieldOfStudyId;
    this.startDate = data.startDate;
    this.endDate = data.endDate;
    this.gpa = data.gpa;
  }
}
