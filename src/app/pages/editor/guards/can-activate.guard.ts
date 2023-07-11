import {Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import {map, Observable} from 'rxjs';
import {Select, Store} from '@ngxs/store';
import {UserSelectors} from '../../../shared/store/user/user.selectors';
import {UserProfile} from '../../../shared/store/user/user.model';

@Injectable()
export class CanActivateGuard implements CanActivate {
  @Select(UserSelectors.getUser) user$!: Observable<UserProfile | null>;

  constructor(private store: Store, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const articleId = route.params['articleId'];

    return this.user$.pipe(
      map((user: UserProfile | null) => {
        if (!user || user.role !== 'writer') {
          this.router.navigate(['/']);
          return false;
        }

        if (articleId) {
          const article = user.articles?.find(
            (article) => article.id === articleId
          );
          if (!article) {
            this.router.navigate(['/']);
            return false;
          }
        }

        return true;
      })
    );
  }
}
