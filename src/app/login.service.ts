import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Rx';

import { environment } from '../environments/environment';

@Injectable()
export class LoginService {

  constructor() { }

  private loginUserSource = new ReplaySubject<any>();
  loginUser$ = this.loginUserSource.asObservable();

  // ログイン
  public logIn(user: any) {
    this.loginUserSource.next(user);
  }

  // 認証画面に移行
  public goLogIn() {
    window.location.href = environment.envPath;
    window.location.reload();
  }

}