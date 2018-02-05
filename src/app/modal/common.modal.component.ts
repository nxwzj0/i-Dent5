import { Component, TemplateRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { URLSearchParams } from '@angular/http';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'common-modal',
  templateUrl: './common.modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class CommonModalComponent {
  @ViewChild('template')
  template;
  modalRef: BsModalRef;

  // 自作イベント(親コンポーネントのメソッド呼び出し)
  @Output() commonEnter: EventEmitter<any> = new EventEmitter();

  constructor(private modalService: BsModalService) { }

  // モーダル表示
  openModal(headerStr: string, mes: string, enterBtnStr: string, closeBtnStr: string) {
    this.setHeaderStr(headerStr);
    this.setMes(mes);
    this.setEnterBtnStr(enterBtnStr);
    this.setCloseBtnStr(closeBtnStr);
    this.template.show();
  }

  headerStr: string; // モーダルヘッダー文字列
  mes: string; // 表示文字列
  enterBtnStr: string; // 処理ボタンの表示文字列
  closeBtnStr: string; // 閉じるボタンの表示文字列
  enterBtnShow = false; // 処理ボタンの表示フラグ

  // モーダルヘッダー文字列の初期化
  setHeaderStr(headerStr: string) {
    this.headerStr = headerStr;
  }

  // 表示メッセージの初期化
  setMes(mes: string) {
    this.mes = mes;
  }

  // 処理ボタンの表示文字列の初期化
  setEnterBtnStr(btnStr: string) {
    this.enterBtnStr = btnStr;
    if (btnStr) {
      // 処理ボタンの表示文字列がある場合のみ処理ボタンを表示する
      this.enterBtnShow = true;
    } else {
      // 処理ボタン非表示
      this.enterBtnShow = false;
    }
  }

  // 閉じるボタンの表示文字列の初期化
  setCloseBtnStr(btnStr: string) {
    this.closeBtnStr = btnStr;
  }

  // 処理ボタンを押した
  enter() {
    // モーダルを閉じる
    this.template.hide();
    // 親コンポーネントの処理を実行する為に、イベントを発火
    this.commonEnter.emit({});
  }

}