import { Component, OnInit } from '@angular/core';
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
import { of } from 'rxjs/internal/observable/of';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent implements OnInit {
  signForm: FormGroup;
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
    this.signForm = this.formBuilder.group({
      companyName: new FormControl('', [Validators.required]),
      websiteUrl: new FormControl('', Validators.required),
      address: this.formBuilder.group({
        city: new FormControl('', Validators.required),
        state: new FormControl('', Validators.required),
        Address: new FormControl('', Validators.required),
      }),
    });
  }

  getErrorMessage(type: string) {
    let control = this.signForm.get(type);
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
        })
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
