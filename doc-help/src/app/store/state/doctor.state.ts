import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Doctor } from '../../shared/models/models';
import { UpdateDoctorInfo, RemoveDoctorInfo } from '../../store/actions/doctor.actions';

@State<Doctor>({
    name: 'doctor',
    defaults: null
})
@Injectable()
export class DoctorState {

    @Selector()
    // tslint:disable-next-line: typedef
    static getDoctor(state: Doctor) {
        return state;
    }

    @Action(UpdateDoctorInfo)
    // tslint:disable-next-line: typedef
    updateDoctorInfo({getState, patchState}: StateContext<Doctor>, { payload }: UpdateDoctorInfo) {
        const state = getState();
        patchState(payload);
    }

    @Action(RemoveDoctorInfo)
    // tslint:disable-next-line: typedef
    removeDoctorInfo({patchState}: StateContext<Doctor>) {
        patchState(null);
    }
}