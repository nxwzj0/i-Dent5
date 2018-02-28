import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { URLSearchParams } from '@angular/http';

import { LoadingComponent } from "../loading/loading.component";

@Component({
  selector: 'my-app',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css'],
})
export class ErrorComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }

  isLoading: boolean = true;

  ngOnInit() {
    this.route.data.subscribe(obj => console.log(obj['category']));
  }

  errorCd = "";
  mes = "エラー";
  mesJp = "URLが不正です。";

}