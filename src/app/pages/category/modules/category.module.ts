import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {CategoryPageRoutingModule} from './category-routing.module';

import {CategoryPage} from '../category.page';
import {SharedModule} from '../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CategoryPageRoutingModule,
    SharedModule,
  ],
  declarations: [CategoryPage],
})
export class CategoryPageModule {}
