import {NgModule} from '@angular/core';
import {ArticlesGridComponent} from './components/articles-grid/articles-grid.component';
import {ArticlePreviewComponent} from './components/articles-grid/components/article-preview/article-preview.component';
import {IonicModule} from '@ionic/angular';
import {CommonModule} from '@angular/common';

@NgModule({
  declarations: [ArticlesGridComponent, ArticlePreviewComponent],
  imports: [CommonModule, IonicModule],
  exports: [ArticlesGridComponent],
})
export class SharedModule {}
