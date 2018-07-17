import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddEditMemberPage } from './add-edit-member';

@NgModule({
  declarations: [
    AddEditMemberPage,
  ],
  imports: [
    IonicPageModule.forChild(AddEditMemberPage),
  ],
})
export class AddEditMemberPageModule {}
