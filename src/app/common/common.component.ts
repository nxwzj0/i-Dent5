import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { URLSearchParams } from '@angular/http';

@Component({
  selector: 'my-app',
  templateUrl: './common.component.html',
  styleUrls: ['./common.component.css']
})
export class CommonComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(obj => console.log(obj['category']));
    this.msg = this.route.snapshot.paramMap.get('msg');
    this.nextUrl = this.route.snapshot.paramMap.get('nextUrl');
    if(this.nextUrl){
      this.btnShowFlg = true;
    }
  }

  msg;
  nextUrl;
  btnShowFlg: boolean = false;

}