import { Component, TemplateRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { URLSearchParams } from '@angular/http';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { JsonpService } from '../jsonp.service';

import { LoadingComponent } from "../loading/loading.component";

@Component({
  selector: 'projectSearch-modal',
  templateUrl: './projectSearch.modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ProjectSearchModalComponent {
  @ViewChild('template')
  template;
  modalRef: BsModalRef;

  // モーダルのタイプ　親コンポーネントからの値受け取り
  modalType: any;

  // プロジェクトイベント(親コンポーネントのメソッド呼び出し)
  @Output() projectSearchSelect: EventEmitter<any> = new EventEmitter();

  constructor(private modalService: BsModalService, private jsonpService: JsonpService) { }

  isLoading: boolean = false;

  // 検索条件
  searchPjNo = "";
  searchInqNo = "";
  searchConsumerNm = "";
  searchSummaryNm = "";

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
  openModal() {
    this.clearProjectSearch();
    this.template.show();
    this.search();
  }

  // 検索条件の初期化
  clearProjectSearch() {
    this.searchPjNo = "";
    this.searchInqNo = "";
    this.searchConsumerNm = "";
    this.searchSummaryNm = "";
  }

  // 検索処理
  search() {
    // 検索パラメータの作成
    let ps = new URLSearchParams();
    ps.set("pjNo", this.searchPjNo);
    ps.set("inqNo", this.searchInqNo);
    ps.set("consumerNm", this.searchConsumerNm);
    ps.set("summaryNm", this.searchSummaryNm);

    // 検索
    this.isLoading = true;
    this.jsonpService.commonRequestGet('ProjectListDataGet.php', ps)
      .subscribe(
      data => {
        // 通信成功時
        console.group("ProjectSearchModalComponent.search() success");
        console.log(data);
        console.groupEnd();
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
        console.group("ProjectSearchModalComponent.search() fail");
        console.error(error);
        console.log('サーバとのアクセスに失敗しました。');
        console.groupEnd();
        this.isLoading = false;
        return false;
      }
      );
  }

  // プロジェクト検索結果リスト
  projList = [];
  // 画面表示パラメータのセット処理
  setDspParam(data) {
    // ページングの設定
    this.bigTotalItems = data.length;
    // プロジェクトリストをセット
    this.projList = data;
  }

  // 選択ボタンクリック
  onSelect(pjId: any, pjNo: any, summaryNm: any) {
    // プロジェクト
    this.projectSearchSelect.emit({ "pjId": pjId, "pjNo": pjNo, "summaryNm": summaryNm });
    // モーダルの非表示
    this.template.hide();
  }
}