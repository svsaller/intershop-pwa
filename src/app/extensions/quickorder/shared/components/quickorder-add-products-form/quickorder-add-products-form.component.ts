import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { QuickOrderFacade } from '../../../facades/quick-order.facade';

@Component({
  selector: 'ish-quickorder-add-products-form',
  templateUrl: './quickorder-add-products-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickorderAddProductsFormComponent implements OnInit {
  @Output() productsToAdd = new EventEmitter<{ sku: string; quantity: number }[]>();
  quickOrderForm: FormGroup;

  searchSuggestions: { imgPath: string; sku: string; name: string }[] = [];

  numberOfRows = 5;

  constructor(private qf: FormBuilder, private cdRef: ChangeDetectorRef, private quickorderFacade: QuickOrderFacade) {}

  ngOnInit() {
    this.quickOrderForm = this.qf.group({
      quickOrderLines: this.qf.array([]),
    });

    this.addRows(this.numberOfRows);

    // Dummy data to test search suggestion styling, typing 1234 will show the drop down with this product
    this.searchSuggestions.push({
      imgPath:
        'http://jxdemoserver.intershop.de/INTERSHOP/static/WFS/inSPIRED-inTRONICS_Business-Site/-/inSPIRED/en_US/S/4808544-118.jpg',
      sku: '1234',
      name: 'test',
    });
  }

  addRows(rowsToAdd: number) {
    for (let i = 0; i < rowsToAdd; i++) {
      this.quickOrderLines.push(this.createLine());
    }
  }

  createLine(): FormGroup {
    return this.qf.group(
      { sku: [''], quantity: [''], product: [{}] },
      { asyncValidators: this.quickorderFacade.validateProductFunction(this.cdRef) }
    );
  }

  deleteItem(index: number) {
    this.quickOrderLines.removeAt(index);
  }

  resetFields() {
    this.quickOrderLines.reset([this.createLine()]);
  }

  get quickOrderLines() {
    return this.quickOrderForm.get('quickOrderLines') as FormArray;
  }

  get quickOrderFormDisabled() {
    return (
      this.quickOrderForm.invalid ||
      !this.quickOrderLines.value[0].sku ||
      !parseInt(this.quickOrderLines.value[0].quantity, 10)
    );
  }

  onAddProducts() {
    const filledLines = this.quickOrderLines.value.filter(
      (p: { sku: string; quantity: number }) => !!p.sku && !!p.quantity
    );
    this.productsToAdd.emit(filledLines);
  }
}
