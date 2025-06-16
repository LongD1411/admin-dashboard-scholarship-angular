export class SchoolDTO {
  name: string;
  description: string;
  logo: string;
  provider: string;
  countryCode: string;
  rankValue: number;
  students: number;
  fieldOfStudy: number;
  url: string;
  type: string;
  topReason:string
  constructor(data: any) {
    this.name = data.name;
    this.description = data.description;
    this.logo = data.logo;
    this.countryCode = data.countryCode;
    this.provider = data.provider;
    this.rankValue = data.rankValue;
    this.students = data.students
    this.fieldOfStudy = data.fieldOfStudy
    this.url = data.url,
    this.type = data.type
    this.topReason = data.topReason
  }
}
