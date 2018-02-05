import { Component, TemplateRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { URLSearchParams } from '@angular/http';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { JsonpService } from '../jsonp.service';

import { LoadingComponent } from "../loading/loading.component";

@Component({
  selector: 'relateUserAdd-modal',
  templateUrl: './relateUserAdd.modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class RelateUserAddModalComponent {
  @ViewChild('template') template;
  @ViewChild('second') second;
  modalRef: BsModalRef;

  // ユーザイベント(親コンポーネントのメソッド呼び出し)
  @Output() relateUserSelect: EventEmitter<any> = new EventEmitter();

  constructor(private modalService: BsModalService, private jsonpService: JsonpService) { }

  isLoading: boolean = false;

  // 検索条件
  searchUserLastNm = "";
  searchUserFirstNm = "";
  searchSectionNm = "";
  searchSectionCd = "";
  incidentId = "";

  // ページングの設定
  maxSize: number = 5; // ページングの表示ページ数
  bigTotalItems: number = 0; // 総数
  itemsPerPage: number = 10; // 1ページに表示する件数
  currentPage: number = 0; // 現在表示しているページ
  start: number = 0; // データ表示開始位置
  end: number = 10; // データ表示終了位置

  // ページング処理
  pageChanged(event: any): void {
    this.start = this.itemsPerPage * (this.currentPage - 1);
    let tmpStart: number = +this.start;
    let tmpItemsPerPage: number = +this.itemsPerPage;
    this.end = tmpStart + tmpItemsPerPage;
  }

  // モーダル表示
  openModal(pageIncidentId:any) {
    this.incidentId = pageIncidentId;
    this.clearUserSearch();
    this.template.show();
    this.search();
  }

// 検索条件の初期化
clearUserSearch() {
  this.searchUserLastNm = "";
  this.searchUserFirstNm = "";
  this.searchSectionNm = "";
  this.searchSectionCd = "";
}

// 検索処理
search() {
  // 検索パラメータの作成
  let ps = new URLSearchParams();
  ps.set("userNmSei", this.searchUserLastNm);
  ps.set("userNmMei", this.searchUserFirstNm);
  ps.set("sectionNm", this.searchSectionNm);
  ps.set("sectionCd", this.searchSectionCd);

  // 検索
  this.isLoading = true;
  this.jsonpService.commonRequestGet('UserListDataGet.php', ps)
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
      this.currentPage = 1;
      this.pageChanged(null);
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

// ユーザ検索結果リスト
userList = [];
// 画面表示パラメータのセット処理
setDspParam(data) {
  // ページングの設定
  this.bigTotalItems = data.length;
  // ユーザリストをセット
  this.userList = data;
}

  addUserId;
  addUserNm;
  addSectionCd;
  addSectionNm;

  // 追加確認モーダルのボタン 押すと、関係者が追加される
  relateUserAdd(){
    // 営業担当者
    this.relateUserSelect.emit({
      "userId": this.addUserId
      , "userNm": this.addUserNm
      , "sectionCd": this.addSectionCd
      , "sectionNm": this.addSectionNm
    });
    // モーダルの非表示
    this.template.hide();
  }

  // 追加ボタンを押したら、重複チェックを実施する
  onSelect(userId: any, userNm: any, sectionCd: any, sectionNm: any) {
    this.addUserId = userId;
    this.addUserNm = userNm;
    this.addSectionCd = sectionCd;
    this.addSectionNm = sectionNm;

    let ps = new URLSearchParams();
    ps.set('incidentId', this.incidentId);
    ps.set('relateUserSectionCd',sectionCd);
    ps.set('relateUserId',userId);

    // 検索
    this.isLoading = true;
    this.jsonpService.requestGet('IncidentRelateUserCheck.php', ps)
      .subscribe(
      data => {
        console.log(data);
        // インシデント関係者のデータ重複チェック true : 有、false : 無し
        if (data[0]['resultFlg'] == true || data[0]['resultFlg'] == 'true') {
          // 重複結果、重複有り
          this.openModalSecond('警告','選んだユーザは既に登録されています。','','閉じる');
        }else{
          // 重複結果、重複無し
          this.openModalSecond('確認','関係者を追加します。宜しいですか？','OK','キャンセル');
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
    return false;
  }

    // モーダル表示
    openModalSecond(headerStr: string, mes: string, enterBtnStr: string, closeBtnStr: string) {
      this.setHeaderStr(headerStr);
      this.setMes(mes);
      this.setEnterBtnStr(enterBtnStr);
      this.setCloseBtnStr(closeBtnStr);
      this.second.show();
    }
  
    headerStr: string; // モーダルヘッダー文字列
    mes: string; // 表示文字列
    enterBtnStr: string; // 処理ボタンの表示文字列
    closeBtnStr: string; // 閉じるボタンの表示文字列
    enterBtnShow = false; // 処理ボタンの表示フラグ

      // モーダルヘッダー文字列の初期化
  setHeaderStr(headerStr: string) {
    this.headerStr = headerStr;
  }

  // 表示メッセージの初期化
  setMes(mes: string) {
    this.mes = mes;
  }

  // 処理ボタンの表示文字列の初期化
  setEnterBtnStr(btnStr: string) {
    this.enterBtnStr = btnStr;
    if (btnStr) {
      // 処理ボタンの表示文字列がある場合のみ処理ボタンを表示する
      this.enterBtnShow = true;
    } else {
      // 処理ボタン非表示
      this.enterBtnShow = false;
    }
  }

  // 閉じるボタンの表示文字列の初期化
  setCloseBtnStr(btnStr: string) {
    this.closeBtnStr = btnStr;
  }

  // 処理ボタンを押した
  enter() {
    // モーダルを閉じる
    this.second.hide();
    // 親コンポーネントの処理を実行する為に、イベントを発火
    this.relateUserAdd();
  }
}