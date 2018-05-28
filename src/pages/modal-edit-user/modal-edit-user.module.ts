import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalEditUserPage } from './modal-edit-user';

@NgModule({
  declarations: [
    ModalEditUserPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalEditUserPage),
  ],
})
export class ModalEditUserPageModule {}
