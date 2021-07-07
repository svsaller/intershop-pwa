import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime, mapTo, switchMap, takeUntil, tap } from 'rxjs/operators';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { ProductCompletenessLevel, ProductHelper } from 'ish-core/models/product/product.helper';
import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';
import { whenTruthy } from 'ish-core/utils/operators';

@Component({
  selector: 'ish-direct-order',
  templateUrl: './direct-order.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@GenerateLazyComponent()
export class DirectOrderComponent implements OnInit, OnDestroy {
  directOrderForm = new FormGroup({});
  disabledAddToCart = true;
  fields: FormlyFieldConfig[];
  model: { sku: string };

  private destroy$ = new Subject();

  disabled$: Observable<boolean>;

  constructor(
    private shoppingFacade: ShoppingFacade,
    private translate: TranslateService,
    private context: ProductContextFacade
  ) {}

  ngOnInit() {
    this.fields = this.getFields();
    this.model = this.getModel();
    this.setContext();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit() {
    this.context.addToBasket();
    this.directOrderForm.reset();
    this.setContext();
    this.checkDisabledStates();
  }

  private getFields(): FormlyFieldConfig[] {
    return [
      {
        key: 'sku',
        type: 'ish-text-input-field',
        className: 'col-12 list-item search-container mb-1',
        templateOptions: {
          fieldClass: 'col-12 px-0',
          placeholder: 'shopping_cart.direct_order.item_placeholder',
          autocomplete: true,
        },
        expressionProperties: {
          'templateOptions.required': () => (!this.directOrderForm.untouched ? !!this.context.get('quantity') : false),
        },
        hooks: {
          onInit: field => {
            field.form
              .get('sku')
              .valueChanges.pipe(whenTruthy(), takeUntil(this.destroy$))
              .subscribe(sku => {
                this.context.set('sku', () => sku);
                this.checkDisabledStates();
              });
          },
        },
        asyncValidators: {
          validProduct: {
            expression: (control: FormControl) =>
              control.valueChanges.pipe(
                tap(() => {
                  this.checkDisabledStates(true);
                }),
                debounceTime(500),
                switchMap(() => this.shoppingFacade.product$(control.value, ProductCompletenessLevel.List)),
                tap(product => {
                  const failed = ProductHelper.isFailedLoading(product);
                  control.setErrors(failed ? { validProduct: false } : undefined);
                  this.checkDisabledStates(false);
                }),
                mapTo(undefined)
              ),
            message: () => this.translate.get('quickorder.page.error.invalid.product', { 0: this.model.sku }),
          },
        },
        validation: {
          messages: {
            required: 'shopping_cart.direct_order.error.quantitywithoutsku',
          },
        },
      },
    ];
  }

  private getModel(): { sku: string } {
    return { sku: '' };
  }

  private setContext() {
    this.context.set('sku', () => ' ');
    this.context.set('quantity', () => 1);
    this.context.set('minQuantity', () => 1);
    this.context.set('maxQuantity', () => 100);
    this.context.set('stepQuantity', () => 1);
    this.context.set('hasQuantityError', () => false);
  }

  private checkDisabledStates(onLoad?: boolean) {
    this.disabledAddToCart =
      this.directOrderForm.invalid ||
      this.directOrderForm.pristine ||
      (this.context.get('quantity') === undefined && this.model.sku === undefined) ||
      this.context.get('hasQuantityError') ||
      onLoad;
  }
}
