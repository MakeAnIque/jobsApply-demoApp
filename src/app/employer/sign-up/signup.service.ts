import { Injectable } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ValidationErrors,
} from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class SignUpService {
  constructor() {}

  //   getErrorMessage(form: FormGroup, validatorCheck: string) {

  //   }

  urlValidator(control: FormControl): ValidationErrors {
    let matched = control.value.match(
      /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi
    );
    if (matched) {
      return null;
    } else {
      return { urlIsInvalid: true };
    }
  }

  passwordMatch(control: FormControl) {
    console.log(control);
    let matcted = control.value.match(
      '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'
    );
    if (matcted) {
      return null;
    } else {
      return { passwordNotStrong: true };
    }
  }

  /**
   * read file as data
   * @param fileObj it is file obj
   */
  readImage(fileObj: File) {
    return new Promise((resolve, reject) => {
      const reader: FileReader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result;
        resolve(dataUrl);
      };
      reader.onerror = () => reject(new Error('File Reading Error'));
      reader.readAsDataURL(fileObj);
    });
  }
}
