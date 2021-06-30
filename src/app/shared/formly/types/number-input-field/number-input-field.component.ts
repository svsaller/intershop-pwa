import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FieldType } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ish-number-input-field',
  templateUrl: './number-input-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NumberInputFieldComponent extends FieldType implements OnInit, OnDestroy {
  formControl: FormControl;

  private destroy$ = new Subject();

  cannotIncrease = false;
  cannotDecrease = false;

  defaultMin = 1;
  defaultMax = 100;

  constructor(private translate: TranslateService) {
    super();
  }

  ngOnInit() {
    if (this.to?.placeholder) {
      this.to.placeholder = this.translate.instant(this.to.placeholder);
    }
    this.disableButtons();
    this.formControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.disableButtons();
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private disableButtons() {
    const min = this.to?.min ? this.to.min : this.defaultMin;
    const max = this.to?.max ? this.to.max : this.defaultMax;
    this.cannotDecrease = this.formControl.value <= min;
    this.cannotIncrease = this.formControl.value >= max;
  }

  keydown($event: KeyboardEvent) {
    switch ($event.key) {
      case 'ArrowUp':
        this.increase();
        break;
      case 'ArrowDown':
        this.decrease();
        break;
    }
  }

  decrease() {
    const newValue = this.to?.step ? this.formControl.value - this.to.step : this.formControl.value - 1;
    if (this.to?.min ? newValue >= this.to.min : true) {
      this.formControl.setValue(newValue);
    }
  }

  increase() {
    const newValue = this.to?.step ? this.formControl.value + this.to.step : this.formControl.value + 1;
    if (this.to?.max ? newValue <= this.to.max : true) {
      this.formControl.setValue(newValue);
    }
  }
}
