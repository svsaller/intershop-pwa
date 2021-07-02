import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject, of } from 'rxjs';
import { debounceTime, mapTo, switchMap, takeUntil, tap } from 'rxjs/operators';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { ProductCompletenessLevel, ProductHelper } from 'ish-core/models/product/product.helper';
import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';

@Component({
  selector: 'ish-direct-order',
  templateUrl: './direct-order.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@GenerateLazyComponent()
export class DirectOrderComponent implements OnInit, OnDestroy {
  model = { sku: '', quantity: 1 };
  directOrderForm = new FormGroup({});
  disabledAddToCart = true;
  fields: FormlyFieldConfig[] = [
    {
      key: 'sku',
      type: 'ish-text-input-field',
      className: 'col-md-9 list-item search-container mb-1',
      templateOptions: {
        placeholder: 'shopping_cart.direct_order.item_placeholder',
        autocomplete: true,
      },
      expressionProperties: {
        'templateOptions.required': () => (!this.directOrderForm.untouched ? !!this.model.quantity : false),
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
    {
      key: 'quantity',
      type: 'ish-number-input-field',
      className: 'col-md-3 list-item pl-md-0 mb-1',
      templateOptions: {
        placeholder: 'shopping_cart.direct_order.quantity_placeholder',
        hideRequiredMarker: true,
        options: of([{ hideValidationIcons: true }]),
        min: 1,
      },
      expressionProperties: {
        'templateOptions.required': () => !!this.model.sku,
      },
      validation: {
        messages: {
          required: 'shopping_cart.direct_order.error.skuwithoutquantity',
        },
      },
    },
  ];

  private destroy$ = new Subject();

  constructor(private shoppingFacade: ShoppingFacade, private translate: TranslateService) {}

  ngOnInit() {
    this.directOrderForm.valueChanges.pipe(takeUntil(this.destroy$));
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  onSubmit() {
    this.shoppingFacade.addProductToBasket(this.model.sku, this.model.quantity);
    this.directOrderForm.reset({ quantity: 1 });
  }

  private checkDisabledStates(onLoad?: boolean) {
    this.disabledAddToCart =
      this.directOrderForm.invalid ||
      this.directOrderForm.pristine ||
      (this.model.quantity === undefined && this.model.sku === undefined) ||
      onLoad;
  }
}
