import { Injectable } from '@angular/core';
import { Jsonp, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../environments/environment';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class JsonpService {

  constructor(private jsonp: Jsonp) { }

  /**
   *  サーバ通信共通処理
   *   pram: url アクションのurl
   *   return: Observable オブジェクト 
   */
  requestGet(url: string, ps: URLSearchParams): Observable<any> {
    ps.set('callback', 'JSONP_CALLBACK'); // コールバック関数名は固定

    url = environment.envPath + url; // 環境に合わせたURLを作成する

    return this.jsonp.get(url, { params: ps })
      .map(
      response => {
        return response.json() || {};
      }
      )
      .catch(
      error => {
        // 通信失敗もしくは、コールバック関数内でエラー
        return Observable.throw(error.statusText);
      }
      );
  }

  /**
   *  サーバ通信共通処理
   *   pram: url アクションのurl
   *   return: Observable オブジェクト 
   */
  commonRequestGet(url: string, ps: URLSearchParams): Observable<any> {
    ps.set('callback', 'JSONP_CALLBACK'); // コールバック関数名は固定

    url = environment.envCommonPath + url; // 環境に合わせたURLを作成する

    return this.jsonp.get(url, { params: ps })
      .map(
      response => {
        return response.json() || {};
      }
      )
      .catch(
      error => {
        // 通信失敗もしくは、コールバック関数内でエラー
        return Observable.throw(error.statusText);
      }
      );
  }

}