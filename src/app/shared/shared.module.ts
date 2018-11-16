import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  NgbCarouselModule,
  NgbCollapseModule,
  NgbDropdownModule,
  NgbModalModule,
  NgbPopoverModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { IconModule } from '../core/icon.module';

import { AccordionItemComponent } from './components/accordion-item/accordion-item.component';
import { AccordionComponent } from './components/accordion/accordion.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { InfoBoxComponent } from './components/info-box/info-box.component';
import { LoadingComponent } from './components/loading/loading.component';
import { ModalDialogComponent } from './components/modal-dialog/modal-dialog.component';
import { FeatureToggleModule } from './feature-toggle.module';
import { PipesModule } from './pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FeatureToggleModule,
    IconModule,
    InfiniteScrollModule,
    NgbCarouselModule,
    NgbCollapseModule,
    NgbDropdownModule,
    NgbModalModule,
    NgbPopoverModule,
    PipesModule,
    RouterModule,
    TranslateModule,
  ],
  declarations: [
    AccordionComponent,
    AccordionItemComponent,
    BreadcrumbComponent,
    InfoBoxComponent,
    LoadingComponent,
    ModalDialogComponent,
  ],
  exports: [
    AccordionComponent,
    AccordionItemComponent,
    BreadcrumbComponent,
    CommonModule,
    FeatureToggleModule,
    IconModule,
    InfiniteScrollModule,
    InfoBoxComponent,
    LoadingComponent,
    ModalDialogComponent,
    NgbCarouselModule,
    NgbCollapseModule,
    NgbDropdownModule,
    NgbModalModule,
    NgbPopoverModule,
    PipesModule,
    RouterModule,
    TranslateModule,
  ],
})
export class SharedModule {}
