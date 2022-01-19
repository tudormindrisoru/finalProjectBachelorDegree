import { Appointment } from 'src/app/shared/models/models';

export class UpdateAppointments {
    static readonly type = '[DOC-HELP] Update appointment list';

    constructor(public payload: Appointment[]) {

    }
}

export class AddAppointment {
    static readonly type = '[DOC-HELP] Add appointment to appointment list';

    constructor(public payload: Appointment) {}
}