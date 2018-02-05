import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { URLSearchParams } from '@angular/http';

import { JsonpService } from '../jsonp.service';
import { WindowRefService } from '../windowRef.service';

@Component({
  selector: 'my-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {

  nativeWindow: any;
  constructor(private route: ActivatedRoute, private jsonpService: JsonpService, private winRef: WindowRefService) {
    this.nativeWindow = winRef.getNativeWindow();
  }

  projectData = [];

  ngOnInit() {

    this.route.data.subscribe(obj => console.log(obj['category']));

    // // 画面表示パラメータの取得処理
    // this.jsonpService.requestGet('IncidentListDataGet.php', new URLSearchParams())
    // .subscribe(
    // data => {
    //   // 通信成功時
    //   if (data[0]) {
    //     let list = data[0];
    //     if (list[0].result !== '' && list[0].result == true) {
    //       // 画面表示パラメータのセット処理
    //       this.setDspParam(list.slice(1)); // 配列1つ目は、サーバ処理成功フラグなので除外
    //     }
    //   }
    // },
    // error => {
    //   // 通信失敗もしくは、コールバック関数内でエラー
    //   console.log(error);
    //   console.log('サーバとのアクセスに失敗しました。');
    //   return false;
    // }
    // );
  }

  // 画面表示パラメータのセット処理
  setDspParam(data) {
    this.projectData = data;
  }

}