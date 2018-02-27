import { Component, TemplateRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { URLSearchParams } from '@angular/http';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { JsonpService } from '../jsonp.service';
import { LoginService } from '../login.service';
import { Subscription } from 'rxjs/Subscription';

import { environment } from '../../environments/environment.local';

import { LoadingComponent } from "../loading/loading.component";

@Component({
  selector: 'setubiSearch-modal',
  templateUrl: './setubiSearch.modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class SetubiSearchModalComponent {
  @ViewChild('template') template;

  // 設備・機場・事業主体情報を転記
  @Output() setubiSelect: EventEmitter<any> = new EventEmitter();

  userId;
  userNm;
  userSectionCd;
  userSectionNm;
  subscription: Subscription;
  constructor(private modalService: BsModalService, private jsonpService: JsonpService, private loginService: LoginService) {
    /* ログイン情報の取得 */
    this.subscription = loginService.loginUserNm$.subscribe(user => { this.userNm = user; });
    this.subscription = loginService.loginUserId$.subscribe(user => { this.userId = user; });
    this.subscription = loginService.loginUserSectionCd$.subscribe(user => { this.userSectionCd = user; });
    this.subscription = loginService.loginUserSectionNm$.subscribe(user => { this.userSectionNm = user; });
  }

  modalRef: BsModalRef;
  isLoading: boolean = false;

  // 検索条件
  kijoNm = "";
  setubiNm = "";

  // ページングの設定
  maxSize: number = 5; // ページングの表示ページ数
  bigTotalItems: number = 0; // 総数
  itemsPerPage: number = 10; // 1ページに表示する件数
  currentPage: number = 0; // 現在表示しているページ
  start: number = 0; // データ表示開始位置
  end: number = 10; // データ表示終了位置

  // ページング処理
  pageChanged(event: any): void {
    if(!(this.itemsPerPage > 0)){
      this.itemsPerPage = 10;
    }
    this.start = this.itemsPerPage * (this.currentPage - 1);
    let tmpStart: number = +this.start;
    let tmpItemsPerPage: number = +this.itemsPerPage;
    this.end = tmpStart + tmpItemsPerPage;
    this.search();
  }

  // モーダル表示
  openModal() {
    this.clearSetubiSearch();
    this.bigTotalItems = 0; // 総数
    this.itemsPerPage = 10; // 1ページに表示する件数
    this.currentPage = 0;
    this.start = 0;
    this.end = 10;
    this.search();
    this.template.show();
  }

  // 検索条件の初期化
  clearSetubiSearch() {
    this.kijoNm = "";
    this.setubiNm = "";
  }

  // 検索処理
  search() {
    // 検索パラメータの作成
    let ps = new URLSearchParams();
    ps.set("kijoNm", this.kijoNm);
    ps.set("setubiNm", this.setubiNm);
    ps.set("pagingStart", (this.start + 1).toString());
    ps.set("pagingEnd", this.itemsPerPage.toString());

    // 検索
    this.isLoading = true;
    this.jsonpService.commonRequestGet('SetubiListDataGet.php', ps)
      .subscribe(
      data => {
        // 通信成功時
        if (data[0]) {
          let list = data[0];
          if (list.result !== '' && list.result == true) {
            // 画面表示パラメータのセット処理
            this.bigTotalItems = list.count; // ページング(総数)
            this.setDspParam(data.slice(1)); // 配列1つ目は、サーバ処理成功フラグなので除外
          }
        }
        this.isLoading = false;
      },
      error => {
        // 通信失敗もしくは、コールバック関数内でエラー
        console.log(error);
        console.log('サーバとのアクセスに失敗しました。');
        this.isLoading = false;
        return false;
      }
      );
  }

  // 設備リスト 
  setubiList = [];
  // 画面表示パラメータのセット処理
  setDspParam(data) {
    // 設備リストをセット
    this.setubiList = data;
  }

  // 選択ボタンクリック
  onSelect(setubiId: any, setubiNm: any, kijoId: any, kijoNm: any, jigyosyutaiId: any, jigyosyutaiNm: any, prefNm: any) {
    // 営業担当者
    this.setubiSelect.emit({
      "setubiId": setubiId
      , "setubiNm": setubiNm
      , "kijoId": kijoId
      , "kijoNm": kijoNm
      , "jigyosyutaiId": jigyosyutaiId
      , "jigyosyutaiNm": jigyosyutaiNm
      , "prefNm": prefNm
    });
    // モーダルの非表示
    this.template.hide();
  }

  SUB_WIN = null;
  // CRM24の新規顧客（機場）登録画面を開く
  openNewKijo() {
    let url = environment.crmPath + "cust_input2.php?"; // 環境に合わせたURLを作成する
    url += "&user_id=" + this.userId;  //従業員コード

    this.SUB_WIN = this.CMN_openNewWindow1(url, "NEW_KIJO", 800, 300);
    this.template.hide();
    return;
  }

  // CRM24の新規設備登録画面を開く
  openNewSetubi(kijoId) {
    let url = environment.crmPath + "stb_input2.php?"; // 環境に合わせたURLを作成する
    url += "&user_id=" + this.userId;  //従業員コード
    url += "&usercode=" + kijoId;  //機場コード

    this.SUB_WIN = this.CMN_openNewWindow1(url, "NEW_KIJO", 800, 300);
    this.template.hide();
    return;
  }

  //新しいウィンドウを開く(パターン1)
  CMN_openNewWindow1(url, name, sizex, sizey) {
    var style = "toolbar=0,location=0,directories=0,status=yes,menubar=0,scrollbars=1,resizable=1," +
      "width=" + sizex + ",height=" + sizey;
    var win = window.open(url, name, style);
    if (win) {
      win.focus();
      return win;
    }
  }
}