import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { User } from '../../shared/models/models';
import { SignInUser, SignOutUser } from '../actions/user.actions';


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

    @Action(SignInUser)
    signIn({getState, patchState}: StateContext<User>, { payload }: SignInUser) {
        const state = getState();
        if (!state) {
            patchState({ ...payload });
        }
    }

    @Action(SignOutUser)
    signOut({ patchState }: StateContext<User>) {
        patchState(null);
    }
}
