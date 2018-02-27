import { Component, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { URLSearchParams } from '@angular/http';

import { JsonpService } from '../jsonp.service';
import { LoginService } from '../login.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'my-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  // ヘッダーイベント(親コンポーネントのメソッド呼び出し)
  @Output() headerSearch: EventEmitter<any> = new EventEmitter();
  @Output() headerEdit: EventEmitter<any> = new EventEmitter();

  userId;
  userNm;
  userSectionCd;
  userSectionNm;
  subscription: Subscription;
  constructor(private route: ActivatedRoute, private jsonpService: JsonpService, private router: Router, private loginService: LoginService) {
    /* ログイン情報の取得 */
    this.subscription = loginService.loginUserNm$.subscribe(user => { this.userNm = user; });
    this.subscription = loginService.loginUserId$.subscribe(user => { this.userId = user; });
    this.subscription = loginService.loginUserSectionCd$.subscribe(user => { this.userSectionCd = user; });
    this.subscription = loginService.loginUserSectionNm$.subscribe(user => { this.userSectionNm = user; });
  }

  ngOnInit() {
    this.route.data.subscribe(obj => this.category = obj['category']);
    this.logOutUrl = this.loginService.getLogOutUrl();

    this.jsonpService.requestGet('IncidentGetSession.php', new URLSearchParams())
      .subscribe(
      data => {
        // 通信成功時
        if (data && data[0] && data[0].result !== '' && data[0].result == true) {
          // ユーザIDを確実に取得してから初期表示を実施する
          this.userId = data.slice(1)[0]['loginUserId'];
          this.searchConditionName();
        }
      },
      error => {
        // 通信失敗もしくは、コールバック関数内でエラー
        console.log(error);
      }
      );
  }

  category;
  condList = [];
  logOutUrl;

  // 検索条件名の検索
  searchConditionName() {

    // パラメータの作成
    let ps = new URLSearchParams();
    // ログイン情報設定
    ps.set('userId', this.userId);
    ps.set('userName', this.userNm);
    ps.set('sectionCd', this.userSectionCd);
    ps.set('sectionName', this.userSectionNm);

    // 検索項目の検索
    this.jsonpService.requestGet('IncidentListConditionGet.php', ps)
      .subscribe(
      data => {
        // 通信成功時
        if (data[0]) {
          let list = data[0];
          if (list.result !== '' && list.result == true) {
            // 画面表示パラメータのセット処理
            this.setDspParam(data.slice(1)); // 配列1つ目は、サーバ処理成功フラグなので除外
          }
        }
      },
      error => {
        // 通信失敗もしくは、コールバック関数内でエラー
        console.log(error);
        console.log('サーバとのアクセスに失敗しました。');
        return false;
      }
      );
  }

  // 画面表示パラメータのセット処理
  setDspParam(data) {
    this.condList = data;
  }

  // リロード(検索)
  reload() {
    if (this.category == 'list') {
      // // 検索画面の場合 listComponentの処理を実行
      this.headerSearch.emit({});
    }
    if (this.category == 'edit') {
      // // 検索画面の場合 listComponentの処理を実行
      this.headerEdit.emit({});
    }
  }

  // リロード(条件検索)
  reloadCondId(condId) {
    if (this.category == 'list/c') {
      // // 検索画面の場合 listComponentの処理を実行
      this.headerSearch.emit({ 'condId': condId });
    }
  }

  // ヘッダーのキーワードを入力してエンターを押した
  onKeyWordEnter(value: string) {
    // URLに表示できる値に変換 
    value = this.encodeUnicode(value);
    if (this.category == 'list/k') {
      // 検索画面の場合 listComponentの処理を実行
      this.headerSearch.emit({ 'keyword': value });
    } else {
      this.router.navigate(['/list/k/' + value]);
    }
  }

  // コードは16位に変換する
  encodeUnicode(str) {
    var res = [];
    for (var i = 0; i < str.length; i++) {
      res[i] = ("00" + str.charCodeAt(i).toString(16)).slice(-4);
    }
    return res.join("\\u");
  }
}