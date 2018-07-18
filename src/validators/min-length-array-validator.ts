import { FormArray, ValidatorFn } from "@angular/forms";

/**
 * Maps number values to word equivalent.
 * Just add your numbers here as needed.
 */
const numberToWord = {
  1: 'one'
};

/**
 * Returns a Validator Function that accepts
 * the FormArray injected into it.
 *
 * @param minLength
 * @param fieldName
 */
export function minLengthArrayValidator(minLength: number, fieldName: string): ValidatorFn {
  return (formArray: FormArray): {[key: string]: any} | null => {
    let trimmedArray = formArray.controls.filter(
      formGroup => formGroup.get(fieldName).value);

    return trimmedArray.length < minLength ? {
        'minLengthError': {
          'errorMsg': `At least ${numberToWord[minLength]} ${fieldName} is required.`
        }
      } : null;
  };
}
