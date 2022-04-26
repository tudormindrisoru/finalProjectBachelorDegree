import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { patch, append, removeItem, insertItem, updateItem } from '@ngxs/store/operators';
import { Appointment } from 'src/app/shared/models/models';
import { UpdateAppointments, AddAppointment, UpdateAppointment } from 'src/app/store/actions/appointment.actions';
import { UpdateUser, SignOutUser } from '../actions/user.actions';

@State<Appointment[]>({
    name: 'appointments',
    defaults: null
})

@Injectable()
export class AppointmentState {

    @Selector()
    static getAppointments(state: Appointment[]) {
        return state;
    }

    @Action(UpdateAppointments)
    updateAppointments({ patchState }: StateContext<Appointment[]>, { payload }: UpdateAppointments) {
      patchState(payload);
    }

    @Action(AddAppointment)
    addAppointment({ patchState }: StateContext<Appointment[]>, { payload }: AddAppointment) {
        patchState(null);
    }

    @Action(UpdateAppointment)
    updateAppointment({ patchState }: StateContext<Appointment[]>, { payload }: UpdateAppointment) {
        updateItem<Appointment>(a => a.id === payload.id, payload);
    }
}
