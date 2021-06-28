import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldArrayType } from '@ngx-formly/core';

@Component({
  selector: 'ish-quickorder-repeat-form-section',
  templateUrl: './quickorder-repeat-form-section.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickorderRepeatFormSectionComponent extends FieldArrayType {
  addMultipleRows(rows: number) {
    for (let i = 0; i < rows; i++) {
      this.add();
    }
  }
}
