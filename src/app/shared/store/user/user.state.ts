import {Action, State, StateContext} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {DEFAULT_USER_STATE_MODEL, UserStateModel} from './user.model';
import {
  DeleteAccount,
  SetLoading,
  SignIn,
  SignOut,
  UpdateUser,
} from './user.actions';
import {UserService} from '../../services/auth/user.service';

@State<UserStateModel>({
  name: 'auth',
  defaults: DEFAULT_USER_STATE_MODEL,
})
@Injectable({
  providedIn: 'root',
})
export class UserState {
  constructor(private readonly authService: UserService) {}

  @Action(SignIn)
  async signIn(
    ctx: StateContext<UserStateModel>,
    {authProvider}: SignIn
  ): Promise<void> {
    await this.authService.logIn(authProvider);
  }

  @Action(SignOut)
  async signOut(ctx: StateContext<UserStateModel>): Promise<void> {
    await this.authService.signOut();
  }

  @Action(UpdateUser)
  async updateUser(
    ctx: StateContext<UserStateModel>,
    {user}: UpdateUser
  ): Promise<void> {
    if (user && !user.photoURL) {
      user.photoURL = 'assets/images/generic-avatar.png';
    }

    ctx.patchState({
      user,
    });
  }

  @Action(DeleteAccount)
  async deleteAccount(ctx: StateContext<UserStateModel>): Promise<void> {
    await this.authService.deleteAccount(ctx.getState().user!);
  }

  @Action(SetLoading)
  async setLoading(
    ctx: StateContext<UserStateModel>,
    {loading}: SetLoading
  ): Promise<void> {
    ctx.patchState({
      loading,
    });
  }
}
