import { Doctor } from 'src/app/shared/models/models';

export class UpdateDoctorInfo {
    static readonly type = '[DOC-HELP] Get doctor informations';

    constructor(public payload: Doctor) {}
}

export class RemoveDoctorInfo {
    static readonly type = '[DOC-HELP] Remove doctor informations';

    constructor() {}
}

