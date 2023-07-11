import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {ArticlePage} from '../article.page';

const routes: Routes = [
  {
    path: ':id',
    component: ArticlePage,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/feed',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ArticlePageRoutingModule {}
