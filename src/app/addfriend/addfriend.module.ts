import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddfriendPageRoutingModule } from './addfriend-routing.module';

import { AddfriendPage } from './addfriend.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddfriendPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [AddfriendPage]
})
export class AddfriendPageModule {}
