import { Component, TemplateRef, ViewChild, Output, EventEmitter  } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { URLSearchParams } from '@angular/http';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { JsonpService } from '../jsonp.service';

import { LoadingComponent } from "../loading/loading.component";

@Component({
  selector: 'customerSearch-modal',
  templateUrl: './customerSearch.modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class CustomerSearchModalComponent {
  @ViewChild('template')
  template;

  modalRef: BsModalRef;

  // 顧客（取引先）イベント
  @Output() customerSearchSelect: EventEmitter<any> = new EventEmitter();

  constructor(private modalService: BsModalService,private jsonpService: JsonpService) { }

  isLoading: boolean = false;

  // 検索条件
  searchCustomerCd = "";
  searchCustomerNm = "";
  searchAddress = "";

  // ページングの設定
  maxSize: number = 5; // ページングの表示ページ数
  bigTotalItems: number = 0; // 総数
  itemsPerPage: number = 10; // 1ページに表示する件数
  currentPage: number = 0; // 現在表示しているページ
  start: number = 0; // データ表示開始位置
  end: number = 10; // データ表示終了位置

  // ページング処理
  pageChanged(event: any): void {
    // ::: 2018.03.01 [#43] ページング修正：顧客モーダル Add Start newtouch
    if (!(this.itemsPerPage > 0)) {
      this.itemsPerPage = 10;
    }
    // ::: 2018.03.01 [#43] ページング修正：顧客モーダル Add End   newtouch
    this.start = this.itemsPerPage * (this.currentPage - 1);
    let tmpStart: number = +this.start;
    let tmpItemsPerPage: number = +this.itemsPerPage;
    this.end = tmpStart + tmpItemsPerPage;
    // ::: 2018.03.01 [#43] ページング修正：顧客モーダル Add Start newtouch
    this.search();
    // ::: 2018.03.01 [#43] ページング修正：顧客モーダル Add End   newtouch
  }

  // ::: 2018.03.01 [#43] ページング修正：顧客モーダル Add Start newtouch
  // 表示ページを初期化する
  initCurrentPage() {
    this.currentPage = 1;
  }
  // ::: 2018.03.01 [#43] ページング修正：顧客モーダル Add End   newtouch

  // モーダル表示
  openModal() {
    this.clearCustomerSearch();
    // ::: 2018.03.01 [#43] ページング修正：顧客モーダル Add Start newtouch
    this.bigTotalItems = 0; // 総数
    this.itemsPerPage = 10; // 1ページに表示する件数
    this.currentPage = 0;
    this.start = 0;
    this.end = 10;
    // ::: 2018.03.01 [#43] ページング修正：顧客モーダル Add End   newtouch
    this.template.show();
    this.search();
  }

  // 検索条件の初期化
  clearCustomerSearch() {
    this.searchCustomerCd = "";
    this.searchCustomerNm = "";
    this.searchAddress = "";
  }

  // 検索処理
  search() {
    this.isLoading = true;
    // 検索パラメータの作成
    let ps = new URLSearchParams();
    ps.set("customerCd", this.searchCustomerCd);
    ps.set("customerNm", this.searchCustomerNm);
    ps.set("address", this.searchAddress);
    // ::: 2018.03.01 [#43] ページング修正：顧客モーダル Add Start newtouch
    ps.set("pagingStart", (this.start + 1).toString());
    ps.set("pagingEnd", this.itemsPerPage.toString());
    // ::: 2018.03.01 [#43] ページング修正：顧客モーダル Add End   newtouch

    // 検索
    this.jsonpService.commonRequestGet('CustomerListDataGet.php', ps)
      .subscribe(
      data => {
        // 通信成功時
        console.log(data);
        if (data[0]) {
          let list = data[0];
          if (list.result !== '' && list.result == true) {
            // 画面表示パラメータのセット処理
            // ::: 2018.03.01 [#43] ページング修正：顧客モーダル Add Start newtouch
            this.bigTotalItems = list.count; // ページング(総数)
            // ::: 2018.03.01 [#43] ページング修正：顧客モーダル Add End   newtouch
            this.setDspParam(data.slice(1)); // 配列1つ目は、サーバ処理成功フラグなので除外
          }
        }
        // ::: 2018.03.01 [#43] ページング修正：顧客モーダル Del Start newtouch
        // :::         this.currentPage = 1;
        // :::         this.pageChanged(null);
        // ::: 2018.03.01 [#43] ページング修正：顧客モーダル Del End   newtouch
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

  // 顧客（取引先）検索結果リスト
  customerList = [];
  // 画面表示パラメータのセット処理
  setDspParam(data) {
    // ::: 2018.03.01 [#43] ページング修正：顧客モーダル Del Start newtouch
    // :::     // ページングの設定
    // :::     this.bigTotalItems = data.length;
    // ::: 2018.03.01 [#43] ページング修正：顧客モーダル Del End   newtouch
    // 顧客（取引先）リストをセット
    this.customerList = data;
  }

  // 選択ボタンクリック
  onSelect(customerCd: any, customerNm: any, address: any) {
    // 顧客（取引先）
    this.customerSearchSelect.emit({
      "customerCd": customerCd
      , "customerNm": customerNm
      , "address": address 
    });
    // モーダルの非表示
    this.template.hide();
  }

}