import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'ish-phone-field',
  templateUrl: './phone-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhoneFieldComponent extends FieldType {
  pattern: RegExp = /^(?:\+|00)[1-9]\d{0,2}(?: |\-)|((?: |-)[0-9]{3}(?: |-)[0-9]{4})|([0-9]{7,14})$/;
  formControl: FormControl;
}
