import { Component, Input } from '@angular/core';
import { User } from '../../models/user-model';
import { AddEditMemberPage } from '../../pages/add-edit-member/add-edit-member';


@Component({
  selector: 'contact-ice',
  templateUrl: 'contact-ice.html'
})
export class ContactIceComponent {
  @Input() user: User;
  addEditMemberPage: any = AddEditMemberPage;
}
