import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../auth.service';
import { AllApiRoutesService } from '../all-api-routes.service';
import { startWith, map } from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Observable } from 'rxjs/internal/Observable';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-view-job',
  templateUrl: './view-job.component.html',
  styleUrls: ['./view-job.component.css'],
})
export class ViewJobComponent implements OnInit {
  jobDetails: any = [];
  storeAllCurrentData: any;
  applyJobForm: FormGroup;
  loading: boolean = false;
  filename: string;
  size: string;
  @ViewChild('companyLogo', { static: false }) candidateCV: ElementRef;
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
  constructor(
    private apiRoute: AllApiRoutesService,
    private router: Router,
    private formBuilder: FormBuilder,
    private routerSub: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.initForm();
  }
  ngOnInit() {
    this.routerSub.params.subscribe((data: any) => {
      this.hitUrl(data);
      console.log(data);
    });
    // this.apiRoute.getJobPostedDetailTOVIew()
  }
  hitUrl(obj: { empid: string | number; jobid: string | number }) {
    const { jobid, empid } = obj;
    this.apiRoute
      .getJobPostedDetailTOVIew({
        JOBID: jobid,
        EMPID: empid,
      })
      .subscribe((data) => {
        if (!data) {
          return;
        }
        console.log(data);
        this.storeAllCurrentData = data;
        this.modifyDetails(data);
      });
  }
  modifyDetails(data) {
    let temp = [];
    data.forEach((elem) => {
      temp.push({
        postedDate: elem.JOBPOSTDATE,
        imageUrl: environment.origin + '/uploadFIle/' + elem.EMPLOYERLOGOFILE,
        companyName: elem.INDUSTRY,
        jobTitle: elem.JOBTITLE.split('~')[0],
        requirements: elem.JOBTITLE.split('~')[1],
        experience: elem.EXPERIENCERANGE + ' year',
        jobDescription: elem.JOBDESCRIPTION,
        salary:
          elem.CTCBUDGET.split('/')[0] +
          ' ' +
          elem.CTCBUDGET.split('/')[1] +
          '/' +
          elem.CTCBUDGET.split('/')[2],

        Address: elem.LOCATION,
        empId: elem.EMPID,
        jobId: elem.JOBID,
        jobType: this.jobType.find((accu) => +accu.id === +elem.JOBTYPEID).name,
        companyDescription: elem.EMPLOYERDESCRIPTION,
        companyEmpStrength: elem.EMPLOYERSTRENGTH,
        empUrl: this.modifyUrl(elem.EMPLOYERURL),
      });
    });
    this.jobDetails = temp;
  }
  modifyUrl(url) {
    if (!url.match(/[http(s)://]/g)) {
      return '//' + url;
    } else {
      return url;
    }
  }
  receiveMessage($event) {}
  initForm() {
    this.applyJobForm = this.formBuilder.group({
      fullName: new FormControl('', Validators.required),
      Email: new FormControl('', [Validators.required, Validators.email]),
      mobile: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      candidateSummary: new FormControl(''),
      CandidateCurrentEmp: new FormControl('', Validators.required),
      CandidateEduBackup: new FormControl('', Validators.required),
    });
  }
  send() {
    if (this.applyJobForm.invalid) {
      this.snackBar.open('Please Provide Required Details.', 'close', {
        duration: 2000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
      });
      return;
    }
    if (this.candidateCV.nativeElement.files.length === 0) {
      this.snackBar.open('Resume / CV is Required.', 'close', {
        duration: 1000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
      });
      return;
    }
    this.apiRoute
      .postCandidateJobDetails(this.getFormData(this.applyJobForm.value))
      .subscribe((data) => {
        if (!data.status) {
          this.snackBar.open('Something went wrong', 'close', {
            duration: 1000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
          });
        } else if (data.already) {
          this.snackBar.open('You Send Your Informations Already', 'close', {
            duration: 1000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
          });
        } else {
          this.snackBar.open('Your Information Sent successfully.', 'close', {
            duration: 1000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
          });
        }
      });
  }
  getFormData(value) {
    console.log(this.storeAllCurrentData);
    const {
      EMPID,
      JOBID,
      EMPLOYERNAME,
      EMPLOYERURL,
      JOBTITLE,
      JOBTYPEID,
      EMPLOYERMAILID,
    } = this.storeAllCurrentData[0];
    const fd = new FormData();
    Object.keys(value).forEach((elem) => {
      fd.append(elem, value[elem]);
    });
    fd.append('ID', '0');

    fd.append('EMPID', EMPID);
    fd.append('JOBID', JOBID);
    fd.append('EMPLOYERNAME', EMPLOYERNAME);
    fd.append('EMPLOYERURL', EMPLOYERURL);
    fd.append('JOBTITLE', JOBTITLE);
    fd.append(
      'JOBTYPEID',
      this.jobType.find((accu) => +accu.id === +JOBTYPEID).name
    );
    fd.append('EMPLOYERMAILID', EMPLOYERMAILID);
    if (this.candidateCV) {
      fd.append('CANDIDATECVFILE', this.candidateCV.nativeElement.files[0]);
    }
    return fd;
  }

  imageChanged() {
    try {
      const { name, size } = this.candidateCV.nativeElement.files[0];

      this.filename = name;
      this.size = Math.floor(size / 1024) + ' kb';
    } catch (err) {
      console.log(err);
    }
  }
  resetYourForm() {
    this.applyJobForm.reset();
    this.snackBar.open('Form Fields Reset', 'close', {
      duration: 2000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }
}
