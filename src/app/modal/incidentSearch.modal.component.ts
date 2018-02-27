import { Component, TemplateRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { URLSearchParams } from '@angular/http';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

// datepikerの設定
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { listLocales } from 'ngx-bootstrap/chronos';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { jaLocale } from 'ngx-bootstrap/locale';

import { JsonpService } from '../jsonp.service';

import { LoadingComponent } from "../loading/loading.component";

// datepikerの設定
defineLocale('ja', jaLocale);

@Component({
  selector: 'incidentSearch-modal',
  templateUrl: './incidentSearch.modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class IncidentSearchModalComponent {
  @ViewChild('template')
  template;
  modalRef: BsModalRef;

  // インシデント検索イベント
  @Output() incidentSearchSelect: EventEmitter<any> = new EventEmitter();

  constructor(private modalService: BsModalService, private jsonpService: JsonpService, private _localeService: BsLocaleService) {
    // datepikerの設定
    this.bsConfig = Object.assign({}, { dateInputFormat: 'YYYY/MM/DD' });
    this._localeService.use(this.locale);
  }

  isLoading: boolean = false;

  // 検索条件
  searchIncidentNo = "";
  searchCallContent = "";
  searchCallStartDateFrom = "";
  searchCallStartDateTo = "";
  searchIncidentType = "";
  searchIncidentTypeSyougai = "";
  searchIncidentTypeJiko = "";
  searchIncidentTypeClaim = "";
  searchIncidentTypeToiawase = "";
  searchIncidentTypeInfo = "";
  searchIncidentTypeOther = "";
  searchIncidentStatus = "";
  searchIncidentStatusCall = "";
  searchIncidentStatusTaio = "";
  searchIncidentStatusAct = "";
  kijoNm = "";
  prefNm = null;

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
    this.clearIncidentSearch();
    this.template.show();
    this.search();
  }

  // 検索条件の初期化
  clearIncidentSearch() {
    this.checkShowInit(); // 初期化エラーメッセージ
    this.searchIncidentNo = "";
    this.searchCallContent = "";
    this.searchCallStartDateFrom = "";
    this.searchCallStartDateTo = "";
    this.searchIncidentType = "";
    this.searchIncidentTypeSyougai = "";
    this.searchIncidentTypeJiko = "";
    this.searchIncidentTypeClaim = "";
    this.searchIncidentTypeToiawase = "";
    this.searchIncidentTypeInfo = "";
    this.searchIncidentTypeOther = "";
    this.searchIncidentStatus = "";
    this.searchIncidentStatusCall = "";
    this.searchIncidentStatusTaio = "";
    this.searchIncidentStatusAct = "";
    this.kijoNm = "";
    this.prefNm = null;
  }

  checkDateShowCallStartDateFrom = false; //受付日（FROM）(日付型チェック)
  checkDateShowCallStartDateTo = false; //受付日（TO）(日付型チェック)

  // 初期化エラーメッセージ
  checkShowInit() {
    this.checkDateShowCallStartDateFrom = false; //受付日（FROM）(日付型チェック)
    this.checkDateShowCallStartDateTo = false; //受付日（TO）(日付型チェック)
  }

  // 検索処理
  search() {
    if (this.checkDate()) {
      // 検索パラメータの作成
      let ps = new URLSearchParams();

      ps.set("incidentNo", this.searchIncidentNo);
      ps.set("callContent", this.searchCallContent);
      var searchCallStartDateFromStr = this.getDateStringFromDate(this.searchCallStartDateFrom);
      ps.set("callStartDateFrom", searchCallStartDateFromStr);
      var searchCallStartDateToStr = this.getDateStringFromDate(this.searchCallStartDateTo);
      ps.set("callStartDateTo", searchCallStartDateToStr);
      ps.set("incidentType", this.searchIncidentType);
      ps.set("incidentTypeSyougai", this.searchIncidentTypeSyougai);
      ps.set("incidentTypeJiko", this.searchIncidentTypeJiko);
      ps.set("incidentTypeClaim", this.searchIncidentTypeClaim);
      ps.set("incidentTypeToiawase", this.searchIncidentTypeToiawase);
      ps.set("incidentTypeInfo", this.searchIncidentTypeInfo);
      ps.set("incidentTypeOther", this.searchIncidentTypeOther);
      ps.set("incidentStatus", this.searchIncidentStatus);
      ps.set("incidentStatusCall", this.searchIncidentStatusCall);
      ps.set("incidentStatusTaio", this.searchIncidentStatusTaio);
      ps.set("incidentStatusAct", this.searchIncidentStatusAct);
      ps.set("incidentStatusAct", this.searchIncidentStatusAct);
      ps.set("incidentStatusAct", this.searchIncidentStatusAct);
      ps.set("kijoNm", this.kijoNm);
      ps.set("prefNm", this.prefNm);

      // 検索
      this.isLoading = true;
      this.jsonpService.requestGet('IncidentListDataGet.php', ps)
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
          this.currentPage = 1;
          this.pageChanged(null);
          this.isLoading = false;
        },
        error => {
          // 通信失敗もしくは、コールバック関数内でエラー
          console.log('サーバとのアクセスに失敗しました。');
          this.isLoading = false;
          return false;
        }
        );
    }
  }

  // インシデント情報検索結果リスト
  incidentList = [];
  // 画面表示パラメータのセット処理
  setDspParam(data) {
    // ページングの設定
    this.bigTotalItems = data.length;
    // インシデント情報 リストをセット
    this.incidentList = data;
  }

  // date pikerの設定
  bsValue: Date;
  locale = 'ja';
  locales = listLocales();
  bsConfig: Partial<BsDatepickerConfig>;

  // 選択ボタンクリック
  onSelect(incidentId: any, incidentNo: any) {
    // インシデント情報 
    this.incidentSearchSelect.emit({ "incidentId": incidentId, "incidentNo": incidentNo });
    // モーダルの非表示
    this.template.hide();
  }

  // 日付型を日付フォーマット文字列に変更
  getDateStringFromDate(date) {
    if (date && date.getFullYear()) {
      var y: number = date.getFullYear();
      var m: number = date.getMonth();
      m++;
      var d: number = date.getDate();
      if (y) {
        var yStr = ('00' + y).slice(-4);
      }
      if (m) {
        var mStr = ('00' + m).slice(-2);
      }
      if (d) {
        var dStr = ('00' + d).slice(-2);
      }
      if (yStr && mStr && dStr) {
        return yStr + "/" + mStr + "/" + dStr + " 00:00:00";
      } else {
        // 日付型でない値の場合
        return null;
      }

    } else {
      // 日付型でない値の場合
      return null;
    }
  }

  // 日付型値の日付型チェック
  checkDate() {

    this.checkShowInit();
    var result = true; // 返り値

    // 受付日（FROM）
    var callStartDateFromValue = (<HTMLInputElement>document.getElementById('txt_callStartDateFrom')).value;
    var searchCallStartDateFromStr = this.getDateStringFromDate(this.searchCallStartDateFrom);
    if (searchCallStartDateFromStr == null && callStartDateFromValue != "") {
      this.checkDateShowCallStartDateFrom = true;
      result = false;
    }

    // 受付日（TO）
    var callStartDateToValue = (<HTMLInputElement>document.getElementById('txt_callStartDateTo')).value;
    var searchCallStartDateToStr = this.getDateStringFromDate(this.searchCallStartDateTo);
    if (searchCallStartDateToStr == null && callStartDateToValue != "") {
      this.checkDateShowCallStartDateTo = true;
      result = false;
    }

    return result;
  }

}