import { Component, TemplateRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { URLSearchParams } from '@angular/http';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { JsonpService } from '../jsonp.service';

import { LoadingComponent } from "../loading/loading.component";

@Component({
  selector: 'userSearch-modal',
  templateUrl: './userSearch.modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class UserSearchModalComponent {
  @ViewChild('template')
  template;
  modalRef: BsModalRef;

  // モーダルのタイプ　親コンポーネントからの値受け取り
  modalType: any;

  // 営業担当者イベント(親コンポーネントのメソッド呼び出し)
  @Output() salesUserSelect: EventEmitter<any> = new EventEmitter();

  constructor(private modalService: BsModalService, private jsonpService: JsonpService) { }

  isLoading: boolean = false;

  // 検索条件
  searchUserLastNm = "";
  searchUserFirstNm = "";
  searchSectionNm = "";
  searchSectionCd = "";

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
  openModal(modalTypeFromParent: any) {
    if (modalTypeFromParent) {
      // 親コンポーネントからの値受け取り
      this.modalType = modalTypeFromParent;
    }
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

  // 選択ボタンクリック
  onSelect(userId: any, userNm: any, sectionCd: any, sectionNm: any) {
    // 営業担当者
    this.salesUserSelect.emit({
        "userSearchType":this.modalType
      , "userId": userId
      , "userNm": userNm
      , "sectionCd": sectionCd
      , "sectionNm": sectionNm 
    });
    // モーダルの非表示
    this.template.hide();
  }
}