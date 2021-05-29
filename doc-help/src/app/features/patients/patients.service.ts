import { Injectable } from '@angular/core';


export interface Patient {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  reports?: number;
}

export interface AppointmentHistory {
  id: string;
  patient: Patient;
  date: Date;
  startHour: string;
  endHour: string;
  reported?: boolean;
  comment?: string;
}


@Injectable()
export class PatientsService {

  _appointmentsHistory: AppointmentHistory[] = [
    {id: "312512412saas", patient: { firstName: "Nume1", lastName: "Prenume1", phoneNumber: "0742123123", reports: 1},date: new Date('2021-05-21'), startHour: "10:30", endHour:"11:00", reported: true},
    {id: "zcxdas1231das", patient: { firstName: "Nume2", lastName: "Prenume2", phoneNumber: "0742321321", reports: 0},date: new Date('2021-05-21'), startHour: "11:30", endHour: "12:00", reported: false,},
    {id: "3123asdas1231", patient: { firstName: "Nume3", lastName: "Prenume3", phoneNumber: "0740992992", reports: 3},date: new Date('2021-05-22'), startHour: "08:30", endHour: "12:00", reported: true},
    {id: "dasdq1e212dsa", patient: { firstName: "Nume4", lastName: "Prenume4", phoneNumber: "0740993162", reports: 2},date: new Date('2021-05-22'), startHour: "13:30" ,endHour: "14:00", reported: false},
  ];
  
  constructor() { 
    
  }
  get appointmentsHistory(): AppointmentHistory[] {
    return this._appointmentsHistory || undefined;
  }
  set appointmentsHistory(appointments: AppointmentHistory[]) {
    this._appointmentsHistory = appointments;
  }

}
