export interface User {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  docId?: number;
  doctor?: Doctor;
  photo?: string;
  isVerified?: boolean;
  createdAt?: string;
}

export interface Doctor {
  id?: number;
  cuim?: string;
  specialty?: string;
  officeId?: number;
  user?: User;
}

export interface Office {
  id?: number;
  oName?: string;
  address?: string;
  longitude?: number;
  latitude?: number;
  administratorId?: number;
  city?: string;
  doctors?: Doctor[];
}

export interface Appointment {
  id?: number;
  doctorId?: number;
  officeId?: number;
  startDate?: string | Date;
  endDate?: string | Date;
  notes?: string;
  isApproved?: boolean;
  patient?: User;
  reason?: string;
}

export interface Response<T> {
  success?: boolean;
  status?: number;
  message?: T;
}

export interface Schedule {
  id: number;
  startTime: number;
  endTime: number;
  weekDay: number;
  doctorId?: number;
}

export interface Vacation {
  id: number;
  starDate: Date;
  endDate: Date;
  doctorId?: number;
}

export enum NOTIFICATION_TYPE {
  OFFICE_INVITE = 'OFFICE_INVITE',
  APPOINTMENT_REQUEST = 'APPOINTMENT_REQUEST',
}

export interface Notification {
  type: NOTIFICATION_TYPE;
  message: {
    doctorId: number;
    entryId: number;
  };
}

export interface SearchResult {
  address: string;
  county: string;
  lat: number;
  lng: number;
}
