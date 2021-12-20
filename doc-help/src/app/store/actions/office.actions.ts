import { Office } from '../../shared/models/models';

export class UpdateOfficeInfo {
    static readonly type = '[DOC-HELP] Get doctor informations';

    constructor(public payload: Office) {}
}

export class RemoveOfficeInfo {
    static readonly type = '[DOC-HELP] Remove doctor informations';

    constructor() {}
}

