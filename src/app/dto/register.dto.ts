export class RegisterDTO {
  full_name: string;
  email: string;
  address: string;
  password: string;
  date_of_birth: Date;
  constructor(data: any) {
    this.full_name = data.full_name;
    this.address = data.address;
    this.date_of_birth = data.date_of_birth;
    this.password = data.password;
    this.email = data.emails;
  }
}
