import { NgModule } from '@angular/core';
import { ConfigOption, FormlyModule } from '@ngx-formly/core';

import { TextInputFieldComponent } from 'ish-shared/formly/types/text-input-field/text-input-field.component';
import { ColumnWrapperComponent } from 'ish-shared/formly/wrappers/column-wrapper/column-wrapper.component';
import { SharedModule } from 'ish-shared/shared.module';
import { QuickorderAddProductsFormComponent } from './shared/components/quickorder-add-products-form/quickorder-add-products-form.component';

import { HeaderQuickorderComponent } from './shared/header-quickorder/header-quickorder.component';
import { QuickorderCsvFormComponent } from './shared/quickorder-csv-form/quickorder-csv-form.component';

const quickOrderFormlyConfig: ConfigOption = {
  types: [
    {
      name: 'ish-input-field',
      component: TextInputFieldComponent,
      wrappers: ['form-field-column', 'validation'],
    },
  ],
  wrappers: [{ name: 'form-field-column', component: ColumnWrapperComponent }],
};
@NgModule({
  imports: [SharedModule, FormlyModule.forChild(quickOrderFormlyConfig)],
  declarations: [
    ColumnWrapperComponent,
    HeaderQuickorderComponent,
    QuickorderCsvFormComponent,
    QuickorderAddProductsFormComponent,
  ],
  exports: [SharedModule, QuickorderCsvFormComponent, QuickorderAddProductsFormComponent],
})
export class QuickorderModule {}
