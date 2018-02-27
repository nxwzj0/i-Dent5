import { Component, TemplateRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { URLSearchParams } from '@angular/http';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'btn-modal',
  templateUrl: './btn.modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class BtnModalComponent {
  @ViewChild('template')
  template;
  modalRef: BsModalRef;

  // 自作イベント(親コンポーネントのメソッド呼び出し)
  @Output() commonEnter1: EventEmitter<any> = new EventEmitter();
  @Output() commonEnter2: EventEmitter<any> = new EventEmitter();
  @Output() commonClose: EventEmitter<any> = new EventEmitter();

  constructor(private modalService: BsModalService) { }

  // モーダル表示
  openModal(headerStr: string, mes: string, enterBtn1Str: string, enterBtn2Str: string, closeBtnStr: string) {
    this.setHeaderStr(headerStr);
    this.setMes(mes);
    this.setEnterBtn1Str(enterBtn1Str);
    this.setEnterBtn2Str(enterBtn2Str);
    this.setCloseBtnStr(closeBtnStr);
    this.template.show();
  }

  headerStr: string; // モーダルヘッダー文字列
  mes: string; // 表示文字列
  enterBtn1Str: string; // 処理ボタンの表示文字列
  enterBtn2Str: string; // 処理ボタンの表示文字列
  closeBtnStr: string; // 閉じるボタンの表示文字列
  enterBtn1Show = false; // 処理ボタンの表示フラグ
  enterBtn2Show = false; // 処理ボタンの表示フラグ

  // モーダルヘッダー文字列の初期化
  setHeaderStr(headerStr: string) {
    this.headerStr = headerStr;
  }

  // 表示メッセージの初期化
  setMes(mes: string) {
    this.mes = mes;
  }

  // 処理ボタンの表示文字列の初期化
  setEnterBtn1Str(btnStr: string) {
    this.enterBtn1Str = btnStr;
    if (btnStr) {
      // 処理ボタンの表示文字列がある場合のみ処理ボタンを表示する
      this.enterBtn1Show = true;
    } else {
      // 処理ボタン非表示
      this.enterBtn1Show = false;
    }
  }

  // 処理ボタンの表示文字列の初期化
  setEnterBtn2Str(btnStr: string) {
    this.enterBtn2Str = btnStr;
    if (btnStr) {
      // 処理ボタンの表示文字列がある場合のみ処理ボタンを表示する
      this.enterBtn2Show = true;
    } else {
      // 処理ボタン非表示
      this.enterBtn2Show = false;
    }
  }

  // 閉じるボタンの表示文字列の初期化
  setCloseBtnStr(btnStr: string) {
    this.closeBtnStr = btnStr;
  }

  // 処理ボタン1を押した
  enter1() {
    // モーダルを閉じる
    this.template.hide();
    // 親コンポーネントの処理を実行する為に、イベントを発火
    this.commonEnter1.emit({});
  }

  // 処理ボタン2を押した
  enter2() {
    // モーダルを閉じる
    this.template.hide();
    // 親コンポーネントの処理を実行する為に、イベントを発火
    this.commonEnter2.emit({});
  }

  // 閉じるボタンを押した
  close() {
    // モーダルを閉じる
    this.template.hide();
    // 親コンポーネントの処理を実行する為に、イベントを発火
    this.commonClose.emit({});
  }

}