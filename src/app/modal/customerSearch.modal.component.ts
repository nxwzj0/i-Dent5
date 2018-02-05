import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { URLSearchParams } from '@angular/http';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { JsonpService } from '../jsonp.service';

import { LoadingComponent } from "../loading/loading.component";

@Component({
  selector: 'customerSearch-modal',
  templateUrl: './customerSearch.modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class CustomerSearchModalComponent {
  @ViewChild('template')
  template;

  modalRef: BsModalRef;

  constructor(private modalService: BsModalService) { }

  isLoading: boolean = false;

  // 検索条件
  searchCustomerNm = "";
  searchCustomerCd = "";

  // ページングの設定
  maxSize: number = 5;
  bigTotalItems: number = 100;
  bigCurrentPage: number = 1;
  numPages: number = 0;
  itemsPerPage: number = 10;

  // ページング処理
  pageChanged(event: any): void {
    console.log('Page changed to: ' + event.page);
    console.log('Number items per page: ' + event.itemsPerPage);
  }

  // モーダル表示
  openModal() {
    this.template.show();
  }

  // 検索条件の初期化
  clearCustomerSearch() {
    this.searchCustomerNm = "";
    this.searchCustomerCd = "";
  }

  // TODO 一時表示用　固定インシデント情報 
 customerList = [
    {
      "customerNm": "1",
      "customerCd": "2"
    }
  ];
}