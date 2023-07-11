import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {ArticlePageRoutingModule} from './article-routing.module';

import {ArticlePage} from '../article.page';
import {QuillViewComponent} from 'ngx-quill';
import {CommentComponent} from '../../../shared/components/comment/comment.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ArticlePageRoutingModule,
    QuillViewComponent,
    ReactiveFormsModule,
  ],
  declarations: [ArticlePage, CommentComponent],
  exports: [CommentComponent],
})
export class ArticlePageModule {}
