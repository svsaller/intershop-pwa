import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { QuickorderModule } from '../../quickorder.module';
import { QuickorderCsvFormComponent } from '../../shared/quickorder-csv-form/quickorder-csv-form.component';

import { QuickorderPageComponent } from './quickorder-page.component';

const quickorderPageRoutes: Routes = [{ path: '', component: QuickorderPageComponent }];

@NgModule({
  imports: [QuickorderModule, RouterModule.forChild(quickorderPageRoutes)],
  declarations: [QuickorderPageComponent, QuickorderCsvFormComponent],
})
export class QuickorderPageModule {}
