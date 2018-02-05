import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../environments/environment';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class PostService {

  constructor( private http: Http) { }

  /**
   *  サーバ通信共通処理
   *   pram: url アクションのurl
   *   return: オブジェクト 
   */
  requestPost(url: string, data: FormData): any {

    url = environment.envPath + url; // 環境に合わせたURLを作成する

    return this.http.post(url, data)
    .subscribe(
      data => {return data;},
      error => {return error;}
      );

  }

}