import {UserProfile, UserStateModel} from './user.model';
import {Selector} from '@ngxs/store';
import {UserState} from './user.state';

export class UserSelectors {
  @Selector([UserState])
  public static getUser(state: UserStateModel): UserProfile | null {
    return state.user;
  }

  @Selector([UserState])
  public static getLoading(state: UserStateModel): boolean {
    return state.loading;
  }
}
