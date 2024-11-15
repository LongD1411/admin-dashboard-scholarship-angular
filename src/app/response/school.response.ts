import { ScholashipResponse } from './scholarship.response';

export interface SchoolResponse {
  id: number;
  logo: string;
  name: string;
  provider: string;
  description: string;
  rankValue: number;
  countryName: string;
  countryCode: string;
  scholarships: ScholashipResponse[];
}
