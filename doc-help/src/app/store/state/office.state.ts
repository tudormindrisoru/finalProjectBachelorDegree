import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Office } from '../../shared/models/models';
import { UpdateOfficeInfo, RemoveOfficeInfo } from '../actions/office.actions';

@State<Office | null>({
  name: 'office',
  defaults: null,
})
@Injectable()
export class OfficeState {
  @Selector()
  static getOffice(state: Office) {
    return state;
  }

  @Action(UpdateOfficeInfo)
  // tslint:disable-next-line: typedef
  updateOffice(
    { patchState }: StateContext<Office>,
    { payload }: UpdateOfficeInfo
  ) {
    patchState(payload);
  }

  @Action(RemoveOfficeInfo)
  // tslint:disable-next-line: typedef
  removeOffice(ctx: StateContext<Office | null>) {
    ctx.setState(null);
  }
}
