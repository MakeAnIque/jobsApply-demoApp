import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css'],
})
export class ServicesComponent implements OnInit {
  Trad: string | number = '0.0';
  Cloud: string | number = '0.0';
  netSaving: string | number = '0.0';
  cloudCom = 3.5;
  calculateForm: FormGroup;
  constructor(private fb: FormBuilder, private snackBar: MatSnackBar) {
    this.calculateForm = this.fb.group({
      email: new FormControl(null, [Validators.required]),
      commission: new FormControl(null, [Validators.required]),
      joins: new FormControl(null, [Validators.required]),
    });
  }

  ngOnInit(): void {}
  calculatePer() {
    if (!this.calculateForm.valid) {
      this.snackBar.open('Please Fill Required Fields', 'close', {
        duration: 2000,
      });
      return;
    }
    const { email, commission, joins } = this.calculateForm.value;
    let _1per = +email / 100;

    this.Trad = _1per * +commission * joins;
    this.Cloud = _1per * this.cloudCom * joins;

    this.netSaving = this.Trad - this.Cloud;
  }
}
