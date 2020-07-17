import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';

import { Router, RoutesRecognized } from '@angular/router';
import { filter, pairwise, mergeMap, delay, map } from 'rxjs/operators';
import { AuthService } from '../../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { of } from 'rxjs/internal/observable/of';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  loading: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder
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
    const source = of('d');

    source
      .pipe(
        map((elem) => {
          this.authService.isLoggedIn = true;
        }),
        delay(3000)
      )
      .subscribe((data) => {
        this.loading = false;
        this.router.navigate(['postjobs']);
      });
  }
  gotToSignUp() {
    this.router.navigate(['/signup']);
  }
  ngOnViewInit() {}
  ngOnDestroy() {}
}
