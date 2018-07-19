import { NgModule } from '@angular/core';
import { SmallSelectComponent } from './small-select/small-select';
import { PersonalInfoComponent } from './personal-info/personal-info';
import { ContactIceComponent } from './contact-ice/contact-ice';
@NgModule({
	declarations: [SmallSelectComponent,
    PersonalInfoComponent,
    ContactIceComponent],
	imports: [],
	exports: [SmallSelectComponent,
    PersonalInfoComponent,
    ContactIceComponent]
})
export class ComponentsModule {}
