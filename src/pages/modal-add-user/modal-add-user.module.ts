import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalAddUserPage } from './modal-add-user';

@NgModule({
  declarations: [
    ModalAddUserPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalAddUserPage),
  ],
})
export class ModalAddUserPageModule {}
