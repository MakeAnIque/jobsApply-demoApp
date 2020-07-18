import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  FormControl,
  Validators,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/auth.service';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs/internal/Observable';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { startWith } from 'rxjs/internal/operators/startWith';
import { map } from 'rxjs/internal/operators/map';
import { AllApiRoutesService } from '../../all-api-routes.service';
@Component({
  selector: 'app-post-jobs',
  templateUrl: './post-jobs.component.html',
  styleUrls: ['./post-jobs.component.css'],
})
export class PostJobsComponent implements OnInit {
  jobType = [
    {
      name: 'FULLTIME',
      id: 1,
    },
    {
      name: 'INTERN',
      id: 2,
    },
    {
      name: 'FREELANCER',
      id: 3,
    },
    {
      name: 'CO-FOUNDER',
      id: 4,
    },
  ];
  postJobGroup: FormGroup;
  loading: boolean = false;

  constructor(
    private router: Router,

    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private apiRoute: AllApiRoutesService
  ) {
    /**
     * show pop for when user trying to visit postjobs without login
     */
    this.initForm();
    this.filteredFruits = this.postJobGroup
      .get('requredSkills')
      .valueChanges.pipe(
        startWith(null),
        map((fruit: string | null) =>
          fruit ? this._filter(fruit) : this.allFruits.slice()
        )
      );
  }
  ngOnInit() {
    const {
      EMPLOYERMAILID,
      EMPID,
      EMPLOYERURL,
      EMPLOYERNAME,
    } = this.authService.demoTest.data[0];

    this.postJobGroup.patchValue({
      email: EMPLOYERMAILID,
      websiteUrl: EMPLOYERURL,
      companyName: EMPLOYERNAME,
    });
  }
  initForm() {
    this.postJobGroup = this.formBuilder.group({
      email: new FormControl({ value: '@gmail.com', disabled: true }),
      jobType: new FormControl(''),
      companyName: new FormControl({ value: 'amitabh', disabled: true }),
      websiteUrl: new FormControl({ value: 'http', disabled: true }),
      jobDescription: new FormControl('', Validators.required),
      amountSalary: new FormControl('', Validators.required),
      requredSkills: new FormControl('', Validators.required),
      expYear: new FormControl('', Validators.required),
      moneyType: new FormControl('', Validators.required),
      TimeType: new FormControl('', Validators.required),
      jobTitle: new FormControl('', Validators.required),
    });
  }
  /**
   * for chips input
   */
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl();
  filteredFruits: Observable<string[]>;
  fruits: string[] = [];
  allFruits: string[] = [
    'MEAN Stack',
    'MERN Stack',
    'MySQL Db',
    'AWS',
    'ExpressJs',
    'NodeJs',
    'DJango',
    'Python',
  ];

  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.fruits.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.postJobGroup.get('requredSkills').setValue(null);
  }

  remove(fruit: string): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.fruits.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = '';
    this.postJobGroup.get('requredSkills').setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allFruits.filter(
      (fruit) => fruit.toLowerCase().indexOf(filterValue) === 0
    );
  }
  /**
   * end of chips functionality
   */
  resetYourForm() {
    this.postJobGroup.get('jobType').setValue(null);

    this.postJobGroup.get('jobDescription').setValue(null);
    this.postJobGroup.get('amountSalary').setValue(null);
    this.postJobGroup.get('expYear').setValue(null);
    this.postJobGroup.get('moneyType').setValue(null);
    this.postJobGroup.get('TimeType').setValue(null);

    this.snackBar.open('Form Reset Successfully.', 'close', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }
  send() {
    if (!this.postJobGroup.invalid) {
      this.snackBar.open('Form InValid Fill Required Fields', 'close', {
        duration: 5000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
      });
    }
    const skillsName = this.getSkillsRequired(this.fruits);
    const {
      EMPID,
      EMPLOYERADDRESS,
      EMPLOYERNAME,
    } = this.authService.demoTest.data[0];
    const {
      expYear,
      jobDescription,
      amountSalary,
      moneyType,
      TimeType,
      jobType,
    } = this.postJobGroup.value;
    console.log(jobType);
    this.apiRoute
      .employerPostJob({
        JOBID: 0,
        EMPLOYERID: EMPID,
        JOBTITLE: skillsName,
        LOCATION: EMPLOYERADDRESS,
        JOBTYPEID: +jobType,
        EXPERIENCERANGE: expYear + '',
        JOBDESCRIPTION: jobDescription,
        CTCBUDGET: `${amountSalary}/${moneyType}/${TimeType}`,
        JOBPOSITIONS: 1,
        INDUSTRY: EMPLOYERNAME,
        FUNCTION: '',
        JOBPOSTDATE: this.getCurrentDate(),
      })
      .subscribe((postedJobStatus: any) => {
        if (postedJobStatus.status) {
          this.snackBar.open(
            'Your Job Has Been Posted Successfully.',
            'close',
            {
              duration: 5000,
              horizontalPosition: 'end',
              verticalPosition: 'top',
            }
          );
        } else {
          this.snackBar.open('Something Went Worng.', 'close', {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
          });
        }
      });
  }
  getCurrentDate() {
    let d = new Date();

    let month = d.getMonth() + 1;
    let date = d.getDate();
    let year = d.getFullYear();

    return `${year}/${month}/${date}`;
  }
  getSkillsRequired(list: Array<string>): string {
    if (list.length === 0) {
      return '';
    }
    return this.postJobGroup.value.jobTitle + '~' + list.join(',');
  }
  ngOnViewInit() {}
  ngOnDestroy() {}
}
