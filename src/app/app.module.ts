import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ElectronService } from './service/electron.service';
import { SerialportronComponent } from './components/serialportron/serialportron.component';
import {FormsModule} from '@angular/forms';
import {ToastModule} from 'primeng/toast';
import {MessageService} from 'primeng/api';
import {ButtonModule} from 'primeng/button';
import { HomePageComponent } from './components/homepage/homepage.component';
import { DropdownModule } from 'primeng/dropdown';
import { MenuModule } from 'primeng/menu';
import { HeaderComponent } from './components/header/header.component';
import {DialogModule} from 'primeng/dialog';
import {CardModule} from 'primeng/card';
import {CalendarModule} from 'primeng/calendar';
import {FieldsetModule} from 'primeng/fieldset';
import {CheckboxModule} from 'primeng/checkbox';
import {InputTextModule} from 'primeng/inputtext';
import {InputSwitchModule} from 'primeng/inputswitch';

import {TableModule} from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import {ConfirmationService} from 'primeng/api';


@NgModule({
  declarations: [
    AppComponent, SerialportronComponent,HomePageComponent,HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ToastModule,
    BrowserAnimationsModule,
    ButtonModule,
    DropdownModule,
    MenuModule,
    DialogModule,
    CardModule,
    FieldsetModule,
    CheckboxModule,
    InputTextModule,
    InputSwitchModule,
    TableModule,
    ConfirmDialogModule
  ],
  providers: [ElectronService,MessageService,ConfirmationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
