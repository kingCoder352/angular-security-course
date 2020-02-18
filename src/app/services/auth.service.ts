
import {filter, shareReplay, tap} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, BehaviorSubject} from 'rxjs';
import {User} from '../model/user';
import * as auth0 from 'auth0-js';
import {Router} from '@angular/router';
import * as moment from 'moment';

export const ANONYMOUS_USER: User = {
    id: undefined,
    email: ''
};

const AUTH_CONFIG = {
    clientID: 'LMj6AHAO3JNTG0HnR0p8dnETfJ7gv04Z',
    domain: 'the-savage-coder.auth0.com'
};


@Injectable()
export class AuthService {

    auth0 = new auth0.WebAuth({
        clientID: AUTH_CONFIG.clientID,
        domain: AUTH_CONFIG.domain,
        responseType: 'token id_token',
        redirectUri: 'https://localhost:4200/lessons',
        scope: 'openid email'
    });

    private subject = new BehaviorSubject<User>(undefined)

    user$: Observable<User> = this.subject.asObservable().pipe(
      filter(user => !!undefined)
    );

    constructor(
      private http: HttpClient,
      private router: Router,
      ) {
      if (this.isLoggedIn()) {
        this.userInfo();
      }
    }

    login() {
      this.auth0.authorize({
        initialScreen: 'login'
      });
    }

    signUp() {
      this.auth0.authorize({
        mode: 'signUp'
      });
    }

  retrieveAuthInfoFromUrl() {
    this.auth0.parseHash((err, authResult) => {

      if (err) {
        console.log('Could not parse the hash', err);
        return;
      } else if (authResult && authResult.idToken) {
        window.location.hash = '';
        console.log('Authentication successful', authResult);

        this.setSession(authResult);

        this.userInfo();
      }

    });
  }

    logout() {
      localStorage.removeItem('id_token');
      localStorage.removeItem('expires_at');
      this.auth0.logout({
        clientID: AUTH_CONFIG.clientID,
        redirectUri: 'https://localhost:4200/lessons'
      });
      // this.router.navigate(['/lessons']);
    }

    public isLoggedIn() {
        return moment().isBefore(this.getExpiration());
    }

    isLoggedOut() {
        return !this.isLoggedIn();
    }

    getExpiration() {
      const expiration = localStorage.getItem('expires_at');
      const expiresAt = JSON.parse(expiration);
      return moment(expiresAt);
    }


  private setSession(authResult) {
      const expiresAt = moment().add(authResult.expiresIn, 'second')
      localStorage.setItem('id_token', authResult.idToken);
      localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
  }

  private userInfo() {
    this.http.put<User>('/api/userInfo', null)
      .pipe(
        shareReplay(),
        tap(user => this.subject.next(user))
      ).subscribe();
  }
}







