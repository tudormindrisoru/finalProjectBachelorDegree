export interface User {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  docId?: number;
  photo?: string;
  isVerified?: boolean;
  createdAt?: string;
}

export interface Doctor {
  id?: number;
  cuim?: string;
  specialty?: string;
  officeId?: number;
}

export interface Office {
  id?: number;
  name?: string;
  address?: string;
  longitude?:  number;
  latitude?: number;
  idAdministrator?: number;
}

export interface Response<T> {
  success?: boolean;
  status?: number;
  message?: T;
}

