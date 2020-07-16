import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {
  FormControl,
  Validators,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { map } from 'rxjs/internal/operators/map';
import { Router, RoutesRecognized } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { filter } from 'rxjs/internal/operators/filter';

import { SignUpService } from './signup.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent implements OnInit {
  hide = true;
  cnfHide = true;
  signForm: FormGroup;
  loading: boolean = false;
  ImageInfo = {
    Name: '',
    ImageSize: '',
    ModifiedDate: '',
    type: '',
  };
  @ViewChild('companyLogo', { static: false }) file: ElementRef;
  @ViewChild('showImage', { static: false }) companyLogo: ElementRef;
  constructor(
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private signUpService: SignUpService
  ) {
    /**
     * show pop for when user trying to visit postjobs without login
     */
    const subsLoginRoute = this.router.events
      .pipe(filter((evt: any) => evt))
      .subscribe((events: RoutesRecognized[]) => {
        if (this.authService.tryingUrl != undefined) {
          this.authService.tryingUrl
            .pipe(map((elem: string) => elem.split('/')[1]))
            .subscribe(() => {
              if (!this.authService.isLoggedIn) {
                this.snackBar.open('Please Login First.', 'close', {
                  duration: 5000,
                });
              }

              subsLoginRoute.unsubscribe();
            });
        }
      });
  }

  ngOnInit() {
    this.signForm = this.formBuilder.group({
      companyName: new FormControl('', Validators.required),
      websiteUrl: new FormControl('', [
        Validators.required,
        this.signUpService.urlValidator.bind(this),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        this.signUpService.passwordMatch.bind(this),
      ]),
      confirmPassword: new FormControl('', [Validators.required]),

      city: new FormControl('', Validators.required),
      state: new FormControl('', Validators.required),
      fullAddress: new FormControl('', Validators.required),

      companyDescription: new FormControl('', Validators.required),
      incorporated: new FormControl('', Validators.required),
      employeeStrength: new FormControl('', Validators.required),
      fundingAmount: new FormControl(''),
    });
  }

  getErrorMessage(type: string) {
    let control = this.signForm.get(type);

    console.log(control);

    if (control.hasError('required')) {
      return 'Please enter url';
    }
    if (control.hasError('urlIsInvalid')) {
      return 'Please enter Valid Url';
    } else {
      return '';
    }
  }
  async imageChanged() {
    try {
      const fileRef = this.file.nativeElement.files[0];
      const fileObj = await this.signUpService.readImage(fileRef);
      this.companyLogo.nativeElement.src = fileObj;
      console.log(this.file.nativeElement.files[0]);
      this.ImageInfo = {
        Name: fileRef.name,
        ImageSize: fileRef.size,
        ModifiedDate: fileRef.lastModifiedDate,
        type: fileRef.type,
      };
    } catch (err) {
      throw err;
    }
  }

  send() {
    if (!this.signForm.valid) {
      this.snackBar.open('Please Fill Required Feilds', 'close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
      });
      return;
    }
    if (
      this.signForm.get('password').value !==
      this.signForm.get('confirmPassword').value
    ) {
      this.snackBar.open('Password Not Matched', 'close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
      });
      return;
    }
  }

  ngOnViewInit() {}
  ngOnDestroy() {}
}
