import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TabsPage} from '../tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'feed',
        loadChildren: () =>
          import('../pages/feed/modules/feed.module').then(
            (m) => m.FeedPageModule
          ),
      },
      {
        path: 'categories',
        loadChildren: () =>
          import('../pages/categories/modules/categories.module').then(
            (m) => m.CategoriesPageModule
          ),
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('../pages/profile/modules/profile.module').then(
            (m) => m.ProfilePageModule
          ),
      },
      {
        path: '',
        redirectTo: '/feed',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/feed',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
