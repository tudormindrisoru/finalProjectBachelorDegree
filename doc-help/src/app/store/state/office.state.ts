import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Office } from '../../shared/models/models';
import { UpdateOfficeInfo, RemoveOfficeInfo } from '../actions/office.actions';


@State<Office>({
    name: 'office',
    defaults: null
})
@Injectable()
export class OfficeState {

    @Selector()
    static getOffice(state: Office) {
        return state;
    }

    @Action(UpdateOfficeInfo)
    // tslint:disable-next-line: typedef
    updateOffice({getState, patchState}: StateContext<Office>, { payload }: UpdateOfficeInfo) {
        const state = getState();
        if (!state) {
            patchState({ ...payload });
        }
    }

    @Action(RemoveOfficeInfo)
    // tslint:disable-next-line: typedef
    removeOffice({ patchState }: StateContext<Office>) {
        patchState(null);
    }
}
