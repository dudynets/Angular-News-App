import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {EditorPageRoutingModule} from './editor-routing.module';

import {EditorPage} from '../editor-page.component';
import {QuillEditorComponent, QuillModule} from 'ngx-quill';
import {CanActivateGuard} from '../guards/can-activate.guard';
import {CanDeactivateGuard} from '../guards/can-deactivate.guard';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditorPageRoutingModule,
    ReactiveFormsModule,
    QuillModule,
    QuillEditorComponent,
  ],
  declarations: [EditorPage],
  providers: [CanActivateGuard, CanDeactivateGuard],
})
export class EditorPageModule {}
