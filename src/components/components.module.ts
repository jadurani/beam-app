import { NgModule } from '@angular/core';
import { SmallSelectComponent } from './small-select/small-select';
import { PersonalInfoComponent } from './personal-info/personal-info';
import { ContactIceComponent } from './contact-ice/contact-ice';
import { FitnessParametersComponent } from './fitness-parameters/fitness-parameters';
@NgModule({
	declarations: [SmallSelectComponent,
    PersonalInfoComponent,
    ContactIceComponent,
    FitnessParametersComponent],
	imports: [],
	exports: [SmallSelectComponent,
    PersonalInfoComponent,
    ContactIceComponent,
    FitnessParametersComponent]
})
export class ComponentsModule {}
