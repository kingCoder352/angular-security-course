import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from './auth.service';
import {first, map, tap} from 'rxjs/operators';
import * as _ from 'lodash';

export class AuthorizationGuard implements CanActivate {

  constructor(
    private allowedRoles: string[],
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.user$
      .pipe(
        map(user => _.intersection(this.allowedRoles, user.roles).length > 0),
        first(),
        tap(allowed => {
          if (!allowed) {
            this.router.navigateByUrl('/');
          }
        })
      );

  }

}
