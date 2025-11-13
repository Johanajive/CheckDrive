
export interface Appointment {
  id_appointment: number;
  id_user: number; // Foreign Key
  id_vehicle: number; // Foreign Key
  id_center: number; // Foreign Key
  date: Date; // Date type for use in code, even if DB uses DATE
  time: string; // String type for working with SQL TIME
  status: 'Active' | 'Rescheduled' | 'Cancelled';

  
}