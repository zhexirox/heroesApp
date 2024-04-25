import { ActivatedRouteSnapshot, CanActivateFn, CanMatchFn, Route, Router, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

/*
No hay necesidad de crear una clase,
simplemente definiendo una función flecha y exportándola
podemos utilizar sus funcionalidades de guard en el app-routing
*/


const checkAuthStatus = (): Observable<boolean>  =>{

  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  return authService.checkAuthentication()
    .pipe(
      tap( isAuthenticated => console.log('Authenticated:', isAuthenticated ) ),
      tap( isAuthenticated => {
        if ( !isAuthenticated ) {
          router.navigate(['./auth/login'])
        }
      }),

    )

}


export const canMatchGuard: CanMatchFn = ( route: Route, segments: UrlSegment[] ) => {
  // console.log('CanMatch');
  // console.log({ route, segments });

  return checkAuthStatus();
};

export const canActivateGuard: CanActivateFn = ( route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  // console.log('CanActivate');
  // console.log({ route, state });
  return checkAuthStatus();
};

