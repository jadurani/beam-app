import { Component, Input } from '@angular/core';
import { AddEditMemberPage } from '../../pages/add-edit-member/add-edit-member';
import { User } from '../../models/user-model';


@Component({
  selector: 'personal-info',
  templateUrl: 'personal-info.html'
})
export class PersonalInfoComponent {
  @Input() user: User;

  addEditMemberPage: any = AddEditMemberPage;
  profileExpanded: boolean = false;

  /**
   * Expands Basic Profile Info Section when true.
   */
  profileToggle() {
    this.profileExpanded = !this.profileExpanded;
  }
}
