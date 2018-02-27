import { Component, TemplateRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { URLSearchParams } from '@angular/http';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { JsonpService } from '../jsonp.service';
import { LoginService } from '../login.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'conditionDelete-modal',
  templateUrl: './conditionDelete.modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ConditionDeleteModalComponent {
  @ViewChild('template') template;
  @ViewChild('common') common;
  @ViewChild('alertCommon') alertCommon;

  // listイベント(親コンポーネントのメソッド呼び出し)
  @Output() conDelButtonshowDelFlg: EventEmitter<any> = new EventEmitter();
  @Output() changeCondition: EventEmitter<any> = new EventEmitter();

  userId;
  userNm;
  userSectionCd;
  userSectionNm;
  subscription: Subscription;
  constructor(private route: ActivatedRoute, private jsonpService: JsonpService, private loginService: LoginService) {
    /* ログイン情報の取得 */
    this.subscription = loginService.loginUserNm$.subscribe(user => { this.userNm = user; });
    this.subscription = loginService.loginUserId$.subscribe(user => { this.userId = user; });
    this.subscription = loginService.loginUserSectionCd$.subscribe(user => { this.userSectionCd = user; });
    this.subscription = loginService.loginUserSectionNm$.subscribe(user => { this.userSectionNm = user; });
  }

  modalRef: BsModalRef;

  condList = [];
  rdoCondId = "";
  showDelFlg = false;
  // モーダル表示
  openModal(condId) {

    // パラメータの作成
    let ps = new URLSearchParams();
    // ログイン情報設定
    ps.set('userId', this.userId);
    ps.set('userName', this.userNm);
    ps.set('sectionCd', this.userSectionCd);
    ps.set('sectionName', this.userSectionNm);

    // 検索項目の検索
    this.jsonpService.requestGet('IncidentListConditionGet.php', ps)
      .subscribe(
      data => {
        if (data[0]) {
          let list = data[0];
          if (list.result !== '' && list.result == true) {
            data = data.slice(1); // 配列1つ目は、サーバ処理成功フラグなので除外
            // 通信成功時
            if (data.length == 0) {
              this.showDelFlg = false;
              this.conDelButtonshowDelFlg.emit({ "showDelFlg": this.showDelFlg });
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
              this.conDelButtonshowDelFlg.emit({ "showDelFlg": this.showDelFlg });
              this.changeCondition.emit(""); // 検索条件が変更された
            }
          }
        }
      },
      error => {
        // 通信失敗もしくは、コールバック関数内でエラー
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
    this.common.openModal('確認', '検索条件を削除します。宜しいですか？', 'OK', 'キャンセル');
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
          this.common.openModal('削除完了', data[0]['resultMsg'], '', '閉じる');
          this.openModal(null);
        } else {
          this.common.openModal('', data[0]['resultMsg'], '', '閉じる');
        }
      },
      error => {
        // 通信失敗もしくは、コールバック関数内でエラー
        console.log('サーバとのアクセスに失敗しました。');
        this.common.openModal('', '削除に失敗しました', '', '閉じる');
        return false;
      }
      );

  }

  // 検索項目削除処理False
  conditionDeleteFalse() {
    this.template.close();
  }

}