import { NgModule } from '@angular/core';
import { BrowserTransferStateModule } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { environment } from '../../environments/environment';

import { NgrxStateTransfer } from './configurations/ngrx-state-transfer';
import { CoreStoreModule } from './store/core-store.module';

@NgModule({
  imports: [
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.serviceWorker }),
    BrowserTransferStateModule,
    CoreStoreModule,
    !environment.production ? StoreDevtoolsModule.instrument() : [],
  ],
  providers: [NgrxStateTransfer],
})
export class StateManagementModule {
  constructor(ngrxStateTransfer: NgrxStateTransfer) {
    ngrxStateTransfer.do();
  }
}
