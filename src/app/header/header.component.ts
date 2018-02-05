import { Component, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { URLSearchParams } from '@angular/http';

import { JsonpService } from '../jsonp.service';

@Component({
  selector: 'my-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  // ヘッダーイベント(親コンポーネントのメソッド呼び出し)
  @Output() headerSearch: EventEmitter<any> = new EventEmitter();
  @Output() headerEdit: EventEmitter<any> = new EventEmitter();

  constructor(private route: ActivatedRoute, private jsonpService: JsonpService, private router: Router) { }

  ngOnInit() {
    this.route.data.subscribe(obj => this.category = obj['category']);
    this.searchConditionName();
  }

  category;
  condList = [];

  // 検索条件名の検索
  searchConditionName() {

    // パラメータの作成
    let ps = new URLSearchParams();

    // 検索項目の検索
    this.jsonpService.requestGet('IncidentListConditionDelete.php', ps)
      .subscribe(
      data => {
        // 通信成功時
        console.log(data);
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

  // ログアウト処理
  logout() {
    console.log("ログアウト処理");
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