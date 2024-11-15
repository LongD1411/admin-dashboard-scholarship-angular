export class CountryDTO{
    code:string;
    name:string;
    continent:string;
   constructor(data:any){
    this.name = data.name,
    this.code = data.code,
    this.continent = data.continent
   }
}