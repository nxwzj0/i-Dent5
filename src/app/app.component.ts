import { Component } from '@angular/core';

import { URLSearchParams } from '@angular/http';

import { Observable } from 'rxjs/Observable';

import { JsonpService } from './jsonp.service';

import { environment } from '../environments/environment';

import { LoginService } from './login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [LoginService]
})
export class AppComponent {
  title = 'app';
  user;
  public userLoggedInObs: Observable<any>;

  constructor(private jsonpService: JsonpService, private loginService: LoginService) {
    // 共通認証
    this.ninsyo();
  }

  /**
 *  共通認証　ユーザ情報取得処理（失敗したら、ログイン失敗）
 *   return: ユーザ情報
 */
  ninsyo() {
    if (environment.location === 'server') {
      this.jsonpService.requestGet('IncidentGetSession.php', new URLSearchParams())
        .subscribe(
        data => {
          // 通信成功時
          if (data && data[0] && data[0].result !== '' && data[0].result == true) {
            // 認証成功
            this.loginService.logIn(data.slice(1));
          } else {
            // 認証に失敗
            console.log('共通認証に失敗しました。');
            // 認証画面に遷移する
            this.loginService.goLogIn();
          }
        },
        error => {
          // 通信失敗もしくは、コールバック関数内でエラー
          console.log(error);
          // 認証に失敗
          console.log('共通認証に失敗しました。');
          // 認証画面に遷移する
          this.loginService.goLogIn();
        }
        );
    } else if (environment.location === 'local') {
      // ローカルの場合は、仮ユーザ
      var userAry: Array<any> = [
        {
          'loginUserId': 'ADF',
        }];
      this.loginService.logIn(userAry);
    } else {
      // 認証に失敗
      console.log('共通認証に失敗しました。');
      // 認証画面に遷移する
      this.loginService.goLogIn();
    }
  }

}
