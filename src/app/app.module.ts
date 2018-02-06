import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { JsonpModule, HttpModule } from "@angular/http";
import { FormsModule } from "@angular/forms";

import { BsDropdownModule } from 'ngx-bootstrap';
import { ModalModule } from 'ngx-bootstrap';
import { PaginationModule } from 'ngx-bootstrap';
import { MY_ROUTES } from './app.routing';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { PopoverModule } from 'ngx-bootstrap';

import { AppComponent } from './app.component';
import { ErrorComponent } from './error.component';
import { HeaderComponent } from './header/header.component';
import { TopComponent } from './top/top.component';
import { ListComponent } from './list/list.component';
import { DetailComponent } from './detail/detail.component';
import { SubDetailComponent } from './subDetail/subDetail.component';
import { EditComponent } from './edit/edit.component';
import { Mr2Component } from './mr2/mr2.component';
import { ProjectComponent } from './project/project.component';
import { CommonComponent } from './common/common.component';

import { CommonModalComponent } from './modal/common.modal.component';
import { RelateUserAddModalComponent } from './modal/relateUserAdd.modal.component';
import { IncidentSearchModalComponent } from './modal/incidentSearch.modal.component';
import { KijoSearchModalComponent } from './modal/kijoSearch.modal.component';
import { UserSearchModalComponent } from './modal/userSearch.modal.component';
import { SectionSearchModalComponent } from './modal/sectionSearch.modal.component';
import { ConditionSaveModalComponent } from './modal/conditionSave.modal.component';
import { ConditionDeleteModalComponent } from './modal/conditionDelete.modal.component';
import { ProjectSearchModalComponent } from './modal/projectSearch.modal.component';
import { CustomerSearchModalComponent } from './modal/customerSearch.modal.component';
import { EquipmentSearchModalComponent } from './modal/equipmentSearch.modal.component';
import { LoadingComponent } from './loading/loading.component';

import { LoginService } from './login.service';
import { JsonpService } from './jsonp.service';
import { PostService } from './post.service';
import { WindowRefService } from './windowRef.service';

import { OrderByPipe } from './pipe/order.by.pipe';
import { DatexPipe } from './pipe/datex.pipe';

@NgModule({
  declarations: [
    AppComponent,
    ErrorComponent,
    HeaderComponent,
    TopComponent,
    ListComponent,
    DetailComponent,
    SubDetailComponent,
    EditComponent,
    Mr2Component,
    ProjectComponent,
    CommonModalComponent,
    RelateUserAddModalComponent,
    IncidentSearchModalComponent,
    KijoSearchModalComponent,
    UserSearchModalComponent,
    SectionSearchModalComponent,
    ConditionSaveModalComponent,
    ConditionDeleteModalComponent,
    ProjectSearchModalComponent,
    CustomerSearchModalComponent,
    EquipmentSearchModalComponent,
    CommonComponent,
    LoadingComponent,
    OrderByPipe,
    DatexPipe
  ],
  imports: [
    BrowserModule,
    MY_ROUTES,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    PaginationModule.forRoot(),
    BsDatepickerModule.forRoot(),
    PopoverModule.forRoot(),
    JsonpModule,
    FormsModule,
    HttpModule,
  ],
  providers: [LoginService, JsonpService, WindowRefService, PostService],
  bootstrap: [AppComponent],
})
export class AppModule { }
