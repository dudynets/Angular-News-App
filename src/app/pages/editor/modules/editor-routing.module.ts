import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {EditorPage} from '../editor-page.component';
import {CanDeactivateGuard} from '../guards/can-deactivate.guard';
import {CanActivateGuard} from '../guards/can-activate.guard';

const routes: Routes = [
  {
    path: '',
    component: EditorPage,
    canActivate: [CanActivateGuard],
    canDeactivate: [CanDeactivateGuard],
  },
  {
    path: ':articleId',
    component: EditorPage,
    canActivate: [CanActivateGuard],
    canDeactivate: [CanDeactivateGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditorPageRoutingModule {}
