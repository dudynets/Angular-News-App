import {Component, OnInit} from '@angular/core';
import {SignIn} from '../../../../../../shared/store/user/user.actions';
import {AuthProvider} from '../../../../../../shared/store/user/user.model';
import {Store} from '@ngxs/store';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {
  constructor(private readonly store: Store) {}

  ngOnInit() {}

  async signInWithGoogle(): Promise<void> {
    await this.store.dispatch(new SignIn(AuthProvider.GOOGLE));
  }
}
