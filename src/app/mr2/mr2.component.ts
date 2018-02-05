import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { URLSearchParams } from '@angular/http';

import { JsonpService } from '../jsonp.service';
import { WindowRefService } from '../windowRef.service';
import { LoadingComponent } from "../loading/loading.component";

@Component({
  selector: 'my-mr2',
  templateUrl: './mr2.component.html',
  styleUrls: ['./mr2.component.css']
})
export class Mr2Component implements OnInit {

  nativeWindow: any;
  constructor(private route: ActivatedRoute, private jsonpService: JsonpService, private winRef: WindowRefService) {
    this.nativeWindow = winRef.getNativeWindow();
  }

  isLoading: boolean = true;
  mr2Data = [];

  ngOnInit() {

    this.route.data.subscribe(obj => console.log(obj['category']));

    let ps = new URLSearchParams();
    let mkbId = this.route.snapshot.paramMap.get('mkbId');
    if (mkbId) {
      ps.set('mkbId', mkbId);
    }

    // 画面表示パラメータの取得処理
    this.isLoading = true;
    this.jsonpService.requestGet('mr2DataGet.php', ps)
      .subscribe(
      data => {
        console.log("MR2成功");
        console.log(data);
        // 通信成功時
        if (data[0]) {
          if (data[0].result !== '' && data[0].result == true) {
            // 画面表示パラメータのセット処理
            let mr2Data = data.slice(1);
            this.setDspParam(mr2Data[0]); // 配列1つ目は、サーバ処理成功フラグなので除外
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

  // 画面表示パラメータの初期化
  // 基本情報
  updDateDsp = ""; // 最終更新日
  updUserNmDsp = ""; // 最終更新ユーザー
  incidentNo = ""; // 受付番号
  actionCnt = ""; // 出動回数
  PjId = ""; // PJ番号
  custNm = ""; // 顧客名
  kijoNm = ""; // 機場
  makeDate = ""; // 作成日
  callDate = ""; // 受付日
  startDate = ""; // 障害発生日
  actSectionNm = ""; // 処理担当部署
  checkSectionNm = ""; // 検査責任部署
  checkUserNm = ""; // 検査責任者
  requestSectionNm = ""; // 御依頼元担当部署
  requestUserNm = ""; // 御依頼元担当者
  workUserNm = ""; // 作業担当者
  issSectionNm = ""; // 発行部署
  mr2StsNm = ""; // MR2状況

  // 行動記録
  goDate = ""; // 出発日
  arrivalDate = ""; // 到着日
  workStartDate = ""; // 作業開始日
  workEndDate = ""; // 作業終了日
  retuenDate = ""; // 現地出発日
  arrivalBackDate = ""; // 帰着日

  // 作業情報
  subjectNm = ""; // 件名
  setubiNm = ""; // 設備名
  triggerDsp = ""; // トリガー
  hindoDsp = ""; // 頻度
  gensyoDsp = ""; // 現象
  jyotaiDsp = ""; // 状態
  defectComment = ""; // 不具合状況
  setubiStop = ""; // 設備停止
  dataDefect = ""; // データ欠損
  setubiComment = ""; // 設備影響
  researchComment = ""; // 調査内容
  genin = ""; // 原因特定
  geninComment = ""; // 原因
  actSyotiNm = ""; // 処置方法
  actSyotiYoboDsp = ""; // 顧客要望
  actionTaisakuDt = ""; // 対策期限
  actionSonotaComm = ""; // その他コメント
  actComment = ""; // 処置
  kekka = ""; // 復旧状況
  kekkaComment = ""; // 結果
  taisyoKikiNm = ""; // 対象機器名称
  banMeiKigou = ""; // 盤名称・記号
  goodsSyoriNm = ""; // 物品処理
  setPlaceNm = ""; // 設置場所
  goodsPayNm = ""; // 部品払出
  payDate = ""; // 払出日
  repayDate = ""; // 返却日
  slipNo = ""; // 伝票番号
  finalCheckPassNm = ""; // 最終検査
  finalCheckDetNm = ""; // 最終検査内容

  // お客様入力欄
  thisTimeWorkNm = ""; // 今回の作業について
  custComment = ""; // お客様コメント

  // 社内向け入力欄
  supSotiSortNm = ""; // 対象機種区分
  supKisyuKbnNm = ""; // 対象機種区分
  seisakuMaker = ""; // 製作メーカ
  sekouMaker = ""; // 施工メーカ
  hosyuKeiyakuUmuNm = ""; // 保守契約
  hosyuKeiyakuNm = ""; // 保守契約(種類)
  kakuninMethNm = ""; // 確認方法
  failureRankNm = ""; // 障害ランク
  geninSortDsp = ""; // 原因分類
  koukaiNm = ""; // 社外公開
  syanaiMessage = ""; // 社内向け連絡事項・補足・備考欄

  // 改善情報
  kaizen = ""; // 改善情報

  // 対象CAN
  targetCan1 = ""; // 対象CAN1
  targetCan2 = ""; // 対象CAN2
  targetCan3 = ""; // 対象CAN3
  targetCan4 = ""; // 対象CAN4
  targetCan5 = ""; // 対象CAN5

  // 画面表示パラメータのセット処理
  setDspParam(data) {
    // 最終更新日・最終更新ユーザー
    this.updDateDsp = data.updDateDsp;
    this.updUserNmDsp = data.updUserNmDsp;

    // 基本情報
    this.incidentNo = data.incidentNo;
    this.actionCnt = data.actionCnt;
    this.PjId = data.PjId;
    this.custNm = data.custNm;
    this.kijoNm = data.kijoNm;
    this.makeDate = data.makeDate;
    this.callDate = data.callDate;
    this.startDate = data.startDate;
    this.actSectionNm = data.actSectionNm;
    this.checkSectionNm = data.checkSectionNm;
    this.checkUserNm = data.checkUserNm;
    this.requestSectionNm = data.requestSectionNm;
    this.requestUserNm = data.requestUserNm;
    this.workUserNm = data.workUserNm;
    this.issSectionNm = data.issSectionNm;
    this.mr2StsNm = data.mr2StsNm;

    // 行動記録
    this.goDate = data.goDate;
    this.arrivalDate = data.arrivalDate;
    this.workStartDate = data.workStartDate;
    this.workEndDate = data.workEndDate;
    this.retuenDate = data.retuenDate;
    this.arrivalBackDate = data.arrivalBackDate;

    // 作業情報
    this.subjectNm = data.subjectNm;
    this.setubiNm = data.setubiNm;
    this.triggerDsp = data.triggerDsp;
    this.hindoDsp = data.hindoDsp;
    this.gensyoDsp = data.gensyoDsp;
    this.jyotaiDsp = data.jyotaiDsp;
    this.defectComment = data.defectComment;
    this.setubiStop = data.setubiStop;
    this.dataDefect = data.dataDefect;
    this.setubiComment = data.setubiComment;
    this.researchComment = data.researchComment;
    this.genin = data.genin;
    this.geninComment = data.geninComment;
    this.actSyotiNm = data.actSyotiNm;
    this.actSyotiYoboDsp = data.actSyotiYoboDsp;
    this.actionTaisakuDt = data.actionTaisakuDt;
    this.actionSonotaComm = data.actionSonotaComm;
    this.actComment = data.actComment;
    this.kekka = data.kekka;
    this.kekkaComment = data.kekkaComment;
    this.taisyoKikiNm = data.taisyoKikiNm;
    this.banMeiKigou = data.banMeiKigou;
    this.goodsSyoriNm = data.goodsSyoriNm;
    this.setPlaceNm = data.setPlaceNm;
    this.goodsPayNm = data.goodsPayNm;
    this.payDate = data.payDate;
    this.repayDate = data.repayDate;
    this.slipNo = data.slipNo;
    this.finalCheckPassNm = data.finalCheckPassNm;
    this.finalCheckDetNm = data.finalCheckDetNm;

    // お客様入力欄
    this.thisTimeWorkNm = data.thisTimeWorkNm;
    this.custComment = data.custComment;

    // 社内向け入力欄
    this.supSotiSortNm = data.supSotiSortNm;
    this.supKisyuKbnNm = data.supKisyuKbnNm;
    this.seisakuMaker = data.seisakuMaker;
    this.sekouMaker = data.sekouMaker;
    this.hosyuKeiyakuUmuNm = data.hosyuKeiyakuUmuNm;
    this.hosyuKeiyakuNm = data.hosyuKeiyakuNm;
    this.kakuninMethNm = data.kakuninMethNm;
    this.failureRankNm = data.failureRankNm;
    this.geninSortDsp = data.geninSortDsp;
    this.koukaiNm = data.koukaiNm;
    this.syanaiMessage = data.syanaiMessage;

    // 改善情報
    this.kaizen = data.kaizen;

    // 対象CAN
    this.targetCan1 = data.targetCan1;
    this.targetCan2 = data.targetCan2;
    this.targetCan3 = data.targetCan3;
    this.targetCan4 = data.targetCan4;
    this.targetCan5 = data.targetCan5;

  }

}