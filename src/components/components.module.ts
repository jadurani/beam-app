import { NgModule } from '@angular/core';
import { SmallSelectComponent } from './small-select/small-select';
import { PersonalInfoComponent } from './personal-info/personal-info';
import { ContactIceComponent } from './contact-ice/contact-ice';
import { FitnessParametersComponent } from './fitness-parameters/fitness-parameters';
import { FitnessParametersChartViewComponent } from './fitness-parameters-chart-view/fitness-parameters-chart-view';
@NgModule({
	declarations: [SmallSelectComponent,
    PersonalInfoComponent,
    ContactIceComponent,
    FitnessParametersComponent,
    FitnessParametersChartViewComponent],
	imports: [],
	exports: [SmallSelectComponent,
    PersonalInfoComponent,
    ContactIceComponent,
    FitnessParametersComponent,
    FitnessParametersChartViewComponent]
})
export class ComponentsModule {}
