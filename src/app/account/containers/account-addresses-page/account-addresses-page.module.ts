import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedAddressModule } from '../../../shared/shared-address.module';
import { SharedModule } from '../../../shared/shared.module';
import { AccountSharedModule } from '../../account-shared.module';
import { AccountAddressesPageComponent } from '../../components/account-addresses-page/account-addresses-page.component';

import { AccountAddressesPageContainerComponent } from './account-addresses-page.container';
import { accountAddressesPageRoutes } from './account-addresses-page.routes';

@NgModule({
  imports: [AccountSharedModule, RouterModule.forChild(accountAddressesPageRoutes), SharedAddressModule, SharedModule],
  declarations: [AccountAddressesPageComponent, AccountAddressesPageContainerComponent],
})
export class AccountAddressesPageModule {}
