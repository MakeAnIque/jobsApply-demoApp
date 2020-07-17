import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';

import { Router, RoutesRecognized } from '@angular/router';
import { filter, map, takeLast } from 'rxjs/operators';
import { AuthService } from '../../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AllApiRoutesService } from '../../all-api-routes.service';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  loading: boolean = false;
  tryingUrl$;

  constructor(
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private apiRoute: AllApiRoutesService
  ) {
    /**
     * show pop for when user trying to visit postjobs without login
     */
    const subsLoginRoute = this.router.events
      .pipe(filter((evt: any) => evt))
      .subscribe((events: RoutesRecognized[]) => {
        if (this.authService.tryingUrl) {
          this.tryingUrl$ = this.authService.tryingUrl
            .pipe(map((elem: string) => elem.split('/')[1]))
            .subscribe((data) => {
              if (!this.authService.isLoggedIn && data === 'postjobs') {
                this.snackBar.open('Please Login First.', 'close', {
                  duration: 1000,
                });
              }

              subsLoginRoute.unsubscribe();
            });
        }
      });
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });
  }

  getErrorMessage(type: string) {
    let control = this.loginForm.get(type);
    if (control.hasError('required')) {
      return 'Please enter ' + type + '.';
    }
    if (control.hasError('email')) {
      return 'Please enter Valid Email';
    } else {
      return '';
    }
  }

  send() {
    this.loading = true;
    const { email, password } = this.loginForm.value;
    const loginSubs$ = this.apiRoute
      .employerLogin({
        EMPLOYERMAILID: email,
        EMPLOYERPASSWORD: password,
      })
      .subscribe({
        next: (loginData: any) => {
          const { status } = loginData;
          if (status) {
            this.loading = false;
            this.setData(loginData);
            this.authService.isLoggedIn = true;
            this.router.navigate(['/postjobs']);
          } else {
            this.loading = false;
            this.snackBar.open(
              'Login failed please check credential.',
              'close',
              {
                duration: 5000,
                horizontalPosition: 'end',
                verticalPosition: 'top',
              }
            );
          }
        },
      });
  }
  setData(data) {
    this.authService.demoTest = data;
  }
  gotToSignUp() {
    this.router.navigate(['/signup']);
  }
  ngOnViewInit() {}
  ngOnDestroy() {
    if (this.tryingUrl$) {
      this.tryingUrl$.unsubscribe();
      this.authService.tryingUrl = null;
    }
  }
}
