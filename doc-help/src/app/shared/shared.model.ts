export interface IOffice {
    name?: string,
    lng?: number,
    lat?: number,
    address?: string,
    you?: IDoctor,
    doctors?: IDoctor[],

}

export interface IDoctor {
    name?: string,
    photo?: string | ArrayBuffer,
    specialty?: string,
    phone?: string,
    city?: string,
    birthDate?: Date,
    cuim?: string,
    isActive?: boolean,
    isOfficeOwner?: boolean,
    affiliationId?: string,
}