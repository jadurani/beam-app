import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalAddBodyInfoPage } from './modal-add-body-info';

@NgModule({
  declarations: [
    ModalAddBodyInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalAddBodyInfoPage),
  ],
})
export class ModalAddBodyInfoPageModule {}
