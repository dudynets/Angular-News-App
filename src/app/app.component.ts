import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from './shared/services/auth/user.service';
import {Select} from '@ngxs/store';
import {fromEvent, map, merge, Observable, of, Subject, takeUntil} from 'rxjs';
import {UserSelectors} from './shared/store/user/user.selectors';
import {SplashScreen} from '@capacitor/splash-screen';
import {newspaper} from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  @Select(UserSelectors.getLoading) loading$!: Observable<boolean>;

  networkStatus: boolean = false;

  destroyed$ = new Subject<void>();

  constructor(private readonly authService: UserService) {}

  ngOnInit(): void {
    this.loading$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(async (loading) => {
        if (!loading) {
          await SplashScreen.hide();
        }
      });

    this.checkNetworkStatus();
  }

  checkNetworkStatus(): void {
    this.networkStatus = navigator.onLine;
    merge(of(null), fromEvent(window, 'online'), fromEvent(window, 'offline'))
      .pipe(
        map(() => navigator.onLine),
        takeUntil(this.destroyed$)
      )
      .subscribe(async (status) => {
        this.networkStatus = status;

        if (!status) {
          await SplashScreen.hide();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  protected readonly newspaper = newspaper;
}
