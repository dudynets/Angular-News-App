import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {ProfilePageRoutingModule} from './profile-routing.module';

import {ProfilePage} from '../profile.page';
import {ProfileInfoComponent} from '../components/profile-info/profile-info.component';
import {SignInComponent} from '../components/sign-in/sign-in.component';
import {SharedModule} from '../../../../../shared/shared.module';
import {ArticlePageModule} from '../../../../article/modules/article.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilePageRoutingModule,
    NgOptimizedImage,
    SharedModule,
    ArticlePageModule,
  ],
  declarations: [ProfilePage, ProfileInfoComponent, SignInComponent],
})
export class ProfilePageModule {}
