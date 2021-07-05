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

@Component({
  selector: 'ish-direct-order',
  templateUrl: './direct-order.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@GenerateLazyComponent()
export class DirectOrderComponent implements OnInit, OnDestroy {
  model = { sku: '', quantity: 1 };
  directOrderForm = new FormGroup({
    sku: new FormControl(this.model.sku),
    quantity: new FormControl(this.model.quantity),
  });
  disabledAddToCart = true;
  fields: FormlyFieldConfig[] = [
    {
      key: 'sku',
      type: 'ish-text-input-field',
      className: 'col-12 list-item search-container mb-1',
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
  ];

  private destroy$ = new Subject();

  disabled$: Observable<boolean>;

  constructor(
    private shoppingFacade: ShoppingFacade,
    private translate: TranslateService,
    private context: ProductContextFacade
  ) {}

  ngOnInit() {
    this.setContext();
    this.directOrderForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((control: { sku: string; quantity: number }) => {
        this.context.set('sku', () => control.sku);
        this.context.set('quantity', () => control.quantity);
        this.model.quantity = control.quantity;
        this.checkDisabledStates();
      });
    this.context
      .select('quantity')
      .pipe(takeUntil(this.destroy$))
      .subscribe(quantity => {
        if (this.directOrderForm.get('quantity').value !== quantity) {
          this.directOrderForm.get('quantity').setValue(quantity);
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setContext() {
    this.context.set('sku', () => ' ');
    this.context.set('minQuantity', () => 1);
    this.context.set('maxQuantity', () => 100);
    this.context.set('stepQuantity', () => 1);
    this.context.set('hasQuantityError', () => false);
  }

  onSubmit() {
    this.shoppingFacade.addProductToBasket(this.model.sku, this.model.quantity);
    this.directOrderForm.reset({ quantity: 1 });
    this.checkDisabledStates();
  }

  private checkDisabledStates(onLoad?: boolean) {
    this.disabledAddToCart =
      this.directOrderForm.invalid ||
      this.directOrderForm.pristine ||
      (this.model.quantity === undefined && this.model.sku === undefined) ||
      this.context.get('hasQuantityError') ||
      onLoad;
  }
}
