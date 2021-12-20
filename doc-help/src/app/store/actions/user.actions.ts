import { User } from '../../shared/models/models';

export class SignInUser {
    static readonly type = '[DOC-HELP] Sign in user';

    constructor(public payload: User) {}
}

export class SignOutUser {
    static readonly type = '[DOC-HELP] Sign out user';

    constructor() {}
}