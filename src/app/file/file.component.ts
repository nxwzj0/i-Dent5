import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { URLSearchParams } from '@angular/http';

import { JsonpService } from '../jsonp.service';
import { PostService } from '../post.service';
import { LoginService } from '../login.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'file-component',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.css']
})
export class FileComponent implements OnInit {
  @ViewChild('errorModal') errorModal;

  userId;
  userNm;
  userSectionCd;
  userSectionNm;
  subscription: Subscription;
  constructor(private route: ActivatedRoute, private jsonpService: JsonpService, private loginService: LoginService, private postService: PostService) {
    /* ログイン情報の取得 */
    this.subscription = loginService.loginUserNm$.subscribe(user => { this.userNm = user; });
    this.subscription = loginService.loginUserId$.subscribe(user => { this.userId = user; });
    this.subscription = loginService.loginUserSectionCd$.subscribe(user => { this.userSectionCd = user; });
    this.subscription = loginService.loginUserSectionNm$.subscribe(user => { this.userSectionNm = user; });
  }

  ngOnInit() { }

  incidentId = "";
  deleteShow = false;

  openFileList(incidentId: string, deleteFlg: boolean) {
    this.incidentId = incidentId;
    this.deleteShow = deleteFlg;
    this.findFileList();
  }

  findFileList() {
    let ps = new URLSearchParams();

    if (this.incidentId) {
      ps.set('incidentId', this.incidentId);
    }
    this.jsonpService.requestGet('FileListGet.php', ps)
      .subscribe(
      data => {
        console.log(data);
        // 通信成功時
        if (data[0]) {
          let one = data[0];
          if (one.result !== '' && one.result == true) {
            // 画面表示パラメータのセット処理
            this.setDspParam(data.slice(1));
          }
        }
      },
      error => {
        // 通信失敗もしくは、コールバック関数内でエラー
        console.log(error);
        console.log('サーバとのアクセスに失敗しました。');
        return false;
      }
      );
  }

  // ファイルの有無を確認して、ダウンロードする
  fileCheck(fileId: any) {
    let ps = new URLSearchParams();
    ps.set('fileId', fileId);

    // 検索
    this.jsonpService.requestGet('FileCheck.php', ps)
      .subscribe(
      data => {
        // 通信成功時 
        if (data[0]['result'] == true) {
          // ファイルが有る場合は、ダウンロードする
          this.fileDownload(fileId);
        } else if (data[0]['result'] == false) {
          // ファイルが無い場合は、メッセージを表示する
          this.errorModal.openModal('警告', 'ファイルが削除されています。', '', '閉じる');
        }
      },
      error => {
        // 通信失敗もしくは、コールバック関数内でエラー
        console.log(error);
        console.log('サーバとのアクセスに失敗しました。');
        return false;
      }
      );
  }

  fileList = [];
  /* 画面表示パラメータのセット処理 */
  setDspParam(data) {
    this.fileList = data;
  }

  // 削除待ちのファイルID
  delFileId;
  setDeleteFileId(fileId: any) {
    this.delFileId = fileId;
  }

  fileDownload(fileId: any) {
    if (fileId) {
      window.location.replace("/INCIDENT/FileDl.php?fileId=" + fileId);
    }
  }

  fileDelete() {
    let ps = new URLSearchParams();
    ps.set('fileId', this.delFileId);
    ps.set('incidentId', this.incidentId);
    // ログイン情報設定
    ps.set('userId', this.userId);
    ps.set('userName', this.userNm);
    ps.set('sectionCd', this.userSectionCd);
    ps.set('sectionName', this.userSectionNm);

    // 検索
    this.jsonpService.requestGet('FileDelete.php', ps)
      .subscribe(
      data => {
        if (data[0]['result'] == true) {
          // 通信成功時 
          this.findFileList();
        }
      },
      error => {
        // 通信失敗もしくは、コールバック関数内でエラー
        console.log(error);
        console.log('サーバとのアクセスに失敗しました。');
        return false;
      }
      );
  }

}