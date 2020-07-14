import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormControl,
  Validators,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-post-jobs',
  templateUrl: './post-jobs.component.html',
  styleUrls: ['./post-jobs.component.css'],
})
export class PostJobsComponent implements OnInit {
  postForm: FormGroup;
  loading: boolean = false;

  constructor(
    private router: Router,

    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder
  ) {
    /**
     * show pop for when user trying to visit postjobs without login
     */
  }

  ngOnInit() {
    this.postForm = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });
  }

  getErrorMessage(type: string) {
    let control = this.postForm.get(type);
    if (control.hasError('required')) {
      return 'Please enter ' + type + '.';
    }
    if (control.hasError('email')) {
      return 'Please enter Valid Email';
    } else {
      return '';
    }
  }

  ngOnViewInit() {}
  ngOnDestroy() {}
}
