export interface Appointment {
  id?: number;
  idType: string;
  idNumber: string;
  names: string;
  email: string;
  cellphone: string;
  service: string;
  province: string;
  city: string;
  agency: string;
  date: string;
  time: string;
  confirmation?: string;
}