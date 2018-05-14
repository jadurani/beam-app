import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalUserDetailsPage } from './modal-user-details';

@NgModule({
  declarations: [
    ModalUserDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalUserDetailsPage),
  ],
})
export class ModalUserDetailsPageModule {}
