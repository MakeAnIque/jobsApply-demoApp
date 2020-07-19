import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AllApiRoutesService } from '../all-api-routes.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  constructor(private router: Router, private apiRoute: AllApiRoutesService) {}
  jobList;
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

  ngOnInit(): void {}
  ngAfterViewInit(): void {
    this.apiRoute.getAllJobPostList().subscribe((data) => {
      this.jobList = this.modifyDetails(data);
    });
  }
  receiveMessage($event) {
    console.log('comming');
    this.router.navigate(['/viewjobs', $event.empid, $event.jobid]);
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
      });
    });

    return temp;
  }

  modifyDate(_date) {
    let d = new Date(_date);

    let date = d.getDate();
    let month = d.getMonth();
    let Year = d.getFullYear();

    return `${date}/${month}/${Year}`;
  }
}
