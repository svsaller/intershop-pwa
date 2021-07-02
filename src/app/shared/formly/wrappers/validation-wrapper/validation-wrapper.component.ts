import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'ish-validation-wrapper',
  templateUrl: './validation-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ValidationWrapperComponent extends FieldWrapper implements OnInit {
  hideValidationIcons = false;

  ngOnInit() {
    this.to?.options?.forEach(options => {
      options.find(option => {
        if (option.hideValidationIcons) {
          this.hideValidationIcons = true;
        }
      });
    });
  }
}
