import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { URLSearchParams } from '@angular/http';

import { LoadingComponent } from "../loading/loading.component";

@Component({
  selector: 'my-app',
  templateUrl: './errorHandler.component.html',
  styleUrls: ['./errorHandler.component.css'],
})
export class ErrorHandlerComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }

  isLoading: boolean = true;

  ngOnInit() {
    this.route.data.subscribe(obj => console.log(obj['category']));
    this.errorCd = this.route.snapshot.paramMap.get('errorCd');
    this.setDspParam();
  }

  errorCd = "";
  mes = "エラー";
  mesJp = "";
  // 画面表示パラメータのセット処理
  setDspParam() {
    if (this.errorCd == "500") {
      this.mes = "Internal Server Error";
      this.mesJp = "サーバー内部エラーが発生しました"
    }
  }

}