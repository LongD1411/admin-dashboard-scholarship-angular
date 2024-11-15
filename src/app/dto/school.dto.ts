export class SchoolDTO {
  name: string;
  description: string;
  logo: string;
  provider: string;
  countryCode: string;
  rankValue: number;
  constructor(data: any) {
    this.name = data.name;
    this.description = data.description;
    this.logo = data.logo;
    this.countryCode = data.countryCode;
    this.provider = data.provider;
    this.rankValue = data.rankValue;
  }
}
