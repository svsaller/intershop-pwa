import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FieldType } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ish-text-input-field',
  templateUrl: './text-input-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextInputFieldComponent extends FieldType implements OnInit {
  formControl: FormControl;

  constructor(private translate: TranslateService) {
    super();
  }

  ngOnInit() {
    if (this.to?.placeholder) {
      this.to.placeholder = this.translate.instant(this.to.placeholder);
    }
  }
}
