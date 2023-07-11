import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./pages/tabs/modules/tabs.module').then((m) => m.TabsPageModule),
  },
  {
    path: 'category',
    loadChildren: () =>
      import('./pages/category/modules/category.module').then(
        (m) => m.CategoryPageModule
      ),
  },
  {
    path: 'editor',
    loadChildren: () =>
      import('./pages/editor/modules/editor.module').then(
        (m) => m.EditorPageModule
      ),
  },
  {
    path: 'article',
    loadChildren: () =>
      import('./pages/article/modules/article.module').then(
        (m) => m.ArticlePageModule
      ),
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
