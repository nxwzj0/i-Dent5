import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { URLSearchParams } from '@angular/http';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { JsonpService } from '../jsonp.service';

@Component({
  selector: 'kijoSearch-modal',
  templateUrl: './kijoSearch.modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class KijoSearchModalComponent {
  @ViewChild('template')
  template;

  modalRef: BsModalRef;

  constructor(private modalService: BsModalService) { }

  // 検索条件
  searchPrefNm = "";
  searchProjectNm = "";
  searchKijoNm = "";

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
  clearKijoSearch() {
    this.searchPrefNm = "";
    this.searchProjectNm = "";
    this.searchKijoNm = "";
  }

  // TODO 一時表示用　固定インシデント情報 
  incidentList = [
    {
      "incidentNo": "2017091000", "incidentStatus": "処置入力済", "incidentType": "障害", "incidentTypeValue": 1,
      "memo": "中央監視装置の障害。西浄化センターにて、10時過ぎから中央監視装置全てからの操作・監視ができなくなった。なお、エラー表示、メッセージ等は出ていない。当方現場に向かっている最中なので詳細は分からない。監視装置(LCD)は4台である。連絡先は、事務所へ願いたい。特に担当者は指定しない。",
      "kijoNm": "秋田市仁井田浄水場", "setubiNm": "XXポンプ",
      "prefNm": "秋田県", "incidentStartDateTime": "2017/09/20", "callDate": "2017/09/20",
      "relatePj": "有", "relateJiko": "", "relateMr2": "有", "relateHiyo": "",
    },
    {
      "incidentNo": "2017091020", "incidentStatus": "処置入力済", "incidentType": "問合せ", "incidentTypeValue": 3,
      "memo": "中央監視装置の障害。",
      "kijoNm": "万世橋浄水場", "setubiNm": "XYポンプ",
      "prefNm": "東京都", "incidentStartDateTime": "2017/09/20", "callDate": "2017/09/20",
      "relatePj": "", "relateJiko": "有", "relateMr2": "有", "relateHiyo": "",
    },
    {
      "incidentNo": "2017091750", "incidentStatus": "対応入力済", "incidentType": "障害", "incidentTypeValue": 1,
      "memo": "中央監視装置の障害。",
      "kijoNm": "秋田浄水場", "setubiNm": "ポンプ",
      "prefNm": "秋田県", "incidentStartDateTime": "2017/09/19", "callDate": "2017/09/19",
      "relatePj": "", "relateJiko": "", "relateMr2": "", "relateHiyo": "有",
    },
    {
      "incidentNo": "2017092050", "incidentStatus": "処置入力済", "incidentType": "問合せ", "incidentTypeValue": 3,
      "memo": "中央監視装置の障害。西浄化センターにて、10時過ぎから中央監視装置全てからの操作・監視ができなくなった。なお、エラー表示、メッセージ等は出ていない。当方現場に向かっている最中なので詳細は分からない。監視装置(LCD)は4台である。連絡先は、事務所へ願いたい。特に担当者は指定しない。",
      "kijoNm": "愛知浄水場", "setubiNm": "ポンプ",
      "prefNm": "愛知県", "incidentStartDateTime": "2017/09/18", "callDate": "2017/09/18",
      "relatePj": "有", "relateJiko": "有", "relateMr2": "", "relateHiyo": "",
    },
    {
      "incidentNo": "2017096020", "incidentStatus": "受付済", "incidentType": "障害", "incidentTypeValue": 1,
      "memo": "中央監視装置の障害。西浄化センターにて、10時過ぎから中央監視装置全てからの操作・監視ができなくなった。なお、エラー表示、メッセージ等は出ていない。当方現場に向かっている最中なので詳細は分からない。監視装置(LCD)は4台である。連絡先は、事務所へ願いたい。特に担当者は指定しない。",
      "kijoNm": "神奈川浄水場", "setubiNm": "ポンプ",
      "prefNm": "神奈川県", "incidentStartDateTime": "2017/09/17", "callDate": "2017/09/17",
      "relatePj": "", "relateJiko": "", "relateMr2": "有", "relateHiyo": "",
    },
    {
      "incidentNo": "2017093000", "incidentStatus": "処置入力済", "incidentType": "障害", "incidentTypeValue": 1,
      "memo": "",
      "kijoNm": "山梨浄水場", "setubiNm": "ポンプ",
      "prefNm": "山梨県", "incidentStartDateTime": "2017/09/16", "callDate": "2017/09/16",
      "relatePj": "", "relateJiko": "", "relateMr2": "有", "relateHiyo": "",
    },
    {
      "incidentNo": "2017091310", "incidentStatus": "受付済", "incidentType": "障害", "incidentTypeValue": 1,
      "memo": "中央監視装置の障害。西浄化センターにて、10時過ぎから中央監視装置全てからの操作・監視ができなくなった。なお、エラー表示、メッセージ等は出ていない。当方現場に向かっている最中なので詳細は分からない。監視装置(LCD)は4台である。連絡先は、事務所へ願いたい。特に担当者は指定しない。",
      "kijoNm": "釧路浄水場", "setubiNm": "送水ポンプ",
      "prefNm": "北海道", "incidentStartDateTime": "2017/09/15", "callDate": "2017/09/15",
      "relatePj": "有", "relateJiko": "有", "relateMr2": "有", "relateHiyo": "",
    },
    {
      "incidentNo": "2017097562", "incidentStatus": "処置入力済", "incidentType": "障害", "incidentTypeValue": 1,
      "memo": "中央監視装置の障害。西浄化センターにて、10時過ぎから中央監視装置全てからの操作・監視ができなくなった。なお、エラー表示、メッセージ等は出ていない。当方現場に向かっている最中なので詳細は分からない。監視装置(LCD)は4台である。連絡先は、事務所へ願いたい。特に担当者は指定しない。",
      "kijoNm": "釧路浄水場", "setubiNm": "送水ポンプ",
      "prefNm": "東京都", "incidentStartDateTime": "2017/09/10", "callDate": "2017/09/10",
      "relatePj": "", "relateJiko": "", "relateMr2": "有", "relateHiyo": "",
    },
    {
      "incidentNo": "2017090534", "incidentStatus": "処置入力済", "incidentType": "事故", "incidentTypeValue": 2,
      "memo": "中央監視装置の障害。西浄化センターにて、10時過ぎから中央監視装置全てからの操作・監視ができなくなった。なお、エラー表示、メッセージ等は出ていない。当方現場に向かっている最中なので詳細は分からない。監視装置(LCD)は4台である。連絡先は、事務所へ願いたい。特に担当者は指定しない。",
      "kijoNm": "北総浄水場", "setubiNm": "床排水ポンプ",
      "prefNm": "千葉県", "incidentStartDateTime": "2017/09/05", "callDate": "2017/09/05",
      "relatePj": "有", "relateJiko": "有", "relateMr2": "", "relateHiyo": "",
    },
    {
      "incidentNo": "2017092234", "incidentStatus": "受付済", "incidentType": "クレーム", "incidentTypeValue": 4,
      "memo": "中央監視装置の障害。西浄化センターにて、10時過ぎから中央監視装置全てからの操作・監視ができなくなった。なお、エラー表示、メッセージ等は出ていない。当方現場に向かっている最中なので詳細は分からない。監視装置(LCD)は4台である。連絡先は、事務所へ願いたい。特に担当者は指定しない。",
      "kijoNm": "福井浄水場", "setubiNm": "送水ポンプ",
      "prefNm": "福井県", "incidentStartDateTime": "2017/09/01", "callDate": "2017/09/01",
      "relatePj": "有", "relateJiko": "", "relateMr2": "有", "relateHiyo": "有",
    }

  ];
}