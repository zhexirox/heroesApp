import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { User } from '../interfaces/user';
import { Observable, catchError, map, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = environment.baseUrl;
  private user?: User;

  constructor(private http: HttpClient) { }

  get currentUser(): User | undefined {
    if( !this.user ) return undefined
    //return {...this.user};
    return structuredClone(this.user);
  }

  login( email: string, password: string) :Observable<User> {

    // http.post('login', {email, password})
    return this.http.get<User>(this.baseUrl+'/users/2')
      .pipe(
        tap( user => this.user = user),
        tap( user => localStorage.setItem('token', '5Zizp2LIFypGBGlKVMeg9mtRzXLyrLuT' )),
      );
  }

  checkAuthentication(): Observable<boolean> {

    if( !localStorage.getItem('token') ) return of(false);

    const token = localStorage.getItem('token');
    return this.http.get<User>(this.baseUrl+'/users/2')
      .pipe(
        tap(user => this.user = user),
        map(user => !!user ),
        catchError( err => of(false) )
      );


  }

  logout() :void {
    this.user = undefined
    localStorage.clear();
  }

}


