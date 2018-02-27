import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Rx';

import { URLSearchParams } from '@angular/http';
import { JsonpService } from './jsonp.service';

import { environment } from '../environments/environment';

@Injectable()
export class LoginService {

  constructor(private jsonpService: JsonpService) { }

  private loginUserIdSource = new ReplaySubject<any>();
  loginUserId$ = this.loginUserIdSource.asObservable();
  private loginUserNmSource = new ReplaySubject<any>();
  loginUserNm$ = this.loginUserNmSource.asObservable();
  private loginUserSectionCdSource = new ReplaySubject<any>();
  loginUserSectionCd$ = this.loginUserSectionCdSource.asObservable();
  private loginUserSectionNmSource = new ReplaySubject<any>();
  loginUserSectionNm$ = this.loginUserSectionNmSource.asObservable();

  // ログイン
  public logIn(user: any) {
    if (user && user[0]['loginUserId']) {
      this.loginUserIdSource.next(user[0]['loginUserId']); // ログインユーザIDを格納
      // ログインユーザ情報を取得
      var ps = new URLSearchParams();
      ps.set('userId', user[0]['loginUserId']);
      this.jsonpService.commonRequestGet('UserDataGet.php', ps)
        .subscribe(
        data => {
          // 通信成功時
          if (data && data[0] && data[0].result !== '' && data[0].result == true) {
            // 認証成功
            var userData = data.slice(1)[0];
            this.loginUserNmSource.next(userData['userNm']); // ログインユーザ名を格納
            this.loginUserSectionCdSource.next(userData['sectionCd']); // ログインユーザ部署CDを格納
            this.loginUserSectionNmSource.next(userData['sectionNm']); // ログインユーザ部署名を格納
          } else {
            // 認証に失敗
            console.log('ユーザ情報の取得に失敗しました。');
            // 認証画面に遷移する
            this.goLogIn();
          }
        },
        error => {
          // 通信失敗もしくは、コールバック関数内でエラー
          console.log(error);
          // 認証に失敗
          console.log('ユーザ情報の取得に失敗しました。');
          // 認証画面に遷移する
          this.goLogIn();
        }
        );
    } else {
      // 認証に失敗
      console.log('ユーザ情報の取得に失敗しました。');
      // 認証画面に移行
      this.goLogIn();
    }
  }

  // 認証画面に移行
  public goLogIn() {
    window.location.replace(environment.envPath);
  }

  // ログアウト
  public getLogOutUrl() {
    return environment.envPath + "kyoninsyo/kyo_logout.php";
  }

}