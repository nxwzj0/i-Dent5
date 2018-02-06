import { Component, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { URLSearchParams } from '@angular/http';

import { JsonpService } from '../jsonp.service';

import { environment } from '../../environments/environment.local';

import { LoadingComponent } from "../loading/loading.component";

@Component({
  selector: 'my-app',
  templateUrl: './subDetail.component.html',
  styleUrls: ['./subDetail.component.css']
})
export class SubDetailComponent implements OnInit {
  @ViewChild('common') common;
  @ViewChild('relateUser') relateUser;

  constructor(private route: ActivatedRoute, private jsonpService: JsonpService) { }

  isLoading: boolean = true;

  userId = "";
  userName = "";
  sectionCd = "";
  sectionName = "";

  ngOnInit() {
    this.route.data.subscribe(obj => console.log(obj['category']));
    // ログイン情報設定
    this.userId = "999";
    this.userName = "NARUTO";
    this.sectionCd = "999";
    this.sectionName = "KUNOHA";

    let ps = new URLSearchParams();
    let prmIncientId = this.route.snapshot.paramMap.get('incidentId');
    if (prmIncientId) {
      this.pageIncidentId = prmIncientId;
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
            this.setDspParam(data.slice(1,-1)[0]);

            // 変更履歴パラメータのセット処理
            this.setChangeRev(data.slice(2)[0]);

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
          this.setDspParamRelateIncident(relateIncidentKijoId,relateIncidentCustId);
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

  // 画面表示パラメータの初期化
  // １．メインパネル
  // １－１．ヘッダー
  incidentId: string; // インシデントID
  incidentNo = ""; // インシデント番号
  incidentStatusCd = ""; // インシデントステータスCD
  incidentStatusNm = ""; // インシデントステータス名
  incidentTypeCd = ""; // インシデント分類CD
  incidentTypeNm = ""; // インシデント分類名
  insDate = ""; // 登録日
  insUserNm = ""; // 登録者
  updDate = "" // 更新日
  updUserNm = ""; // 更新者

  // １－２．メイン情報
  parentIncidentNo = ""; // 親インシデント番号
  incidentStartDateTime = ""; // 発生日時
  industryTypeNm = ""; // 業種区分名
  infoSourceCd = ""; // 情報提供元CD
  infoSourceNm = ""; // 情報提供元名
  infoProvider = ""; // 情報提供者
  infoProvidedTel = ""; //情報提供TEL  
  relateList = []; // 関係者
  memo = ""; //注記  
  kijoNm = ""; //機場名
  jigyosyutaiNm = ""; //事業主体名
  setubiNm = ""; //設備名
  prefNm = ""; //都道府県名
  custNm = ""; //顧客名
  custTypeNm = ""; //顧客分類名
  salesDeptCd = ""; //営業部門CD
  salesDeptNm = ""; //営業部門名
  salesUserId = ""; //営業担当者ID
  salesUserNm = ""; //営業担当者名
  deliveryPjNm = ""; //納入プロジェクト
  custDept = ""; //会社名・所属部署
  requester = ""; //依頼者
  contactTel = ""; //連絡先(TEL)
  contactFax = ""; //連絡先(FAX)
  contactMail = ""; //連絡先(E-mail)  
  skanDeptCd = ""; //主管部門CD
  skanDeptNm = ""; //主管部門名
  skanUserId = ""; //主管担当者ID
  skanUserNm = ""; //主管担当者名

  // １－３．受付情報
  callDate = ""; //受付日
  callStartDate = ""; //受付開始時刻
  callEndDate = ""; //受付終了時刻
  callDeptCd = ""; //受付部署CD
  callDeptNm = ""; //受付部署名
  callUserId = ""; //受付者ID
  callUserNm = ""; //受付者名
  callTel = ""; //受付電話番号
  callMail = ""; //受付メール
  callContent = ""; //受付内容

  // １－４．対応情報
  taioDate = ""; //対応日
  taioStartDate = ""; //対応開始時刻
  taioEndDate = ""; //対応終了時刻
  taioDeptCd = ""; //対応部署CD
  taioDeptNm = ""; //対応部署名
  taioUserId = ""; //対応者ID
  taioUserNm = ""; //対応者名  
  taioTel = ""; //対応電話番号
  taioMail = ""; //対応メール
  taioContent = ""; //対応内容

  // １－５．処置情報
  actDate = ""; //処置予定日
  actTypeNm = ""; //処置区分名
  actStartDateTime = ""; //処置開始日時
  actEndDateTime = ""; //処置終了日時
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
    this.incidentId = data.incidentId; // インシデントID
    this.incidentNo = data.incidentNo; // インシデント番号
    this.incidentStatusCd = data.incidentStatusCd; // インシデントステータスCD
    this.incidentStatusNm = data.incidentStatusNm; // インシデントステータス名
    this.incidentTypeCd = data.incidentTypeCd // インシデント分類CD
    this.incidentTypeNm = data.incidentTypeNm // インシデント分類名
    this.insDate = data.insDate // 登録日
    this.insUserNm = data.insUserNm // 登録者
    this.updDate = data.updDate // 更新日
    this.updUserNm = data.updUserNm // 更新者

    // １－２．メイン情報    
    this.parentIncidentNo = data.parentIncidentNo; // 親インシデント番号
    this.incidentStartDateTime = data.incidentStartDateTime; // 発生日時
    this.industryTypeNm = data.industryTypeNm; // 業種区分名
    this.infoSourceCd = data.infoSourceCd; // 情報提供元CD
    this.infoSourceNm = data.infoSourceNm; // 情報提供元名
    this.infoProvider = data.infoProvider; // 情報提供者
    this.infoProvidedTel = data.infoProvidedTel; //情報提供TEL
    this.relateList = data.relateList; //関係者
    this.memo = data.memo; //注記    
    this.kijoNm = data.kijoNm; //機場名
    this.jigyosyutaiNm = data.jigyosyutaiNm; //事業主体名
    this.setubiNm = data.setubiNm; //設備名
    this.prefNm = data.prefNm; //都道府県名
    this.custNm = data.custNm; //顧客名
    this.custTypeNm = data.custTypeNm; //顧客分類名
    this.salesDeptCd = data.salesDeptCd; //営業部門CD
    this.salesDeptNm = data.salesDeptNm; //営業部門名
    this.salesUserId = data.salesUserId; //営業担当者ID
    this.salesUserNm = data.salesUserNm; //営業担当者名
    this.deliveryPjNm = data.deliveryPjNm; //納入プロジェクト
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
    this.callDate = data.callDate; //受付日
    this.callStartDate = data.callStartDate; //受付開始時刻
    this.callEndDate = data.callEndDate; //受付終了時刻
    this.callDeptCd = data.callDeptCd; //受付部署CD
    this.callDeptNm = data.callDeptNm; //受付部署名
    this.callUserId = data.callUserId; //受付者ID
    this.callUserNm = data.callUserNm; //受付者名
    this.callTel = data.callTel; //受付電話番号
    this.callMail = data.callMail; //受付メール
    this.callContent = data.callContent; //受付内容

    // １－４．対応情報
    this.taioDate = data.taioDate; //対応日
    this.taioStartDate = data.taioStartDate; //対応開始時刻
    this.taioEndDate = data.taioEndDate; //対応終了時刻
    this.taioDeptCd = data.taioDeptCd; //対応部署CD
    this.taioDeptNm = data.taioDeptNm; //対応部署名
    this.taioUserId = data.taioUserId; //対応者ID
    this.taioUserNm = data.taioUserNm; //対応者名    
    this.taioTel = data.taioTel; //対応電話番号
    this.taioMail = data.taioMail; //対応メール
    this.taioContent = data.taioContent; //対応内容

    // １－５．処置情報
    this.actDate = data.actDate; //処置予定日
    this.actTypeNm = data.actTypeNm; //処置区分名
    this.actStartDateTime = data.actStartDateTime; //処置開始日時
    this.actEndDateTime = data.actEndDateTime; //処置終了日時
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

    this.initRelateUserList(data.relateUserList);

  }

  // 画面表示パラメータ(関連インシデント)のセット処理
  setDspParamRelateIncident(relateIncidentKijoId,relateIncidentCustId) {
    this.relateIncidentKijoIdList = relateIncidentKijoId;
    this.relateIncidentCustIdList = relateIncidentCustId;
  }

  // ２ー２．障害対応報告(MR2)
  MR2List = "" // MR2リスト

  // 画面表示パラメータのセット処理
  setMr2DspParam(data) {
    this.MR2List = data;
  }

  // 変更履歴パラメータのセット処理
  setChangeRev(data) {
    this.chanegeRev = data;
  }

  /**
   * 以下、削除予定の固定値
   * 
   */

  // ２．関連リンク
  // ２ー１．プロジェクト情報
  PJNo = ""; // プロジェクト番号
  PJRespDept = ""; // PJ主管部門
  PJName = ""; // プロジェクト名
  PJManager = ""; // PM
  PJKijo = ""; // 代表機場
  PJPref = ""; // 都道府県

  // ２ー２．障害対応報告(MR2)
  MR2Title = ""; // 件名
  MR2MakeDate = ""; // 作成日
  MR2Iraimoto = ""; // 依頼元
  MR2WorkRep = ""; // 作業担当者

  // ２ー３．労災・事故・クレーム連絡
  rjcStatus = ""; // 状態
  rjcType = ""; // 区分
  rjcOverView = ""; // 概要
  rjcCustName = ""; // 顧客名
  rjcKijoName = ""; // 機場名
  rjcHakkoDate = ""; // 発行日
  rjcHakkomoto = ""; // 発行元

  // ２－４．費用決済申請
  hiyoHakkomoto = ""; // 発行元
  hiyoStatus = ""; // ステータス
  hiyoType = ""; // 区分
  hiyoNo = ""; // 決裁番号
  hiyoTitle = ""; // 件名
  hiyoAmount = ""; // 概算金額

  // ３．関連インシデント
  // ３－１．同一機場インシデント
  sameKijoIncidents = ""; // 配列で保持

  // ３－２．同一顧客インシデント
  sameCustIncidents = ""; // 配列で保持

  // ４．変更履歴
  chanegeRev = ""; // 配列で保持

  pageIncidentId;

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

  // インシデント関係者 
  findRelateUser() {
    let ps = new URLSearchParams();
    ps.set('incidentId', this.pageIncidentId);

    // 画面表示パラメータの取得処理
    this.jsonpService.requestGet('IncidentDataGet.php', ps)
      .subscribe(
      data => {
        // 通信成功時
        if (data[0]) {
          let one = data[0];
          if (one.result !== '' && one.result == true) {
            // 画面表示パラメータのセット処理
            this.initRelateUserList(data.slice(1,-1)[0].relateUserList);
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

  // インシデント情報 
  relateUserList = [];

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

  // 現在のページを閉じる
  windowClose(){
    window.close();
  }

}