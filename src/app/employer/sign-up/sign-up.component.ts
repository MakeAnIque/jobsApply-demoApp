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
import { AllApiRoutesService } from '../../all-api-routes.service';
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
    private signUpService: SignUpService,
    private apiRoute: AllApiRoutesService
  ) {
    /**
     * show pop for when user trying to visit postjobs without login
     */
    // const subsLoginRoute = this.router.events
    //   .pipe(filter((evt: any) => evt))
    //   .subscribe((events: RoutesRecognized[]) => {
    //     if (this.authService.tryingUrl !== undefined) {
    //       this.authService.tryingUrl
    //         .pipe(map((elem: string) => elem.split('/')[1]))
    //         .subscribe(() => {
    //           if (!this.authService.isLoggedIn) {
    //             this.snackBar.open('Please Login First.', 'close', {
    //               duration: 5000,
    //             });
    //           }
    //           this.authService.tryingUrl = undefined;
    //           subsLoginRoute.unsubscribe();
    //         });
    //     }
    //   });
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
      country: new FormControl('', Validators.required),
      pincode: new FormControl('', Validators.required),
      fullAddress: new FormControl('', Validators.required),

      companyDescription: new FormControl('', Validators.required),
      incorporated: new FormControl('', Validators.required),
      employeeStrength: new FormControl('', Validators.required),
      fundingAmount: new FormControl('', Validators.required),
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

      this.ImageInfo = {
        Name: fileRef.name,
        ImageSize: Math.floor(fileRef.size / 1024) + '',
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

    const {
      companyName,
      email,
      password,
      websiteUrl,
      companyDescription,
      employeeStrength,
      fundingAmount,
      incorporated,
    } = this.signForm.value;

    this.apiRoute
      .employerSignup(
        this.getFormData({
          EMPID: 0,
          EMPLOYERMAILID: email,
          EMPLOYERPASSWORD: password,
          EMPLOYERNAME: companyName,
          EMPLOYERURL: websiteUrl,
          EMPLOYERADDRESS: this.combineAddress(this.signForm),
          EMPLOYERLOGOFILE: '',
          EMPLOYERDESCRIPTION: companyDescription,
          EMPLOYERSTRENGTH: employeeStrength,
          EMPLOYERYEARINC: incorporated,
          EMPLOYERFUNDS: fundingAmount,
        })
      )
      .subscribe((signData: { message: string; registration: string }) => {
        if (signData.registration) {
          this.snackBar.open('Registration Done, By ' + companyName, 'close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
          });
          this.router.navigate(['/login']);
        } else {
          this.snackBar.open(email + ' Already Registered.', 'close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
          });
        }
      });
  }
  combineAddress(data: FormGroup): string {
    const { fullAddress, city, state, pincode, country } = this.signForm.value;

    return `${fullAddress}, ${pincode}, ${city}, ${state}, ${country}`;
  }

  getFormData(obj: any): any {
    if (this.file) {
      const fd = new FormData();

      Object.keys(obj).forEach((key) => {
        fd.append(key, obj[key]);
      });

      fd.append('companyLogo', this.file.nativeElement.files[0]);

      return fd;
    } else {
      return obj;
    }
  }
  ngOnViewInit() {}
  ngOnDestroy() {}
}
