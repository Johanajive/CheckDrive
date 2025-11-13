
export interface Appointment {
  id_appointment: number;
  id_user: number; 
  id_vehicle: number; 
  id_center: number; 
  date: Date; 
  time: string; 
  status: 'Active' | 'Rescheduled' | 'Cancelled';

  
}