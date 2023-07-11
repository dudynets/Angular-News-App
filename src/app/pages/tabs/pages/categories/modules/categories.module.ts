import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {CategoriesPageRoutingModule} from './categories-routing.module';

import {CategoriesPage} from '../categories.page';
import {CategoryCardComponent} from '../components/category-card/category-card.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CategoriesPageRoutingModule,
  ],
  declarations: [CategoriesPage, CategoryCardComponent],
})
export class CategoriesPageModule {}
