import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function forbiddenNameValidator(nameRe: RegExp[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const forbiddenArray = nameRe.map((text) => {
      return text.test(control.value);
    });
    const forbidden = forbiddenArray.some((value) => value);
    return !forbidden ? { forbiddenName: !forbidden } : null;
  };
}
