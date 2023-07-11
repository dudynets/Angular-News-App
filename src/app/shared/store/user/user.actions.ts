import {AuthProvider, UserProfile} from './user.model';

export class SignIn {
  static readonly type = '[User] Sign In';
  constructor(public authProvider: AuthProvider) {}
}

export class SignOut {
  static readonly type = '[User] Sign Out';
  constructor() {}
}

export class UpdateUser {
  static readonly type = '[User] Update User';
  constructor(public user: UserProfile | null) {}
}

export class DeleteAccount {
  static readonly type = '[User] Delete Account';
  constructor() {}
}

export class SetLoading {
  static readonly type = '[User] Set Loading';
  constructor(public loading: boolean) {}
}
