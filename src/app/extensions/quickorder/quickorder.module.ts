import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';
import { QuickorderAddProductsFormComponent } from './shared/components/quickorder-add-products-form/quickorder-add-products-form.component';

import { HeaderQuickorderComponent } from './shared/header-quickorder/header-quickorder.component';
import { QuickorderCsvFormComponent } from './shared/quickorder-csv-form/quickorder-csv-form.component';

@NgModule({
  imports: [SharedModule],
  declarations: [HeaderQuickorderComponent, QuickorderCsvFormComponent, QuickorderAddProductsFormComponent],
  exports: [SharedModule, QuickorderCsvFormComponent, QuickorderAddProductsFormComponent],
})
export class QuickorderModule {}
