import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { URLSearchParams } from '@angular/http';

// datepikerの設定
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { listLocales } from 'ngx-bootstrap/chronos';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { jaLocale } from 'ngx-bootstrap/locale';

import { JsonpService } from '../jsonp.service';
import { LoginService } from '../login.service';
import { Subscription } from 'rxjs/Subscription';

import { OrderByParam } from '../pipe/order.by.pipe';

import { LoadingComponent } from "../loading/loading.component";

// datepikerの設定
defineLocale('ja', jaLocale);

@Component({
  selector: 'my-app',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  @ViewChild('header') header;

  userId;
  userNm;
  userSectionCd;
  userSectionNm;
  subscription: Subscription;
  constructor(private route: ActivatedRoute, private jsonpService: JsonpService, private loginService: LoginService, private _localeService: BsLocaleService) {
    /* ログイン情報の取得 */
    this.subscription = loginService.loginUserNm$.subscribe(user => { this.userNm = user; });
    this.subscription = loginService.loginUserId$.subscribe(user => { this.userId = user; });
    this.subscription = loginService.loginUserSectionCd$.subscribe(user => { this.userSectionCd = user; });
    this.subscription = loginService.loginUserSectionNm$.subscribe(user => { this.userSectionNm = user; });
    // datepikerの設定
    this.bsConfig = Object.assign({}, { dateInputFormat: 'YYYY/MM/DD' });
    this._localeService.use(this.locale);
  }

  isLoading: boolean = true;

  ngOnInit() {
    this.route.data.subscribe(obj => console.log(obj['category']));

    // 検索条件のデフォルト設定
    this.setDefaultShow();
    let condId = this.route.snapshot.paramMap.get('condId');
    let keyword = this.route.snapshot.paramMap.get('keyword');
    if (keyword != null) {
      this.showKeywordFlg = true;
      this.keyword = this.transCodeToStr(keyword);
      this.searchByKeyword(keyword);
    } else if (condId != null) {
      this.searchCondition(condId);
    } else {
      this.searchCondition(0);
    }
    // this.defaultSort("callDate");
  }

  ngOnDestroy() {
    // 親サービスDIの影響 メモリリーク防止
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }

  // 画面再表示処理
  reloadSearch($event) {
    if ($event) {
      this.searchClear('all');
      // 検索条件のデフォルト設定
      let condId = $event["condId"];
      let keyword = $event["keyword"];
      this.setDefaultShow();
      if (keyword != null) {
        this.showKeywordFlg = true;
        this.keyword = this.transCodeToStr(keyword);
        this.searchByKeyword(keyword);
      } else if (condId != null) {
        this.searchCondition(condId);
      } else {
        this.searchCondition(0);
      }
    }
  }

  // コードは16位から正常に変換する
  transCodeToStr(data) {
    if (data == '') return '';
    data = data.split('\\u');
    var str = '';
    for (var i = 0; i < data.length; i++) {
      str += String.fromCharCode(parseInt(data[i], 16));
    }
    return str;
  }

  // 検索項目追加処理
  addCondition() {
    let itemNm = this.selCondition;

    switch (itemNm) {
      case 'incidentNoShow':
        this.incidentNoShow = true;
        // 検索項目プルダウンを初期化
        this.selCondition = "0";
        break;
      case 'callContentShow':
        this.callContentShow = true;
        // 検索項目プルダウンを初期化
        this.selCondition = "0";
        break;
      case 'parentIncidentNoShow':
        this.parentIncidentNoShow = true;
        // 検索項目プルダウンを初期化
        this.selCondition = "0";
        break;
      case 'incidentStartDateTimeShow':
        this.incidentStartDateTimeShow = true;
        // 検索項目プルダウンを初期化
        this.selCondition = "0";
        break;
      case 'callDateShow':
        this.callDateShow = true;
        // 検索項目プルダウンを初期化
        this.selCondition = "0";
        break;
      case 'industryTypeShow':
        this.industryTypeShow = true;
        // 検索項目プルダウンを初期化
        this.selCondition = "0";
        break;
      case 'kijoNmShow':
        this.kijoNmShow = true;
        // 検索項目プルダウンを初期化
        this.selCondition = "0";
        break;
      case 'jigyosyutaiNmShow':
        this.jigyosyutaiNmShow = true;
        // 検索項目プルダウンを初期化
        this.selCondition = "0";
        break;
      case 'setubiNmShow':
        this.setubiNmShow = true;
        // 検索項目プルダウンを初期化
        this.selCondition = "0";
        break;
      case 'prefNmShow':
        this.prefNmShow = true;
        // 検索項目プルダウンを初期化
        this.selCondition = "0";
        break;
      case 'custNmShow':
        this.custNmShow = true;
        // 検索項目プルダウンを初期化
        this.selCondition = "0";
        break;
      case 'custTypeShow':
        this.custTypeShow = true;
        // 検索項目プルダウンを初期化
        this.selCondition = "0";
        break;
      case 'salesDeptNmShow':
        this.salesDeptNmShow = true;
        // 検索項目プルダウンを初期化
        this.selCondition = "0";
        break;
      case 'salesUserNmShow':
        this.salesUserNmShow = true;
        // 検索項目プルダウンを初期化
        this.selCondition = "0";
        break;
      case 'relateUserNmShow':
        this.relateUserNmShow = true;
        // 検索項目プルダウンを初期化
        this.selCondition = "0";
        break;
      case 'incidentTypeShow':
        this.incidentTypeShow = true;
        // 検索項目プルダウンを初期化
        this.selCondition = "0";
        break;
      case 'incidentStsShow':
        this.incidentStsShow = true;
        // 検索項目プルダウンを初期化
        this.selCondition = "0";
        break;
      default:
        break;
    }
  }

  // 検索項目チェック
  inputCheck() {
    if (this.incidentNoShow && !this.lengthCheck("インシデント番号", this.incidentNo, 50)) {
      return false;
    }
    if (this.callContentShow && !this.lengthCheck("受付内容", this.callContent, 100)) {
      return false;
    }
    if (this.parentIncidentNoShow && !this.lengthCheck("親インシデント番号", this.parentIncidentNo, 50)) {
      return false;
    }
    // 日付項目の確認
    if (!this.checkDate()) {
      return false;
    }
    if (this.kijoNmShow && !this.lengthCheck("機場", this.kijoNm, 50)) {
      return false;
    }
    if (this.jigyosyutaiNmShow && !this.lengthCheck("事業主体", this.jigyosyutaiNm, 50)) {
      return false;
    }
    if (this.setubiNmShow && !this.lengthCheck("設備", this.setubiNm, 50)) {
      return false;
    }
    if (this.custNmShow && !this.lengthCheck("顧客", this.custNm, 50)) {
      return false;
    }
    if (this.salesDeptNmShow && !this.lengthCheck("営業部門", this.salesDeptNm, 50)) {
      return false;
    }
    if (this.salesUserNmShow && !this.lengthCheck("営業担当者", this.salesUserNm, 50)) {
      return false;
    }
    if (this.relateUserNmShow && !this.lengthCheck("関係者", this.relateUserNm, 50)) {
      return false;
    }
    return true;
  }

  // 検索項目取得処理
  getCondition() {
    var conditionArray = new Array();
    if (this.inputCheck()) {
      conditionArray[0] = true;

      // インシデント分類
      conditionArray[1] = this.incidentTypeSyougai;
      conditionArray[2] = this.incidentTypeJiko;
      conditionArray[3] = this.incidentTypeClaim;
      conditionArray[4] = this.incidentTypeToiawase;
      conditionArray[5] = this.incidentTypeInfo;
      conditionArray[6] = this.incidentTypeOther;
      // ステータス
      conditionArray[7] = this.incidentStatusCall;
      conditionArray[8] = this.incidentStatusTaio;
      conditionArray[9] = this.incidentStatusAct;
      // インシデント番号
      conditionArray[10] = this.incidentNo;
      // 受付内容
      conditionArray[11] = this.callContent;
      // 親インシデント番号
      conditionArray[12] = this.parentIncidentNo;
      // 発生日時
      conditionArray[13] = this.getDateStringFromDate(this.incidentStartDateTimeFrom);
      conditionArray[14] = this.getDateStringFromDate(this.incidentStartDateTimeTo);
      // 受付日
      conditionArray[15] = this.getDateStringFromDate(this.callStartDateFrom);
      conditionArray[16] = this.getDateStringFromDate(this.callStartDateTo);
      // 業種区分
      conditionArray[17] = this.industryTypeMachinery;
      conditionArray[18] = this.industryTypeElectricalMachinery;
      conditionArray[19] = this.industryTypeInstrumentation;
      conditionArray[20] = this.industryTypeInfo;
      conditionArray[21] = this.industryTypeEnvironment;
      conditionArray[22] = this.industryTypeWBC;
      conditionArray[23] = this.industryTypeOther;
      // 機場
      conditionArray[24] = this.kijoNm;
      // 事業主体
      conditionArray[25] = this.jigyosyutaiNm;
      // 設備
      conditionArray[26] = this.setubiNm;
      // 都道府県
      conditionArray[27] = this.prefNm;
      // 顧客
      conditionArray[28] = this.custNm;
      // 顧客分類
      conditionArray[29] = this.custTypeNenkan;
      conditionArray[30] = this.custTypeTenken;
      conditionArray[31] = this.custTypeNasi;
      conditionArray[32] = this.custTypeKasi;
      conditionArray[33] = this.custTypeOther;
      // 営業部門
      conditionArray[34] = this.salesDeptNm;
      // 営業担当者
      conditionArray[35] = this.salesUserNm;
      // 関係者
      conditionArray[36] = this.relateUserNm;
      // userId
      conditionArray[37] = this.userId;
      // userName
      conditionArray[38] = this.userNm;
      // sectionCd
      conditionArray[39] = this.userSectionCd;
      // sectionName
      conditionArray[40] = this.userSectionNm;
    } else {
      conditionArray[0] = false;
    }

    return conditionArray;
  }

  // 登録している検索条件が変更された
  changeCondition($event: any) {
    // ヘッダーの検索条件名の表示を更新する
    this.header.searchConditionName();
  }

  // 最大文字数チェック
  lengthCheck(name, val, length) {
    if (val != null && val.length > length) {
      alert(name + "の最大文字数は" + length + "です。");
      return false;
    } else {
      return true;
    }
  }

  // 日付フォーマットチェック
  dateFormatCheck(name, date) {
    if (this.getDateStringFromDate(date) == null) {
      alert(name + "は日付型でない。");
      return false;
    }
    return true;
  }

  selCondition = "0";
  showBackFlg = false;
  incidentTypeShow = false;
  incidentStsShow = false;
  incidentNoShow = false;
  callContentShow = false;
  parentIncidentNoShow = false;
  incidentStartDateTimeShow = false;
  callDateShow = false;
  industryTypeShow = false;
  kijoNmShow = false;
  jigyosyutaiNmShow = false;
  setubiNmShow = false;
  prefNmShow = false;
  custNmShow = false;
  custTypeShow = false;
  salesDeptNmShow = false;
  salesUserNmShow = false;
  relateUserNmShow = false;
  condList = [];
  condId = null;
  condNm = null;
  // userId = null;
  // userName = null;
  // sectionCd = null;
  // sectionName = null;
  incidentTypeSyougai = null;
  incidentTypeJiko = null;
  incidentTypeClaim = null;
  incidentTypeToiawase = null;
  incidentTypeInfo = null;
  incidentTypeOther = null;
  incidentStatusCall = null;
  incidentStatusTaio = null;
  incidentStatusAct = null;
  parentIncidentNo = null;
  incidentStartDateTimeFrom = null;
  incidentStartDateTimeTo = null;
  industryTypeMachinery = null;
  industryTypeElectricalMachinery = null;
  industryTypeInstrumentation = null;
  industryTypeInfo = null;
  industryTypeEnvironment = null;
  industryTypeWBC = null;
  industryTypeOther = null;
  jigyosyutaiNm = null;
  custNm = null;
  custTypeNenkan = null;
  custTypeTenken = null;
  custTypeNasi = null;
  custTypeKasi = null;
  custTypeOther = null;
  salesDeptNm = null;
  salesUserNm = null;
  relateUserNm = null;

  // 検索条件のデフォルト設定
  setDefaultShow() {
    // インシデント分類
    this.incidentTypeShow = true;
    // ステータス
    this.incidentStsShow = true;
    // インシデント番号
    this.incidentNoShow = true;
    // 受付内容
    this.callContentShow = true;
    // 親インシデント番号
    this.parentIncidentNoShow = false;
    // 発生日時
    this.incidentStartDateTimeShow = false;
    // 受付日
    this.callDateShow = true;
    // 業種区分
    this.industryTypeShow = false;
    // 機場
    this.kijoNmShow = true;
    // 事業主体
    this.jigyosyutaiNmShow = false;
    // 設備
    this.setubiNmShow = true;
    // 都道府県
    this.prefNmShow = true;
    // 顧客
    this.custNmShow = false;
    // 顧客分類
    this.custTypeShow = false;
    // 営業部門
    this.salesDeptNmShow = false;
    // 営業担当者
    this.salesUserNmShow = false;
    // 関係者
    this.relateUserNmShow = false;
  }

  // 検索結果Excel出力処理
  excelOutput() {

  }

  checkDateShowCallStartDateFrom = false; //受付日（FROM）(日付型チェック)
  checkDateShowCallStartDateTo = false; //受付日（TO）(日付型チェック)
  checkDateShowIncidentStartDateFrom = false; //発生日時（FROM）(日付型チェック)
  checkDateShowIncidentStartDateTo = false; //発生日時（TO）(日付型チェック)

  // 日付型値の日付型チェック
  checkDate() {

    // 初期化エラーメッセージを表示しない
    this.checkShowInit();

    var result = true; // 返り値

    // 受付日（FROM）
    var callStartDateFromValue = (<HTMLInputElement>document.getElementById('txt_callStartDateFrom')).value;
    var callStartDateFromStr = this.getDateStringFromDate(this.callStartDateFrom);
    if (callStartDateFromStr == null && callStartDateFromValue != "") {
      this.checkDateShowCallStartDateFrom = true;
      result = false;
    }

    // 受付日（TO）
    var callStartDateToValue = (<HTMLInputElement>document.getElementById('txt_callStartDateTo')).value;
    var callStartDateToStr = this.getDateStringFromDate(this.callStartDateTo);
    if (callStartDateToStr == null && callStartDateToValue != "") {
      this.checkDateShowCallStartDateTo = true;
      result = false;
    }

    // 発生日時（FROM）
    var incidentStartDateFromValue = (<HTMLInputElement>document.getElementById('txt_incidentStartDateTimeFrom')).value;
    var incidentStartDateTimeFromStr = this.getDateStringFromDate(this.incidentStartDateTimeFrom);
    if (incidentStartDateTimeFromStr == null && incidentStartDateFromValue != "") {
      this.checkDateShowIncidentStartDateFrom = true;
      result = false;
    }

    // 発生日時（TO）
    var incidentStartDateToValue = (<HTMLInputElement>document.getElementById('txt_incidentStartDateTimeTo')).value;
    var incidentStartDateTimeToStr = this.getDateStringFromDate(this.incidentStartDateTimeTo);
    if (incidentStartDateTimeToStr == null && incidentStartDateToValue != "") {
      this.checkDateShowIncidentStartDateTo = true;
      result = false;
    }

    return result;
  }

  // 初期化エラーメッセージを表示しない
  checkShowInit() {
    this.checkDateShowCallStartDateFrom = false; //受付日（FROM）(日付型チェック)
    this.checkDateShowCallStartDateTo = false; //受付日（TO）(日付型チェック)
    this.checkDateShowIncidentStartDateFrom = false; //発生日時（FROM）(日付型チェック)
    this.checkDateShowIncidentStartDateTo = false; //発生日時（TO）(日付型チェック)
  }

  incidentList = [];
  incidentNo = null;
  callContent = null;
  kijoNm = null;
  setubiNm = null;
  prefNm = null;
  callStartDateFrom = null;
  callStartDateTo = null;
  // 検索処理
  search() {
    if (this.checkDate()) {
      // 検索パラメータの作成
      let ps = new URLSearchParams();
      ps.set("incidentNo", this.incidentNo);
      ps.set("callContent", this.callContent);
      ps.set("kijoNm", this.kijoNm);
      ps.set("setubiNm", this.setubiNm);
      ps.set("prefNm", this.prefNm);

      var callStartDateFromStr = this.getDateStringFromDate(this.callStartDateFrom);
      ps.set("callStartDateFrom", callStartDateFromStr);
      var callStartDateToStr = this.getDateStringFromDate(this.callStartDateTo);
      ps.set("callStartDateTo", callStartDateToStr);
      var incidentStartDateTimeFromStr = this.getDateStringFromDate(this.incidentStartDateTimeFrom);
      ps.set("incidentStartDateTimeFrom", incidentStartDateTimeFromStr);
      var incidentStartDateTimeToStr = this.getDateStringFromDate(this.incidentStartDateTimeTo);
      ps.set("incidentStartDateTimeTo", incidentStartDateTimeToStr);

      ps.set("incidentTypeSyougai", this.incidentTypeSyougai);
      ps.set("incidentTypeJiko", this.incidentTypeJiko);
      ps.set("incidentTypeClaim", this.incidentTypeClaim);
      ps.set("incidentTypeToiawase", this.incidentTypeToiawase);
      ps.set("incidentTypeInfo", this.incidentTypeInfo);
      ps.set("incidentTypeOther", this.incidentTypeOther);
      ps.set("incidentStatusCall", this.incidentStatusCall);
      ps.set("incidentStatusTaio", this.incidentStatusTaio);
      ps.set("incidentStatusAct", this.incidentStatusAct);
      ps.set("parentIncidentNo", this.parentIncidentNo);
      ps.set("industryTypeMachinery", this.industryTypeMachinery);
      ps.set("industryTypeElectricalMachinery", this.industryTypeElectricalMachinery);
      ps.set("industryTypeInstrumentation", this.industryTypeInstrumentation);
      ps.set("industryTypeInfo", this.industryTypeInfo);
      ps.set("industryTypeEnvironment", this.industryTypeEnvironment);
      ps.set("industryTypeWBC", this.industryTypeWBC);
      ps.set("industryTypeOther", this.industryTypeOther);
      ps.set("jigyosyutaiNm", this.jigyosyutaiNm);
      ps.set("custNm", this.custNm);
      ps.set("custTypeNenkan", this.custTypeNenkan);
      ps.set("custTypeTenken", this.custTypeTenken);
      ps.set("custTypeNasi", this.custTypeNasi);
      ps.set("custTypeKasi", this.custTypeKasi);
      ps.set("custTypeOther", this.custTypeOther);
      ps.set("salesDeptNm", this.salesDeptNm);
      ps.set("salesUserNm", this.salesUserNm);
      ps.set("relateUserNm", this.relateUserNm);

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
          console.log(error);
          console.log('サーバとのアクセスに失敗しました。');
          this.isLoading = false;
          return false;
        }
        );
    }
  }

  keyword = null;
  showKeywordFlg = false;
  showDelFlg = true;
  condFld = null;
  conditionShowArray = [];
  // 検索処理
  searchCondition(condId) {
    // 検索パラメータの作成
    let ps = new URLSearchParams();
    ps.set("condId", condId);

    // 検索
    this.isLoading = true;
    this.jsonpService.requestGet('IncidentListSearchConditionGet.php', ps)
      .subscribe(
      data => {
        // 通信成功時
        if (condId != '0') {
          this.conditionShowArray = data[data.length - 1];
          for (var i = 0; i < this.conditionShowArray.length; i++) {
            var condFld = null;
            var condVal = null;
            condFld = this.conditionShowArray[i]['condFld'];
            condVal = this.conditionShowArray[i]['condVal'];
            this.setConditionShowAndVal(condFld, condVal);
          }
        }

        if (data[0]) {
          let list = data[0];
          if (list.result !== '' && list.result == true) {
            // 画面表示パラメータのセット処理
            this.setDspParam(data.slice(1, -1)); // 配列1つ目は、サーバ処理成功フラグなので除外
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

  // 設置表示条件と条件値
  setConditionShowAndVal(condFld, condVal) {
    switch (condFld) {
      case "incidentTypeSyougai":// インシデント分類（障害）
        this.incidentTypeSyougai = true;
        break;
      case "incidentTypeJiko":// インシデント分類（事故）
        this.incidentTypeJiko = true;
        break;
      case "incidentTypeClaim":// インシデント分類（クレーム）
        this.incidentTypeClaim = true;
        break;
      case "incidentTypeToiawase":// インシデント分類（問合せ）
        this.incidentTypeToiawase = true;
        break;
      case "incidentTypeInfo":// インシデント分類（情報）
        this.incidentTypeInfo = true;
        break;
      case "incidentTypeOther":// インシデント分類（その他）
        this.incidentTypeOther = true;
        break;
      case "incidentStatusCall":// ステータス（受入済）
        this.incidentStatusCall = true;
        break;
      case "incidentStatusTaio":// ステータス（対応入力済）
        this.incidentStatusTaio = true;
        break;
      case "incidentStatusAct":// ステータス（処置入力済）
        this.incidentStatusAct = true;
        break;
      case "incidentNo":// インシデント番号
        this.incidentNo = condVal;
        break;
      case "callContent":// 受付内容
        this.callContent = condVal;
        break;
      case "parentIncidentNo":// 親インシデント番号
        this.parentIncidentNo = condVal;
        this.parentIncidentNoShow = true;
        break;
      case "incidentStartDateTimeFrom":// 発生日時（開始）
        this.incidentStartDateTimeFrom = this.getJsDate(condVal);
        this.incidentStartDateTimeShow = true;
        break;
      case "incidentStartDateTimeTo":// 発生日時（終了）
        this.incidentStartDateTimeTo = this.getJsDate(condVal);
        this.incidentStartDateTimeShow = true;
        break;
      case "callStartDateFrom":// 受付日（開始）
        this.callStartDateFrom = this.getJsDate(condVal);
        break;
      case "callStartDateTo":// 受付日（終了）
        this.callStartDateTo = this.getJsDate(condVal);
        break;
      case "industryTypeMachinery":// 業種区分（機械）
        this.industryTypeShow = true;
        this.industryTypeMachinery = true;
        break;
      case "industryTypeElectricalMachinery":// 業種区分（電機（E））
        this.industryTypeShow = true;
        this.industryTypeElectricalMachinery = condVal;
        break;
      case "industryTypeInstrumentation":// 業種区分（計装（I））
        this.industryTypeShow = true;
        this.industryTypeInstrumentation = condVal;
        break;
      case "industryTypeInfo":// 業種区分（情報（C））
        this.industryTypeShow = true;
        this.industryTypeInfo = condVal;
        break;
      case "industryTypeEnvironment":// 業種区分（環境）
        this.industryTypeShow = true;
        this.industryTypeEnvironment = condVal;
        break;
      case "industryTypeWBC":// 業種区分（WBC）
        this.industryTypeShow = true;
        this.industryTypeWBC = condVal;
        break;
      case "industryTypeOther":// 業種区分（その他）
        this.industryTypeShow = true;
        this.industryTypeOther = condVal;
        break;
      case "kijoNm":// 機場
        this.kijoNm = condVal;
        break;
      case "jigyosyutaiNm":// 事業主体
        this.jigyosyutaiNm = condVal;
        this.jigyosyutaiNmShow = true;
        break;
      case "setubiNm":// 設備
        this.setubiNm = condVal;
        break;
      case "prefNm":// 都道府県
        this.prefNm = condVal;
        break;
      case "custNm":// 顧客
        this.custNm = condVal;
        this.custNmShow = true;
        break;
      case "custTypeNenkan":// 顧客分類（年間契約）
        this.custTypeShow = true;
        this.custTypeNenkan = true;
        break;
      case "custTypeTenken":// 顧客分類（点検契約）
        this.custTypeShow = true;
        this.custTypeTenken = true;
        break;
      case "custTypeNasi":// 顧客分類（契約なし）
        this.custTypeShow = true;
        this.custTypeNasi = true;
        break;
      case "custTypeKasi":// 顧客分類（瑕疵期間中）
        this.custTypeShow = true;
        this.custTypeKasi = true;
        break;
      case "custTypeOther":// 顧客分類（その他）
        this.custTypeShow = true;
        this.custTypeOther = true;
        break;
      case "salesDeptNm":// 営業部門
        this.salesDeptNm = condVal;
        this.salesDeptNmShow = true;
        break;
      case "salesUserNm":// 営業担当者
        this.salesUserNm = condVal;
        this.salesUserNmShow = true;
        break;
      case "relateUserNm":// 関係者
        this.relateUserNm = condVal;
        this.relateUserNmShow = true;
        break;
      default:
        break;
    }
  }

  // サーバから取得した日付をJavascriptのDate型に変更する（失敗時は、nullを返す）
  getJsDate(date) {
    if (date && new Date(date)) {
      return new Date(date);
    }
    return null;
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

  // 画面表示パラメータのセット処理
  setDspParam(data) {
    // ページングの設定
    this.bigTotalItems = data.length;
    this.incidentList = data;
  }

  // date pikerの設定
  bsValue: Date;
  locale = 'ja';
  locales = listLocales();
  bsConfig: Partial<BsDatepickerConfig>;

  // this.(window).scroll(function () {
  //   // スクロールイベント
  //   let this_scrollTop = this.(this).scrollTop();

  //   if (this.("#search-list").offset().top - this_scrollTop < 10) {
  //       this.("#newTable").show();
  //   } else {
  //       this.("#newTable").hide();
  //   }
  // });

  // 設置「検索条件を削除」Flg
  setShowDelFlg($event: any) {
    if ($event) {
      this.showDelFlg = $event["showDelFlg"];
    }
  }

  // 並び替え処理宣言
  order = new OrderByParam();
  orderByParamArray = { // true:ソート有り false:ソート無し [column名 + 「Asc」or「Desc」]
    'incidentNoAsc': false, // インシデント番号のソートアイコン　昇順
    'incidentNoDesc': false, // インシデント番号のソートアイコン　降順
    'callContentAsc': false, // 受付内容のソートアイコン　昇順
    'callContentDesc': false, // 受付内容のソートアイコン　降順
    'kijoNmAsc': false, // 機場のソートアイコン　昇順
    'kijoNmDesc': false, // 機場のソートアイコン　降順
    'setubiNmAsc': false, // 設備のソートアイコン　昇順
    'setubiNmDesc': false, // 設備のソートアイコン　降順
    'prefNmAsc': false, // 都道府県のソートアイコン　昇順
    'prefNmDesc': false, // 都道府県のソートアイコン　降順
    'incidentStartDateTimeAsc': false, // 発生日時のソートアイコン　昇順
    'incidentStartDateTimeDesc': false, // 発生日時のソートアイコン　降順
    'callDateAsc': false, // 受付日のソートアイコン　昇順
    'callDateDesc': false, // 受付日のソートアイコン　降順
    'incidentTypeNmAsc': false, // 分類のソートアイコン　昇順
    'incidentTypeNmDesc': false, // 分類のソートアイコン　降順
    'incidentStatusNmAsc': false, // ステータスのソートアイコン　昇順
    'incidentStatusNmDesc': false, // ステータスのソートアイコン　降順
    'relatePjAsc': false, // 関連PJのソートアイコン　昇順
    'relatePjDesc': false, // 関連PJのソートアイコン　降順
    'relateJikoAsc': false, // 事ク連絡のソートアイコン　昇順
    'relateJikoDesc': false, // 事ク連絡のソートアイコン　降順
    'relateMr2Asc': false, // 現地出動のソートアイコン　昇順
    'relateMr2Desc': false, // 現地出動のソートアイコン　降順
    'relateHiyoAsc': false, // 費用決済のソートアイコン　昇順
    'relateHiyoDesc': false // 費用決済のソートアイコン　降順
  };
  // 並び替え処理(並び順指定)
  sort(column: string) { // ←イベント発火地点
    var columnAsc = column + 'Asc';
    var columnDesc = column + 'Desc';
    this.changeOrderBy(columnAsc, columnDesc);
    var orderBy = this.getOrderBy(columnAsc, columnDesc);
    this.order.set(column, orderBy); // ←ソートを行う

    // 切り替え処理
    for (var key in this.orderByParamArray) {
      if (key != columnAsc && key != columnDesc) {
        // 選択していない項目は全て初期化する
        this.orderByParamArray[key] = false;
      }
    }
  }

  // 並び替え処理(デフォルトの並び順指定)
  defaultSort(column: string) { // ←イベント発火地点
    var columnAsc = column + 'Asc';
    var columnDesc = column + 'Desc';
    this.changeOrderBy(columnDesc, columnAsc);
    var orderBy = 'Desc';
    this.order.set(column, orderBy); // ←ソートを行う

    // 切り替え処理
    for (var key in this.orderByParamArray) {
      if (key != columnAsc && key != columnDesc) {
        // 選択していない項目は全て初期化する
        this.orderByParamArray[key] = false;
      }
    }
  }

  // ソート順の取得
  getOrderBy(columnAsc: string, columnDesc: string) {
    if (this.orderByParamArray[columnAsc] && !this.orderByParamArray[columnDesc]) {
      return 'ASC';
    } else if (!this.orderByParamArray[columnAsc] && this.orderByParamArray[columnDesc]) {
      return 'DESC';
    }
    // 番兵
    this.orderByParamArray[columnAsc] = true;
    this.orderByParamArray[columnDesc] = false;
    return 'ASC';
  }
  // ソート順の変更
  changeOrderBy(columnAsc: string, columnDesc: string) {
    if (!this.orderByParamArray[columnAsc] && !this.orderByParamArray[columnDesc]) {
      // 初めて選択→昇順
      this.orderByParamArray[columnAsc] = true;
    } else if (this.orderByParamArray[columnAsc] && !this.orderByParamArray[columnDesc]) {
      // 昇順→降順
      this.orderByParamArray[columnAsc] = false;
      this.orderByParamArray[columnDesc] = true;
    } else if (!this.orderByParamArray[columnAsc] && this.orderByParamArray[columnDesc]) {
      // 降順→昇順
      this.orderByParamArray[columnAsc] = true;
      this.orderByParamArray[columnDesc] = false;
    } else {
      // 番兵
      this.orderByParamArray[columnAsc] = false;
      this.orderByParamArray[columnDesc] = false;
    }
  }

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

  // キーワードを入力してエンターを押した
  onKeyWordEnter() {
    console.log("キーワード検索処理");
    this.searchByKeyword(this.keyword);
  }

  searchByKeyword(keyword) {
    // 検索パラメータの作成
    let ps = new URLSearchParams();
    ps.set("keyword", this.keyword);
    // 検索
    this.isLoading = true;
    this.jsonpService.requestGet('IncidentListDataGetByKeyword.php', ps)
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

  // 検索条件非表示
  searchHide(keyword) {
    switch (keyword) {
      case "incidentNo": // インシデント番号
        this.incidentNoShow = false;
        break;
      case "callContent": // 受付内容
        this.callContentShow = false;
        break;
      case "kijoNm": // 機場
        this.kijoNmShow = false;
        break;
      case "setubiNm": // 設備
        this.setubiNmShow = false;
        break;
      case "prefNm": // 都道府県
        this.prefNmShow = false;
        break;
      case "callDate": // 受付日
        this.callDateShow = false;
        break;
      case "incidentType": // インシデント分類
        this.incidentTypeShow = false;
        break;
      case "incidentSts": // ステータス
        this.incidentStsShow = false;
        break;
      case "industryType": // 業種区分
        this.industryTypeShow = false;
        break;
      case "custType": // 顧客分類
        this.custTypeShow = false;
        break;
      case "parentIncidentNo": // 親インシデント番号
        this.parentIncidentNoShow = false;
        break;
      case "incidentStartDateTime": // 発生日時
        this.incidentStartDateTimeShow = false;
        break;
      case "salesDeptNm": // 営業部門
        this.salesDeptNmShow = false;
        break;
      case "salesUserNm": // 営業担当者
        this.salesUserNmShow = false;
        break;
      case "jigyosyutaiNm": // 事業主体
        this.jigyosyutaiNmShow = false;
        break;
      case "custNm": // 顧客
        this.custNmShow = false;
        break;
      case "relateUserNm": // 関係者
        this.relateUserNmShow = false;
        break;
      default:
        break;
    }
  }
  // 検索条件クリア
  searchClear(keyword) {
    switch (keyword) {
      case "all": //　全クリア
        this.checkShowInit(); // 初期化エラーメッセージを表示しない
        this.keyword = "";
        this.incidentNo = "";
        this.callContent = "";
        this.parentIncidentNo = "";
        this.kijoNm = "";
        this.jigyosyutaiNm = "";
        this.setubiNm = "";
        this.custNm = "";
        this.salesDeptNm = "";
        this.salesUserNm = "";
        this.relateUserNm = "";
        this.incidentStartDateTimeFrom = "";
        this.incidentStartDateTimeTo = "";
        this.callStartDateFrom = "";
        this.callStartDateTo = "";
        this.prefNm = null;
        this.incidentTypeSyougai = null;
        this.incidentTypeJiko = null;
        this.incidentTypeClaim = null;
        this.incidentTypeToiawase = null;
        this.incidentTypeInfo = null;
        this.incidentTypeOther = null;
        this.incidentStatusCall = null;
        this.incidentStatusTaio = null;
        this.incidentStatusAct = null;
        this.industryTypeMachinery = null;
        this.industryTypeElectricalMachinery = null;
        this.industryTypeInstrumentation = null;
        this.industryTypeInfo = null;
        this.industryTypeEnvironment = null;
        this.industryTypeWBC = null;
        this.industryTypeOther = null;
        this.custTypeNenkan = null;
        this.custTypeTenken = null;
        this.custTypeNasi = null;
        this.custTypeKasi = null;
        this.custTypeOther = null;
        break;
      case "keyword": // キーワード
        this.keyword = "";
        break;
      case "incidentNo": // インシデント番号
        this.incidentNo = "";
        break;
      case "callContent": // 受付内容
        this.callContent = "";
        break;
      case "kijoNm": // 機場
        this.kijoNm = "";
        break;
      case "setubiNm": // 設備
        this.setubiNm = "";
        break;
      case "prefNm": // 都道府県
        this.prefNm = null;
        break;
      case "callDate": // 受付日
        this.checkDateShowCallStartDateFrom = false; //受付日（FROM）(日付型チェックエラーメッセージ表示Flg)
        this.checkDateShowCallStartDateTo = false; //受付日（TO）(日付型チェックエラーメッセージ表示Flg)
        this.callStartDateFrom = "";
        this.callStartDateTo = "";
        break;
      case "incidentType": // インシデント分類
        this.incidentTypeSyougai = null;
        this.incidentTypeJiko = null;
        this.incidentTypeClaim = null;
        this.incidentTypeToiawase = null;
        this.incidentTypeInfo = null;
        this.incidentTypeOther = null;
        break;
      case "incidentSts": // ステータス
        this.incidentStatusCall = null;
        this.incidentStatusTaio = null;
        this.incidentStatusAct = null;
        break;
      case "industryType": // 業種区分
        this.industryTypeMachinery = null;
        this.industryTypeElectricalMachinery = null;
        this.industryTypeInstrumentation = null;
        this.industryTypeInfo = null;
        this.industryTypeEnvironment = null;
        this.industryTypeWBC = null;
        this.industryTypeOther = null;
        break;
      case "custType": // 顧客分類
        this.custTypeNenkan = null;
        this.custTypeTenken = null;
        this.custTypeNasi = null;
        this.custTypeKasi = null;
        this.custTypeOther = null;
        break;
      case "parentIncidentNo": // 親インシデント番号
        this.parentIncidentNo = "";
        break;
      case "incidentStartDateTime": // 発生日時
        this.checkDateShowIncidentStartDateFrom = false; //発生日時（FROM）(日付型チェックエラーメッセージ表示Flg)
        this.checkDateShowIncidentStartDateTo = false; //発生日時（TO）(日付型チェックエラーメッセージ表示Flg)
        this.incidentStartDateTimeFrom = "";
        this.incidentStartDateTimeTo = "";
        break;
      case "salesDeptNm": // 営業部門
        this.salesDeptNm = "";
        break;
      case "salesUserNm": // 営業担当者
        this.salesUserNm = "";
        break;
      case "jigyosyutaiNm": // 事業主体
        this.jigyosyutaiNm = "";
        break;
      case "custNm": // 顧客
        this.custNm = "";
        break;
      case "relateUserNm": // 関係者
        this.relateUserNm = "";
        break;
      default:
        break;
    }
  }
}