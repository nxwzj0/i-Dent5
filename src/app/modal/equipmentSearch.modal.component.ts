import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { URLSearchParams } from '@angular/http';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { JsonpService } from '../jsonp.service';

import { LoadingComponent } from "../loading/loading.component";

@Component({
  selector: 'equipmentSearch-modal',
  templateUrl: './equipmentSearch.modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class EquipmentSearchModalComponent {
  @ViewChild('template')
  template;

  modalRef: BsModalRef;

  constructor(private modalService: BsModalService) { }

  isLoading: boolean = false;

  // 検索条件
  searchItem1 = "";
  searchItem2 = "";
  searchItem3 = "";
  searchItem4 = "";
  searchItem5 = "";
  
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
  clearEquipmentSearch() {
    this.searchItem1 = "";
    this.searchItem2 = "";
    this.searchItem3 = "";
    this.searchItem4 = "";
    this.searchItem5 = "";
  }

  // TODO 一時表示用　固定インシデント情報 
  equipmentList = [
    {
      "item1": "1",
      "item2": "2",
      "item3": "3",
      "item4": "4",
      "item5": "5"
    }
  ];
}