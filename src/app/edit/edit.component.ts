import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { Headers, RequestOptions } from "@angular/http";

// datepikerの設定
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { listLocales } from 'ngx-bootstrap/chronos';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { jaLocale } from 'ngx-bootstrap/locale';

import { JsonpService } from '../jsonp.service';
import { PostService } from '../post.service';
import { LoginService } from '../login.service';
import { Subscription } from 'rxjs/Subscription';

import { environment } from '../../environments/environment.local';

import { LoadingComponent } from "../loading/loading.component";

// datepikerの設定
defineLocale('ja', jaLocale);

@Component({
  selector: 'my-app',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit {
  @ViewChild('sel_incidentType') sel_incidentType;
  @ViewChild('txt_kijoNm') txt_kijoNm;
  @ViewChild('txt_setubiNm') txt_setubiNm;
  @ViewChild('txt_callContent') txt_callContent;
  @ViewChild('myForm') myForm;
  @ViewChild('errorModal') errorModal;

  user;
  subscription: Subscription;
  constructor(private route: ActivatedRoute, private jsonpService: JsonpService, private postService: PostService, private router: Router, private loginService: LoginService, private _localeService: BsLocaleService) {
    /* ログイン情報の取得 */
    this.subscription = loginService.loginUser$.subscribe(
      user => { this.user = user; }
    );
    // datepikerの設定
    this.bsConfig = Object.assign({}, { dateInputFormat: 'YYYY/MM/DD' });
    this._localeService.use(this.locale);
  }

  isLoading: boolean = true;

  ngOnInit() {
    this.route.data.subscribe(obj => console.log(obj['category']));

    let ps = new URLSearchParams();
    let prmIncientId = this.route.snapshot.paramMap.get('incidentId');
    this.incidentId = prmIncientId;
    if (prmIncientId) {
      ps.set('incidentId', prmIncientId);
    }
    // 画面表示パラメータの取得処理
    this.isLoading = true;
    this.jsonpService.requestGet('IncidentDataGet.php', ps)
      .subscribe(
      data => {
        // 通信成功時
        if (data[0]) {
          let one = data[0];
          if (one.result !== '' && one.result == true) {
            // 画面表示パラメータのセット処理
            this.setDspParam(data.slice(1, -1)[0]);

            // 関連リンク 障害対応報告書(MR2) 取得
            this.findMr2List(this.incidentNo);
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

    // 画面表示パラメータ(関連インシデント)の取得処理
    this.jsonpService.requestGet('RelateIncidentGet.php', ps)
      .subscribe(
      data => {
        // 通信成功時
        if (data[0]) {
          let one = data[0];
          let relateIncidentKijoId = data['relateIncidentKijiIdAry'];
          let relateIncidentCustId = data['relateIncidentCustIdAry'];
          if (one.result !== '' && one.result == true) {
            // 画面表示パラメータのセット処理
            this.setDspParamRelateIncident(relateIncidentKijoId, relateIncidentCustId);
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

    // 初期化エラーメッセージを表示しない
    this.checkShowInit();
  }

  ngOnDestroy() {
    // 親サービスDIの影響 メモリリーク防止
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }

  reloadEdit($event) {
    this.checkShowInit(); // 初期化エラーメッセージを表示しない
    this.sel_incidentType.reset(); // インシデント分類CD
    this.txt_kijoNm.reset(); // 機場
    this.txt_setubiNm.reset(); // 設備
    this.txt_callContent.reset(); // 受付内容
  }

  //MR2情報を取得する
  findMr2List(incidentNo) {
    let ps = new URLSearchParams();
    if (incidentNo) {
      ps.set('callNo', incidentNo);
    }

    // 画面表示パラメータの取得処理
    this.isLoading = true;
    this.jsonpService.requestGet('mr2ListDataGet.php', ps)
      .subscribe(
      data => {
        // 通信成功時
        console.log("受付番号成功");
        console.log(data);
        if (data[0]) {
          if (data[0].result !== '' && data[0].result == true) {
            // 画面表示パラメータのセット処理
            let mr2Data = data.slice(1);
            this.setMr2DspParam(mr2Data); // 配列1つ目は、サーバ処理成功フラグなので除外
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

  // 事業主体の初期化
  jigyosyutaiClear() {
    this.jigyosyutaiId = ""; //事業主体ID
    this.jigyosyutaiNm = ""; //事業主体名
  }

  //新しいウィンドウを開く(パターン1)
  // CMN_openNewWindow1(url,name,sizex,sizey,top,left){
  CMN_openNewWindow1(url, name, sizex, sizey) {
    var style = "toolbar=0,location=0,directories=0,status=yes,menubar=0,scrollbars=1,resizable=1," +
      "width=" + sizex + ",height=" + sizey;
    // if( top ){
    // 	style += ",top="+top;
    // }  
    // if( left ){
    // 	style += ",left="+left;
    // }
    var win = window.open(url, name, style);
    if (win) {
      win.focus();
      return win;
    }
  }

  SUB_WIN = null;
  // 関連MR2表示処理
  showMr2(mkbid) {
    if (this.SUB_WIN) this.SUB_WIN.close();
    this.SUB_WIN = this.CMN_openNewWindow1("./#/mr2/" + mkbid, "sub_mr2", 1000, 760);
  }

  // 関連プロジェクト表示処理
  showPj() {
    if (this.SUB_WIN) this.SUB_WIN.close();
    this.SUB_WIN = this.CMN_openNewWindow1("./#/project", "sub_project", 1000, 760);
  }

  // 関連事故クレーム情報表示処理
  showJiko() {
    if (this.SUB_WIN) this.SUB_WIN.close();
    let url = environment.jikoPath + "jiko171211.html"; // 環境に合わせたURLを作成する TODO:固定値
    this.SUB_WIN = this.CMN_openNewWindow1(url, "sub_jiko", 1200, 800);
  }

  // 関連費用決済申請表示処理 TODO:固定値表示
  showHiyo(status, division, idno, bno, system_id, gougi_answer) {

    if (system_id == "") {
      system_id = "1282";
    }

    // var frm = window.document.fm1;
    var strurl;

    strurl = environment.hiyoPath + "wf_main_input.php";
    strurl += "?user_id=ADF";
    strurl += "&authority=9";
    //	strurl += "&system_id=1282";
    strurl += "&system_id=" + system_id;
    strurl += "&status=" + status;
    strurl += "&division=" + division;
    strurl += "&idno=" + idno;
    strurl += "&win_kbn=1";
    if (gougi_answer) strurl += "&gougi_answer_mode=Y";

    strurl += '&unit_flg=';
    strurl += '&main_system_id=';
    strurl += '&main_idno=';
    strurl += '&param1=';
    strurl += '&param2=';
    strurl += '&param3=';
    //	URLにBNOが含まれているかどうか？
    if (bno != "") {
      strurl = strurl.replace("BNO=&", "BNO=" + bno + "&");
    }

    this.SUB_WIN = this.CMN_openNewWindow1(strurl, "WF_EDIT", 1200, 800);
    return;

  }

  // 関連インシデント表示処理
  showRelateIncident(relateIncidentId) {
    if (this.SUB_WIN) this.SUB_WIN.close();
    this.SUB_WIN = this.CMN_openNewWindow1("./#/subDetail/" + relateIncidentId, "sub_detail", 1000, 760);
  }

// ::: 2018.02.02 [#35] 入力補助モーダル　取引先 Add Start newtouch
  // 顧客（取引先）
  onCustomerSearchSelected($event: any) {
    if ($event) {
      this.custId = $event["customerCd"]; // 顧客ID 
      this.custNm = $event["customerNm"]; // 顧客名
    }
  }
// ::: 2018.02.02 [#35] 入力補助モーダル　取引先 Add End   newtouch

  // 親インシデント番号
  onIncidentSearchSelected($event: any) {
    if ($event) {
      this.parentIncidentId = $event["incidentId"]; // 親インシデントID
      this.parentIncidentNo = $event["incidentNo"]; // 親インシデント番号
    }
  }

  // プロジェクト選択
  onProjectSearchSelected($event: any) {
    if ($event) {
      this.deliveryPjId = $event["pjId"]; //納入プロジェクトID
      this.deliveryPjNm = $event["summaryNm"]; //納入プロジェクト名
    }
  }

  //  ユーザ選択
  onSalesUserSelected($event: any) {
    if ($event) {
      switch ($event["userSearchType"]) {
        case 'salesUser':
          this.salesUserId = $event["userId"];
          this.salesUserNm = $event["userNm"];
          this.salesDeptCd = $event["sectionCd"];
          this.salesDeptNm = $event["sectionNm"];
          break;
        case 'skanUser':
          this.skanUserId = $event["userId"];
          this.skanUserNm = $event["userNm"];
          this.skanDeptCd = $event["sectionCd"];
          this.skanDeptNm = $event["sectionNm"];
          break;
        case 'callUser':
          this.callUserId = $event["userId"];
          this.callUserNm = $event["userNm"];
          this.callDeptCd = $event["sectionCd"];
          this.callDeptNm = $event["sectionNm"];
          break;
        case 'taioUser':
          this.taioUserId = $event["userId"];
          this.taioUserNm = $event["userNm"];
          this.taioDeptCd = $event["sectionCd"];
          this.taioDeptNm = $event["sectionNm"];
          break;
        case 'actUser':
          this.actUserId = $event["userId"];
          this.actUserNm = $event["userNm"];
          this.actDeptCd = $event["sectionCd"];
          this.actDeptNm = $event["sectionNm"];
          break;
      }

    }
  }

  // 部門検索
  onSalesSectionSelected($event: any) {
    if ($event) {
      switch ($event["sectionSearchType"]) {
        case 'salesSection':
          this.salesDeptCd = $event["postCd"];
          this.salesDeptNm = $event["sectionNm"];
          break;
        case 'skanSection':
          this.skanDeptCd = $event["postCd"];
          this.skanDeptNm = $event["sectionNm"];
          break;
        case 'callSection':
          this.callDeptCd = $event["postCd"];
          this.callDeptNm = $event["sectionNm"];
          break;
        case 'taioSection':
          this.taioDeptCd = $event["postCd"];
          this.taioDeptNm = $event["sectionNm"];
          break;
        case 'actSection':
          this.actDeptCd = $event["postCd"];
          this.actDeptNm = $event["sectionNm"];
          break;
      }
    }
  }

  // date pikerの設定
  bsValue: Date;
  locale = 'ja';
  locales = listLocales();
  bsConfig: Partial<BsDatepickerConfig>;

  // 時間配列
  timeList = [
    { val: 0, label: "00" }, { val: 1, label: "01" }, { val: 2, label: "02" }, { val: 3, label: "03" }, { val: 4, label: "04" }, { val: 5, label: "05" }, { val: 6, label: "06" }, { val: 7, label: "07" }, { val: 8, label: "08" }, { val: 9, label: "09" }, { val: 10, label: "10" },
    { val: 11, label: "11" }, { val: 12, label: "12" }, { val: 13, label: "13" }, { val: 14, label: "14" }, { val: 15, label: "15" }, { val: 16, label: "16" }, { val: 17, label: "17" }, { val: 18, label: "18" }, { val: 19, label: "19" }, { val: 20, label: "20" },
    { val: 21, label: "21" }, { val: 22, label: "22" }, { val: 23, label: "23" },
  ];
  // 分配列
  miniteList = [
    { val: 0, label: "00" }, { val: 1, label: "01" }, { val: 2, label: "02" }, { val: 3, label: "03" }, { val: 4, label: "04" }, { val: 5, label: "05" }, { val: 6, label: "06" }, { val: 7, label: "07" }, { val: 8, label: "08" }, { val: 9, label: "09" }, { val: 10, label: "10" },
    { val: 11, label: "11" }, { val: 12, label: "12" }, { val: 13, label: "13" }, { val: 14, label: "14" }, { val: 15, label: "15" }, { val: 16, label: "16" }, { val: 17, label: "17" }, { val: 18, label: "18" }, { val: 19, label: "19" }, { val: 20, label: "20" },
    { val: 21, label: "21" }, { val: 22, label: "22" }, { val: 23, label: "23" }, { val: 24, label: "24" }, { val: 25, label: "25" }, { val: 26, label: "26" }, { val: 27, label: "27" }, { val: 28, label: "28" }, { val: 29, label: "29" }, { val: 30, label: "30" },
    { val: 31, label: "31" }, { val: 32, label: "32" }, { val: 33, label: "33" }, { val: 34, label: "34" }, { val: 35, label: "35" }, { val: 36, label: "36" }, { val: 37, label: "37" }, { val: 38, label: "38" }, { val: 39, label: "39" }, { val: 40, label: "40" },
    { val: 41, label: "41" }, { val: 42, label: "42" }, { val: 43, label: "43" }, { val: 44, label: "44" }, { val: 45, label: "45" }, { val: 46, label: "46" }, { val: 47, label: "47" }, { val: 48, label: "48" }, { val: 49, label: "49" }, { val: 50, label: "50" },
    { val: 51, label: "51" }, { val: 52, label: "52" }, { val: 53, label: "53" }, { val: 54, label: "54" }, { val: 55, label: "55" }, { val: 56, label: "56" }, { val: 57, label: "57" }, { val: 58, label: "58" }, { val: 59, label: "59" },
  ];

  // 画面表示パラメータの初期化
  // １－１．ヘッダー
  incidentId = ""; // インシデントID
  incidentNo = ""; // インシデント番号
  incidentStatusCd = ""; // インシデントステータスCD
  incidentStatusNm = ""; // インシデントステータス名
  incidentTypeCd = ""; // インシデント分類CD
  insDate: Date; // 登録日
  insUserNm = ""; // 登録者
  updDate: Date; // 更新日
  updUserNm = ""; // 更新者

  // １－２．メイン情報
  parentIncidentId = ""; // 親インシデントID
  parentIncidentNo = ""; // 親インシデント番号
  incidentStartDate: Date; // 発生日
  incidentStartTime; // 発生時刻(時間)
  incidentStartMinite; // 発生時刻(分)
  industryTypeCd = ""; // 業種区分CD
  infoSourceCd = ""; // 情報提供元CD
  infoSourceNm = ""; // 情報提供元名
  infoProvider = ""; // 情報提供者
  infoProvidedTel = ""; //情報提供TEL  
  relateList = []; // 関係者
  memo = ""; //注記  
  kijoId = ""; //機場ID
  kijoNm = ""; //機場名
  jigyosyutaiId = ""; //事業主体ID
  jigyosyutaiNm = ""; //事業主体名
  setubiId = ""; //設備ID
  setubiNm = ""; //設備名
  prefId = ""; //都道府県ID
  prefNm = ""; //都道府県名
  custId = ""; //顧客ID 
  custNm = ""; //顧客名
  custTypeCd = ""; //顧客分類CD
  custTypeNm = ""; //顧客分類名
  salesDeptCd = ""; //営業部門CD
  salesDeptNm = ""; //営業部門名
  salesUserId = ""; //営業担当者ID
  salesUserNm = ""; //営業担当者名
  deliveryPjId = ""; //納入プロジェクトID
  deliveryPjNm = ""; //納入プロジェクト名
  custDept = ""; //会社名・所属部署
  requester = ""; //依頼者
  contactTel = ""; //連絡先(TEL)
  contactFax = ""; //連絡先(FAX)
  contactMail = ""; //連絡先(E-mail)  
  skanDeptCd = ""; //主管部門CD
  skanDeptNm = ""; //主管部門名
  skanUserId = ""; //主管担当者ID
  skanUserNm = ""; //主管担当者名
  incidentFile: any; // 添付ファイル

  // １－３．受付情報
  callDate: Date; //受付日
  callStartTime; //受付開始時刻(時間)
  callStartMinite; //受付開始時刻(分)
  callEndTime; //受付終了時刻(時間)
  callEndMinite; //受付終了時刻(分)
  callDeptCd = ""; //受付部署CD
  callDeptNm = ""; //受付部署名
  callUserId = ""; //受付者ID
  callUserNm = ""; //受付者名
  callTel = ""; //受付電話番号
  callMail = ""; //受付メール
  callContent = ""; //受付内容

  // １－４．対応情報
  taioDate: Date; //対応日
  taioStartTime; //対応開始時刻(時間)
  taioStartMinite; //対応開始時刻(分)
  taioEndTime; //対応終了時刻(時間)
  taioEndMinite; //対応終了時刻(分)
  taioDeptCd = ""; //対応部署CD
  taioDeptNm = ""; //対応部署名
  taioUserId = ""; //対応者ID
  taioUserNm = ""; //対応者名  
  taioTel = ""; //対応電話番号
  taioMail = ""; //対応メール
  taioContent = ""; //対応内容

  // １－５．処置情報
  actDate: Date; //処置予定日
  actTypeCd = ""; //処置区分CD
  actStartDate; //処置開始日
  actStartTime; //処置開始時刻(時間)
  actStartMinite; //処置開始時刻(分)
  actEndDate; //処置終了日
  actEndTime; //処置終了時刻(時間)
  actEndMinite; //処置終了時刻(分)
  actDeptCd = ""; //処置部署CD
  actDeptNm = ""; //処置部署名
  actUserId = ""; //処置者ID
  actUserNm = ""; //処置者名
  actTel = ""; //処置電話番号
  actMail = ""; //処置メール
  actContent = ""; //処置内容

  // １－６．製品情報
  productTypeCd = ""; //機種区分CD
  productTypeNm = ""; //機種区分名
  productTriggerCd = ""; //障害状況トリガーCD
  productTriggerNm = ""; //障害状況トリガー名
  productHindoCd = ""; //障害状況頻度CD
  productHindoNm = ""; //障害状況頻度名
  productGensyoCd = ""; //障害状況現象CD
  productGensyoNm = ""; //障害状況現象名
  productStatusCd = ""; //障害状況状態CD
  productStatusNm = ""; //障害状況状態名

  // 関連インシデント
  relateIncidentKijoIdList = []; //同一機場インシデント
  relateIncidentCustIdList = []; //同一顧客インシデント

  // 画面表示パラメータのセット処理
  setDspParam(data) {
    // １－１．ヘッダー
    this.incidentNo = data.incidentNo; // インシデント番号
    this.incidentStatusCd = data.incidentStatusCd; // インシデントステータスCD
    this.incidentStatusNm = data.incidentStatusNm; // インシデントステータス名
    this.incidentTypeCd = data.incidentTypeCd // インシデント分類CD
    this.insDate = data.insDate; // 登録日
    this.insUserNm = data.insUserNm // 登録者
    this.updDate = data.updDate; // 更新日
    this.updUserNm = data.updUserNm // 更新者

    // １－２．メイン情報    
    this.parentIncidentId = data.parentIncidentId; // 親インシデントID
    this.parentIncidentNo = data.parentIncidentNo; // 親インシデント番号
    this.incidentStartDate = this.getJsDate(data.incidentStartDateTime); // 発生日
    this.incidentStartTime = this.getHours(this.getJsDate(data.incidentStartDateTime)); // 発生時刻(時間)
    this.incidentStartMinite = this.getMinutes(this.getJsDate(data.incidentStartDateTime)); // 発生時刻(分)
    this.industryTypeCd = data.industryTypeCd; // 業種区分CD
    this.infoSourceCd = data.infoSourceCd; // 情報提供元CD
    this.infoSourceNm = data.infoSourceNm; // 情報提供元名
    this.infoProvider = data.infoProvider; // 情報提供者
    this.infoProvidedTel = data.infoProvidedTel; //情報提供TEL
    this.relateList = data.relateList; //関係者
    this.memo = data.memo; //注記    
    this.kijoId = data.kijoId; //機場ID
    this.kijoNm = data.kijoNm; //機場名
    this.jigyosyutaiId = data.jigyosyutaiId; //事業主体ID
    this.jigyosyutaiNm = data.jigyosyutaiNm; //事業主体名
    this.setubiId = data.setubiId; //設備ID
    this.setubiNm = data.setubiNm; //設備名
    this.prefId = data.prefId; //都道府県ID
    this.prefNm = data.prefNm; //都道府県名
    this.custId = data.custId; //顧客ID
    this.custNm = data.custNm; //顧客名
    this.custTypeCd = data.custTypeCd; //顧客分類CD
    this.custTypeNm = data.custTypeNm; //顧客分類名
    this.salesDeptCd = data.salesDeptCd; //営業部門CD
    this.salesDeptNm = data.salesDeptNm; //営業部門名
    this.salesUserId = data.salesUserId; //営業担当者ID
    this.salesUserNm = data.salesUserNm; //営業担当者名
    this.deliveryPjId = data.deliveryPjId; //納入プロジェクトID
    this.deliveryPjNm = data.deliveryPjNm; //納入プロジェクト名
    this.custDept = data.custDept; //会社名・所属部署
    this.requester = data.requester; //依頼者
    this.contactTel = data.contactTel; //連絡先(TEL)
    this.contactFax = data.contactFax; //連絡先(FAX)
    this.contactMail = data.contactMail; //連絡先(E-mail)
    this.skanDeptCd = data.skanDeptCd; //主管部門CD
    this.skanDeptNm = data.skanDeptNm; //主管部門名
    this.skanUserId = data.skanUserId; //主管担当者CD
    this.skanUserNm = data.skanUserNm; //主管担当者名

    // １－３．受付情報
    this.callDate = this.getJsDate(data.callStartDate); // 受付日
    this.callStartTime = this.getHours(this.getJsDate(data.callStartDate)); // 受付開始時刻(時間)
    this.callStartMinite = this.getMinutes(this.getJsDate(data.callStartDate)); // 受付開始時刻(分)
    this.callEndTime = this.getHours(this.getJsDate(data.callEndDate)); // 受付終了時刻(時間)
    this.callEndMinite = this.getMinutes(this.getJsDate(data.callEndDate)); // 受付終了時刻(分)
    this.callDeptCd = data.callDeptCd; //受付部署CD
    this.callDeptNm = data.callDeptNm; //受付部署名
    this.callUserId = data.callUserId; //受付者ID
    this.callUserNm = data.callUserNm; //受付者名
    this.callTel = data.callTel; //受付電話番号
    this.callMail = data.callMail; //受付メール
    this.callContent = data.callContent; //受付内容

    // １－４．対応情報
    this.taioDate = this.getJsDate(data.taioStartDate); // 対応日
    this.taioStartTime = this.getHours(this.getJsDate(data.taioStartDate)); // 対応開始時刻(時間)
    this.taioStartMinite = this.getMinutes(this.getJsDate(data.taioStartDate)); // 対応開始時刻(分)
    this.taioEndTime = this.getHours(this.getJsDate(data.taioEndDate)); // 対応終了時刻(時間)
    this.taioEndMinite = this.getMinutes(this.getJsDate(data.taioEndDate)); // 対応終了時刻(分)
    this.taioDeptCd = data.taioDeptCd; //対応部署CD
    this.taioDeptNm = data.taioDeptNm; //対応部署名
    this.taioUserId = data.taioUserId; //対応者ID
    this.taioUserNm = data.taioUserNm; //対応者名    
    this.taioTel = data.taioTel; //対応電話番号
    this.taioMail = data.taioMail; //対応メール
    this.taioContent = data.taioContent; //対応内容

    // １－５．処置情報
    this.actDate = this.getJsDate(data.actDate); // 処置予定日
    this.actTypeCd = data.actTypeCd; //処置区分CD
    this.actStartDate = this.getJsDate(data.actStartDateTime); // 処置開始日
    this.actStartTime = this.getHours(this.getJsDate(data.actStartDateTime)); // 処置開始時刻(時間)
    this.actStartMinite = this.getMinutes(this.getJsDate(data.actStartDateTime)); // 処置開始時刻(分)
    this.actEndDate = this.getJsDate(data.actEndDateTime); // 処置終了日
    this.actEndTime = this.getHours(this.getJsDate(data.actEndDateTime)); // 処置終了時刻(時間)
    this.actEndMinite = this.getMinutes(this.getJsDate(data.actEndDateTime)); // 処置終了時刻(分)
    this.actDeptCd = data.actDeptCd; //処置部署CD
    this.actDeptNm = data.actDeptNm; //処置部署名
    this.actUserId = data.actUserId; //処置者ID
    this.actUserNm = data.actUserNm; //処置者名
    this.actTel = data.actTel; //処置電話番号
    this.actMail = data.actMail; //処置メール
    this.actContent = data.actContent; //処置内容

    // １－６．製品情報
    this.productTypeCd = data.productTypeCd; //機種区分CD
    this.productTypeNm = data.productTypeNm; //機種区分名
    this.productTriggerCd = data.productTriggerCd; //障害状況トリガーCD
    this.productTriggerNm = data.productTriggerNm; //障害状況トリガー名
    this.productHindoCd = data.productHindoCd; //障害状況頻度CD
    this.productHindoNm = data.productHindoNm; //障害状況頻度名
    this.productGensyoCd = data.productGensyoCd; //障害状況現象CD
    this.productGensyoNm = data.productGensyoNm; //障害状況現象名
    this.productStatusCd = data.productStatusCd; //障害状況状態CD
    this.productStatusNm = data.productStatusNm; //障害状況状態名

    // ::: 2018.01.26 [#33] インシデント関係者の表示・追加・削除 Add Start newtouch
    this.initRelateUserList(data.relateUserList);
    // ::: 2018.01.26 [#33] インシデント関係者の表示・追加・削除 Add End   newtouch
  }

  // 障害対応報告(MR2)
  MR2List = "" // MR2リスト

  // 画面表示パラメータのセット処理
  setMr2DspParam(data) {
    this.MR2List = data;
  }
  // 画面表示パラメータ(関連インシデント)のセット処理
  setDspParamRelateIncident(relateIncidentKijoId, relateIncidentCustId) {
    this.relateIncidentKijoIdList = relateIncidentKijoId;
    this.relateIncidentCustIdList = relateIncidentCustId;
  }

  checkDateShowincidentStartDate = false; //発生日時(日付型チェック)
  checkDateShowCallDate = false; //受付日(日付型チェック)
  checkRequireShowCallDate = false; //受付日(nullチェック)
  checkDateShowTaioDate = false; //対応日(日付型チェック)
  checkDateShowActDate = false; //処置予定日(日付型チェック)
  checkDateShowActStartDate = false; //処置開始日時（日付）(日付型チェック)
  checkDateShowActEndDate = false; //処置終了日時（日付）(日付型チェック)

  // 日付型値の日付型あるいはnullのチェック
  checkDate() {

    // 初期化エラーメッセージを表示しない
    this.checkShowInit();

    var result = true; // 返り値

    // 発生日時
    var incidentStartDateValue = (<HTMLInputElement>document.getElementById('txt_incidentStartDate')).value;
    var incidentStartDateStr = this.getDateStringFromDate(this.incidentStartDate);
    if (incidentStartDateStr == null && incidentStartDateValue != "") {
      this.checkDateShowincidentStartDate = true;
      result = false;
    }

    // 受付日
    var callDateValue = (<HTMLInputElement>document.getElementById('txt_callDate')).value;
    var callDateStr = this.getDateStringFromDate(this.callDate);
    if (callDateStr == null) {
      if (callDateValue != "") {
        this.checkDateShowCallDate = true;
      } else if (callDateValue == "") {
        this.checkRequireShowCallDate = true;
      }
      result = false;
    }

    // 対応日
    var taioDateValue = (<HTMLInputElement>document.getElementById('txt_taioDate')).value;
    var taioDateStr = this.getDateStringFromDate(this.taioDate);
    if (taioDateStr == null && taioDateValue != "") {
      this.checkDateShowTaioDate = true;
      result = false;
    }

    // 処置予定日
    var actDateValue = (<HTMLInputElement>document.getElementById('txt_actDate')).value;
    var actDateStr = this.getDateStringFromDate(this.actDate);
    if (actDateStr == null && actDateValue != "") {
      this.checkDateShowActDate = true;
      result = false;
    }

    // 処置開始日時（日付）
    var actStartDateValue = (<HTMLInputElement>document.getElementById('txt_actStartDate')).value;
    var actStartDateStr = this.getDateStringFromDate(this.actStartDate);
    if (actStartDateStr == null && actStartDateValue != "") {
      this.checkDateShowActStartDate = true;
      result = false;
    }

    // 処置終了日時（日付）
    var actEndDateValue = (<HTMLInputElement>document.getElementById('txt_actEndDate')).value;
    var actEndDateStr = this.getDateStringFromDate(this.actEndDate);
    if (actEndDateStr == null && actEndDateValue != "") {
      this.checkDateShowActEndDate = true;
      result = false;
    }

    return result;
  }

  // 初期化エラーメッセージを表示しない
  checkShowInit() {
    this.checkDateShowincidentStartDate = false; //発生日時(日付型チェック)
    this.checkDateShowCallDate = false; //受付日(日付型チェック)
    this.checkRequireShowCallDate = false; //受付日(nullチェック)
    this.checkDateShowTaioDate = false; //対応日(日付型チェック)
    this.checkDateShowActDate = false; //処置予定日(日付型チェック)
    this.checkDateShowActStartDate = false; //処置開始日時（日付）(日付型チェック)
    this.checkDateShowActEndDate = false; //処置終了日時（日付）(日付型チェック)
  }

  // インシデント登録処理
  onEntry(event, files: any) {
    if (this.checkDate() && !this.myForm.invalid) {
      console.log('登録処理スタート');

      // // 画面表示パラメータの取得処理
      let ps = new URLSearchParams();
      ps.set('incidentId', this.incidentId);
      ps.set('incidentNo', this.incidentNo);
      ps.set('incidentStatusCd', this.incidentStatusCd);
      ps.set('incidentStatusNm', this.incidentStatusNm);
      ps.set('incidentTypeCd', this.incidentTypeCd);
      // ps.set('insDate', this.insDate);
      ps.set('insUserNm', this.insUserNm);
      // ps.set('updDate', this.updDate);
      ps.set('updUserNm', this.updUserNm);
      ps.set('parentIncidentId', this.parentIncidentId);
      ps.set('parentIncidentNo', this.parentIncidentNo);
      var incidentStartDateStr = this.getDateStringFromDateAndTime(this.incidentStartDate, this.incidentStartTime, this.incidentStartMinite);
      ps.set('incidentStartDate', incidentStartDateStr);
      ps.set('industryTypeCd', this.industryTypeCd);
      ps.set('infoSourceCd', this.infoSourceCd);
      ps.set('infoSourceNm', this.infoSourceNm);
      ps.set('infoProvider', this.infoProvider);
      ps.set('infoProvidedTel', this.infoProvidedTel);
      ps.set('memo', this.memo);
      ps.set('kijoId', this.kijoId);
      ps.set('kijoNm', this.kijoNm);
      ps.set('jigyosyutaiId', this.jigyosyutaiId);
      ps.set('jigyosyutaiNm', this.jigyosyutaiNm);
      ps.set('setubiId', this.setubiId);
      ps.set('setubiNm', this.setubiNm);
      ps.set('prefId', this.prefId);
      ps.set('prefNm', this.prefNm);
      ps.set('custId', this.custId);
      ps.set('custNm', this.custNm);
      ps.set('custTypeCd', this.custTypeCd);
      ps.set('custTypeNm', this.custTypeNm);
      ps.set('salesDeptCd', this.salesDeptCd);
      ps.set('salesDeptNm', this.salesDeptNm);
      ps.set('salesUserId', this.salesUserId);
      ps.set('salesUserNm', this.salesUserNm);
      ps.set('deliveryPjId', this.deliveryPjId);
      ps.set('deliveryPjNm', this.deliveryPjNm);
      ps.set('custDept', this.custDept);
      ps.set('requester', this.requester);
      ps.set('contactTel', this.contactTel);
      ps.set('contactFax', this.contactFax);
      ps.set('contactMail', this.contactMail);
      ps.set('skanDeptCd', this.skanDeptCd);
      ps.set('skanDeptNm', this.skanDeptNm);
      ps.set('skanUserId', this.skanUserId);
      ps.set('skanUserNm', this.skanUserNm);
      ps.set('jigyosyutaiNm', this.jigyosyutaiNm);
      ps.set('jigyosyutaiNm', this.jigyosyutaiNm);
      ps.set('jigyosyutaiNm', this.jigyosyutaiNm);

      var callStartDateStr = this.getDateStringFromDateAndTime(this.callDate, this.callStartTime, this.callStartMinite);
      ps.set('callStartDate', callStartDateStr);
      var callEndDateStr = this.getDateStringFromDateAndTime(this.callDate, this.callEndTime, this.callEndMinite);
      ps.set('callEndDate', callEndDateStr);
      ps.set('callDeptCd', this.callDeptCd);
      ps.set('callDeptNm', this.callDeptNm);
      ps.set('callUserId', this.callUserId);
      ps.set('callUserNm', this.callUserNm);
      ps.set('callTel', this.callTel);
      ps.set('callMail', this.callMail);
      ps.set('callContent', this.callContent);

      var taioStartDateStr = this.getDateStringFromDateAndTime(this.taioDate, this.taioStartTime, this.taioStartMinite);
      ps.set('taioStartDate', taioStartDateStr);
      var taioEndDateStr = this.getDateStringFromDateAndTime(this.taioDate, this.taioEndTime, this.taioEndMinite);
      ps.set('taioEndDate', taioEndDateStr);
      ps.set('taioDeptCd', this.taioDeptCd);
      ps.set('taioDeptNm', this.taioDeptNm);
      ps.set('taioUserId', this.taioUserId);
      ps.set('taioUserNm', this.taioUserNm);
      ps.set('taioTel', this.taioTel);
      ps.set('taioMail', this.taioMail);
      ps.set('taioContent', this.taioContent);

      var actDateStr = this.getDateStringFromDate(this.actDate);
      ps.set('actDate', actDateStr);
      ps.set('actTypeCd', this.actTypeCd);
      var actStartDateStr = this.getDateStringFromDateAndTime(this.actStartDate, this.actStartTime, this.actStartMinite);
      ps.set('actStartDate', actStartDateStr);
      var actEndDateStr = this.getDateStringFromDateAndTime(this.actEndDate, this.actEndTime, this.actEndMinite);
      ps.set('actEndDate', actEndDateStr);
      ps.set('actDeptCd', this.actDeptCd);
      ps.set('actDeptNm', this.actDeptNm);
      ps.set('actUserId', this.actUserId);
      ps.set('actUserNm', this.actUserNm);
      ps.set('actTel', this.actTel);
      ps.set('actMail', this.actMail);
      ps.set('actContent', this.actContent);

      ps.set('productTypeCd', this.productTypeCd);
      ps.set('productTypeNm', this.productTypeNm);
      ps.set('productTriggerCd', this.productTriggerCd);
      ps.set('productTriggerNm', this.productTriggerNm);
      ps.set('productHindoCd', this.productHindoCd);
      ps.set('productHindoNm', this.productHindoNm);
      ps.set('productGensyoCd', this.productGensyoCd);
      ps.set('productGensyoNm', this.productGensyoNm);
      ps.set('productStatusCd', this.productStatusCd);
      ps.set('productStatusNm', this.productStatusNm);

      // 登録処理通信処理
      this.isLoading = true;
      this.jsonpService.requestGet('IncidentEntry.php', ps)
        .subscribe(
        data => {
          // 通信成功時
          console.log(data);
          if (data[0]) {
            let one = data[0];
            if (one.result !== '' && one.result == true) {

              if (!this.incidentId) {
                // 新規登録の場合は、取得したIDを使う
                this.incidentId = data.slice(1)[0].incidentId;
              }

              // ファイルアップロード
              if (files) {
                let file = files[0]; // TODO 1件のみ対応
                if (file) {
                  let data = new FormData();
                  data.append('incidentFile', file, file.name);
                  data.append('incidentId', this.incidentId);

                  let result = this.postService.requestPost('FileUpload.php', data);
                  console.log(result);
                }

              }

              // 画面遷移
              this.router.navigate(['/common', 'インシデント情報を登録しました', '/detail/' + this.incidentId]);

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
    } else {
      // 入力値にエラーが有る
      this.errorModal.openModal('警告', '入力エラーがあります。', '', '閉じる');
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
        return yStr + "-" + mStr + "-" + dStr + " 00:00:00";
      } else {
        // 日付型でない値の場合
        return null;
      }

    } else {
      // 日付型でない値の場合
      return null;
    }
  }

  // Date型から時間を返す
  getHours(date) {
    if (date && date.getFullYear()) {
      var hours: number = date.getHours();
      return hours;
    } else {
      // 日付型でない値の場合
      return null;
    }
  }

  // Date型から分を返す
  getMinutes(date) {
    if (date && date.getFullYear()) {
      var minutes: number = date.getMinutes();
      return minutes;
    } else {
      // 日付型でない値の場合
      return null;
    }
  }

  // 日付と時刻から日付フォーマット文字列を作成
  getDateStringFromDateAndTime(date, time, minite) {
    var timeStr = "00";
    var miniteStr = "00";
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
      if (time) {
        timeStr = ('00' + time).slice(-2);
      }
      if (minite) {
        miniteStr = ('00' + minite).slice(-2);
      }
      if (yStr && mStr && dStr && timeStr && miniteStr) {
        return yStr + "-" + mStr + "-" + dStr + " " + timeStr + ":" + miniteStr + ":00";
      } else {
        // 日付型でない値の場合
        return null;
      }

    } else {
      // 日付型でない値の場合
      return null;
    }
  }

  // インシデント分類セレクト情報
  incidentTypeArray = [
    { label: '障害', value: 1 },
    { label: '事故', value: 2 },
    { label: 'クレーム', value: 3 },
    { label: '問合せ', value: 4 },
    { label: '情報', value: 5 },
    { label: 'その他', value: 6 }
  ];

  // 業種区分セレクト情報
  industryTypeArray = [
    { label: '機械', value: 1 },
    { label: '電機（E）', value: 2 },
    { label: '計装（I）', value: 3 },
    { label: '情報（C）', value: 4 },
    { label: '環境', value: 5 },
    { label: 'WBC', value: 6 },
    { label: 'その他', value: 7 }
  ];

  // 都道府県セレクト情報
  prefArray = [
    { label: '北海道', value: 1 },
    { label: '青森県', value: 2 },
    { label: '岩手県', value: 3 },
    { label: '宮城県', value: 4 },
    { label: '秋田県', value: 5 },
    { label: '山形県', value: 6 },
    { label: '福島県', value: 7 },
    { label: '茨城県', value: 8 },
    { label: '栃木県', value: 9 },
    { label: '群馬県', value: 10 },
    { label: '埼玉県', value: 11 },
    { label: '千葉県', value: 12 },
    { label: '東京都', value: 13 },
    { label: '神奈川県', value: 14 },
    { label: '新潟県', value: 15 },
    { label: '富山県', value: 16 },
    { label: '石川県', value: 17 },
    { label: '福井県', value: 18 },
    { label: '山梨県', value: 19 },
    { label: '長野県', value: 20 },
    { label: '岐阜県', value: 21 },
    { label: '静岡県', value: 22 },
    { label: '愛知県', value: 23 },
    { label: '三重県', value: 24 },
    { label: '滋賀県', value: 25 },
    { label: '京都府', value: 26 },
    { label: '大阪府', value: 27 },
    { label: '兵庫県', value: 28 },
    { label: '奈良県', value: 29 },
    { label: '和歌山県', value: 30 },
    { label: '鳥取県', value: 31 },
    { label: '島根県', value: 32 },
    { label: '岡山県', value: 33 },
    { label: '広島県', value: 34 },
    { label: '山口県', value: 35 },
    { label: '徳島県', value: 36 },
    { label: '香川県', value: 37 },
    { label: '愛媛県', value: 38 },
    { label: '高知県', value: 39 },
    { label: '福岡県', value: 40 },
    { label: '佐賀県', value: 41 },
    { label: '長崎県', value: 42 },
    { label: '熊本県', value: 43 },
    { label: '大分県', value: 44 },
    { label: '宮崎県', value: 45 },
    { label: '鹿児島県', value: 46 },
    { label: '沖縄県', value: 47 },
  ];

  // 顧客分類セレクト情報
  custTypeArray = [
    { label: '年間契約', value: 1 },
    { label: '点検契約', value: 2 },
    { label: '契約なし', value: 3 },
    { label: '瑕疵期間中', value: 4 },
    { label: 'その他', value: 5 },
  ];

  // 情報提供元セレクト情報
  infoSourceArray = [
    { label: '顧客', value: 1 },
    { label: '特約店', value: 2 },
    { label: '営業', value: 3 },
    { label: '技術', value: 4 },
    { label: 'その他', value: 5 },
  ];

  // 機種区分セレクト情報
  productTypeArray = [
    { label: '機種区分１', value: 1 },
    { label: 'etc', value: 2 },
  ];

  // 障害状況トリガーセレクト情報
  productTriggerArray = [
    { label: '通常運用', value: 1 },
    { label: '立上時', value: 2 },
    { label: '立下時', value: 3 },
    { label: '停電', value: 4 },
    { label: '復電', value: 5 },
    { label: 'etc', value: 6 },
  ];

  // 障害状況頻度セレクト情報
  productHindoArray = [
    { label: '常時', value: 1 },
    { label: '不定期', value: 2 },
    { label: '間欠的', value: 3 },
    { label: 'その他', value: 4 },
    { label: 'etc', value: 5 },
  ];

  // 障害状況現象セレクト情報
  productGensyoArray = [
    { label: '運転不能', value: 1 },
    { label: '停止不能', value: 2 },
    { label: '動作異常', value: 3 },
    { label: '操作不能', value: 4 },
    { label: 'etc', value: 5 },
  ];

  // 障害状況状態セレクト情報
  productStatusArray = [
    { label: 'システムダウン', value: 1 },
    { label: '電源断', value: 2 },
    { label: '機器・装置故障', value: 2 },
    { label: '部品故障', value: 2 },
    { label: 'etc', value: 2 },
  ];

  // 処置区分セレクト情報
  actTypeArray = [
    { label: '出動', value: 1 },
    { label: '電話対応', value: 2 },
    { label: 'その他', value: 3 },
  ];

  // ::: 2018.01.30 [#33] インシデント関係者の表示・追加・削除 Add Start newtouch

  // インシデント情報 
  relateUserList = [];

  // それが空であるかどうかを判断する
  isEmpty(str: any) {
    return str == null || str == undefined || str == "" ? true : false;
  }

  // インシデント関係者 
  initRelateUserList(relateUserArray: Array<any>) {
    this.relateUserList = [];
    let length = relateUserArray.length;
    if (relateUserArray.length > 0) {
      for (let i = 0; i < length; i++) {
        let sectionObj = {};
        let section = relateUserArray[i];
        if (!this.isEmpty(section.relateUserSectionCd)) {
          if (this.isDeptExist(section.relateUserSectionCd, section.relateUserSectionNm) != -1) {
            continue;
          }
          sectionObj["relateUserSectionCd"] = section.relateUserSectionCd;
          sectionObj["relateUserSectionNm"] = section.relateUserSectionNm;

          let userList = [];

          for (let j = 0; j < length; j++) {
            let userObj = {};
            let user = relateUserArray[j];
            if (!this.isEmpty(user.relateUserId)) {
              if (user.relateUserSectionCd == section.relateUserSectionCd && user.relateUserSectionNm == section.relateUserSectionNm) {
                userObj["relateId"] = user.relateId;
                userObj["relateUserId"] = user.relateUserId;
                userObj["relateUserNm"] = user.relateUserNm;
                userObj["kidokuDate"] = user.kidokuDate;
                userList.push(userObj);
              }
            }
          }

          sectionObj["relateUsers"] = userList;
          this.relateUserList.push(sectionObj);
        }
      }
    }
  }

  // 部門が既に存在するかどうかを判断する
  isDeptExist(targetCd: any, targetNm: any) {
    var index = -1;
    for (var i = 0; i < this.relateUserList.length; i++) {
      var tmpCd = this.relateUserList[i].relateUserSectionCd.toString();
      var tmpNm = this.relateUserList[i].relateUserSectionNm.toString();

      if (tmpCd == targetCd.toString() && tmpNm == targetNm.toString()) {
        index = i;
      }
    }
    return index;
  }
  // ::: 2018.01.30 [#33] インシデント関係者の表示・追加・削除 Add End   newtouch

  // 初期化設定()
  reset(keyword) {
    switch (keyword) {
      case "all":
        // 初期化エラーメッセージを表示しない
        this.checkShowInit();
        break;
      default:
        break;
    }
  }
}