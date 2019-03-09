import {FormControl} from '@angular/forms';

export class DestinationValidator {

  static validDestination(fc: FormControl) {
    if (fc.value.toLowerCase() === "abc123" || fc.value.toLowerCase() === "123abc") {
      return ({
        existingDestination: true,
      });
    } else {
      return null;
    }
  }
}
