import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { User } from '../../shared/models/models';
import { UpdateUser, SignOutUser } from '../actions/user.actions';


@State<User>({
    name: 'user',
    defaults: null
})
@Injectable()
export class UserState {

    @Selector()
    static getUser(state: User) {
        return state;
    }

    @Action(UpdateUser)
    updateUser({ patchState }: StateContext<User>, { payload }: UpdateUser) {
      patchState(payload);
    }

    @Action(SignOutUser)
    signOut({ patchState }: StateContext<User>) {
        patchState(null);
    }
}
