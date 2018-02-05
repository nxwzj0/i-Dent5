import { Component, TemplateRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { URLSearchParams } from '@angular/http';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { JsonpService } from '../jsonp.service';

@Component({
  selector: 'conditionDelete-modal',
  templateUrl: './conditionDelete.modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ConditionDeleteModalComponent {

  @ViewChild('template')
  template;

  // listイベント(親コンポーネントのメソッド呼び出し)
  @Output() conDelButtonshowDelFlg: EventEmitter<any> = new EventEmitter();
  @Output() changeCondition: EventEmitter<any> = new EventEmitter();

  constructor(private route: ActivatedRoute, private jsonpService: JsonpService) {}

  modalRef: BsModalRef;

  condList = [];
  rdoCondId = "";
  showDelFlg = false;
  // モーダル表示
  openModal(condId) {

    // パラメータの作成
    let ps = new URLSearchParams();
    // 検索項目の検索
    this.jsonpService.requestGet('IncidentListConditionDelete.php', ps)
    .subscribe(
    data => {
      if (data[0]) {
        let list = data[0];
        if (list.result !== '' && list.result == true) {
          data = data.slice(1); // 配列1つ目は、サーバ処理成功フラグなので除外
          // 通信成功時
          console.log('成功。');
          console.log(data);
          if (data.length == 0 ) {
            this.showDelFlg = false;
            this.conDelButtonshowDelFlg.emit({ "showDelFlg": this.showDelFlg});
            this.changeCondition.emit(""); // 検索条件が変更された
            this.template.hide();
          } else {
            this.template.show();
            // 画面表示パラメータのセット処理
            this.setDspParam(data);
            if (condId == null || condId == "") {
              this.rdoCondId = data[0].condId;
            } else {
              this.rdoCondId = condId;
            }
            this.showDelFlg = true;
            this.conDelButtonshowDelFlg.emit({ "showDelFlg": this.showDelFlg});
            this.changeCondition.emit(""); // 検索条件が変更された
          }
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

  // 画面表示パラメータのセット処理
  setDspParam(data) {
    this.condList = data;
  }

  // 検索項目削除処理
  conditionDelete() {
    if (confirm("検索条件を削除します。よろしいですか？")) {
      this.conditionDeleteTrue();
    }
    else {
      window.close();
    }
  }

  // 検索項目削除処理True
  conditionDeleteTrue() {

    // 検索パラメータの作成
    let ps = new URLSearchParams();
    ps.set("condId", this.rdoCondId);
    // 検索項目削除
    this.jsonpService.requestGet('IncidentListConditionDeleteRun.php', ps)
      .subscribe(
      data => {
        if (data[0]['resultFlg'] == '0') {
          // 通信成功時
          console.log('成功。');
          alert(data[0]['resultMsg']);
          this.openModal(null);
        }else{
          alert(data[0]['resultMsg']);
        }
      },
      error => {
        // 通信失敗もしくは、コールバック関数内でエラー
        console.log(error);
        console.log('サーバとのアクセスに失敗しました。');
        alert("削除に失敗しました");
        return false;
      }
      );

  }

}