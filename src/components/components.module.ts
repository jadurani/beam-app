import { NgModule } from '@angular/core';
import { SmallSelectComponent } from './small-select/small-select';
import { PersonalInfoComponent } from './personal-info/personal-info';
@NgModule({
	declarations: [SmallSelectComponent,
    PersonalInfoComponent],
	imports: [],
	exports: [SmallSelectComponent,
    PersonalInfoComponent]
})
export class ComponentsModule {}
