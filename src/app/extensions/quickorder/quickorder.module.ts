import { NgModule } from '@angular/core';
import { ConfigOption, FormlyModule } from '@ngx-formly/core';

import { NumberInputFieldComponent } from 'ish-shared/formly/types/number-input-field/number-input-field.component';
import { TextInputFieldComponent } from 'ish-shared/formly/types/text-input-field/text-input-field.component';
import { ColumnWrapperComponent } from 'ish-shared/formly/wrappers/column-wrapper/column-wrapper.component';
import { SharedModule } from 'ish-shared/shared.module';

import { DirectOrderComponent } from './shared/direct-order/direct-order.component';
import { HeaderQuickorderComponent } from './shared/header-quickorder/header-quickorder.component';

const quickOrderFormlyConfig: ConfigOption = {
  types: [
    {
      name: 'ish-text-input-field',
      component: TextInputFieldComponent,
      wrappers: ['form-field-column', 'validation'],
    },
    {
      name: 'ish-number-input-field',
      component: NumberInputFieldComponent,
      wrappers: ['form-field-column', 'validation'],
    },
  ],
  wrappers: [{ name: 'form-field-column', component: ColumnWrapperComponent }],
};

@NgModule({
  imports: [FormlyModule.forChild(quickOrderFormlyConfig), SharedModule],
  declarations: [ColumnWrapperComponent, DirectOrderComponent, HeaderQuickorderComponent],
  exports: [DirectOrderComponent, SharedModule],
})
export class QuickorderModule {}
