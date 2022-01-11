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
  longitude?:  number;
  latitude?: number;
  administratorId?: number;
  doctors?: Doctor[];
}

export interface Response<T> {
  success?: boolean;
  status?: number;
  message?: T;
}

