import {Component} from '@angular/core';
import {Select} from '@ngxs/store';
import {UserProfile} from '../../../../shared/store/user/user.model';
import {UserSelectors} from '../../../../shared/store/user/user.selectors';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {
  @Select(UserSelectors.getUser) user$!: Observable<UserProfile | null>;
}
