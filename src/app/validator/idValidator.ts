import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function notZeroValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const isZero = control.value === 0;
    return isZero ? { notZero: true } : null;
  };
}
