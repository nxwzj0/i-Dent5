import { Component, TemplateRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { URLSearchParams } from '@angular/http';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { JsonpService } from '../jsonp.service';
@Component({
  selector: 'conditionSave-modal',
  templateUrl: './conditionSave.modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ConditionSaveModalComponent {
  @ViewChild('template')
  template;

  // listイベント(親コンポーネントのメソッド呼び出し)
  @Output() conDelButtonshowDelFlg: EventEmitter<any> = new EventEmitter();
  @Output() changeCondition: EventEmitter<any> = new EventEmitter();

  constructor(private route: ActivatedRoute, private jsonpService: JsonpService) { }

  modalRef: BsModalRef;

  hidden_condition = null;
  // モーダル表示
  openModal(condition) {
    if (condition[0]) {
      this.template.show();
      this.hidden_condition = condition;
    }
  }

  condList = [];
  condNm = null;
  userId = null;
  incidentTypeCd = null;
  incidentStsCd = null;
  incidentNo = null;
  callContent = null;
  parentIncidentNo = null;
  incidentStartDateTime = null;
  callDate = null;
  industryTypeCd = null;
  kijoNm = null;
  jigyosyutaiNm = null;
  setubiNm = null;
  prefCd = null;
  custNm = null;
  custTypeCd = null;
  salesDeptNm = null;
  salesUserNm = null;
  relateUserNm = null;

  // 検索項目保存処理
  conditionSave() {
    if (this.condNm == null || this.condNm == "") {
      alert("検索条件名は必須入力。");
      return false;
    }
    if (this.condNm.length > 50) {
      alert("検索条件名の最大文字数は50です。");
      return false;
    }
    if (confirm("検索条件を保存します。よろしいですか？")) {
      this.conditionSaveTrue();
    }
    else {
      window.close();
    }
  }

  // 検索項目保存処理True
  conditionSaveTrue() {

    // 検索パラメータの作成
    let ps = new URLSearchParams();
    ps.set("condNm", this.condNm);

    // 検索条件設定
    // インシデント分類
    ps.set("incidentTypeSyougai", this.hidden_condition[1]);
    ps.set("incidentTypeJiko", this.hidden_condition[2]);
    ps.set("incidentTypeClaim", this.hidden_condition[3]);
    ps.set("incidentTypeToiawase", this.hidden_condition[4]);
    ps.set("incidentTypeInfo", this.hidden_condition[5]);
    ps.set("incidentTypeOther", this.hidden_condition[6]);
    // ステータス
    ps.set("incidentStatusCall", this.hidden_condition[7]);
    ps.set("incidentStatusTaio", this.hidden_condition[8]);
    ps.set("incidentStatusAct", this.hidden_condition[9]);
    // インシデント番号
    ps.set("incidentNo", this.hidden_condition[10]);
    // 受付内容
    ps.set("callContent", this.hidden_condition[11]);
    // 親インシデント番号
    ps.set("parentIncidentNo", this.hidden_condition[12]);
    // 発生日時（開始）
    ps.set("incidentStartDateTimeFrom", this.hidden_condition[13]);
    // 発生日時（終了）
    ps.set("incidentStartDateTimeTo", this.hidden_condition[14]);
    // 受付日（開始）
    ps.set("callStartDateFrom", this.hidden_condition[15]);
    // 受付日（終了）
    ps.set("callStartDateTo", this.hidden_condition[16]);
    // 業種区分
    ps.set("industryTypeMachinery", this.hidden_condition[17]);
    ps.set("industryTypeElectricalMachinery", this.hidden_condition[18]);
    ps.set("industryTypeInstrumentation", this.hidden_condition[19]);
    ps.set("industryTypeInfo", this.hidden_condition[20]);
    ps.set("industryTypeEnvironment", this.hidden_condition[21]);
    ps.set("industryTypeWBC", this.hidden_condition[22]);
    ps.set("industryTypeOther", this.hidden_condition[23]);
    // 機場
    ps.set("kijoNm", this.hidden_condition[24]);
    // 事業主体
    ps.set("jigyosyutaiNm", this.hidden_condition[25]);
    // 設備
    ps.set("setubiNm", this.hidden_condition[26]);
    // 都道府県
    if(this.hidden_condition[27] != 0){
      ps.set("prefCd", this.hidden_condition[27]);
    }
    // 顧客
    ps.set("custNm", this.hidden_condition[28]);
    // 顧客分類
    ps.set("custTypeNenkan", this.hidden_condition[29]);
    ps.set("custTypeTenken", this.hidden_condition[30]);
    ps.set("custTypeNasi", this.hidden_condition[31]);
    ps.set("custTypeKasi", this.hidden_condition[32]);
    ps.set("custTypeOther", this.hidden_condition[33]);
    // 営業部門
    ps.set("salesDeptNm", this.hidden_condition[34]);
    // 営業担当者
    ps.set("salesUserNm", this.hidden_condition[35]);
    // 関係者
    ps.set("relateUserNm", this.hidden_condition[36]);
    // userId
    ps.set("userId", this.hidden_condition[37]);
    // userName
    ps.set("userName", this.hidden_condition[38]);
    // sectionCd
    ps.set("sectionCd", this.hidden_condition[39]);
    // sectionName
    ps.set("sectionName", this.hidden_condition[40]);

    // 検索項目保存
    this.jsonpService.requestGet('IncidentListConditionSave.php', ps)
      .subscribe(
      data => {
        // 通信成功時
        console.log('成功。');
        console.log(data);
        if(data[0]['resultFlg'] == '0'){
          alert(data[0]['resultMsg']);
          this.conDelButtonshowDelFlg.emit({ "showDelFlg": true});
          this.changeCondition.emit(""); // 検索条件が変更された
          this.template.hide();
        }else{
          alert(data[0]['resultMsg']);
        }
      },
      error => {
        // 通信失敗もしくは、コールバック関数内でエラー
        console.log(error);
        console.log('サーバとのアクセスに失敗しました。');
        alert('登録に失敗しました');
        return false;
      }
      );

  }

  // 日付型を日付フォーマット文字列に変更
  getDateStringFromDate(date) {

    if (date && date.getFullYear()) {
      var y:number = date.getFullYear();
      var m:number = date.getMonth();
      m++;
      var d:number = date.getDate();
      return y + "-" + m + "-" + d + " 00:00:00";
    } else {
      // 日付型でない値の場合
      return null;
    }

  }

}