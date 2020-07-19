import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { saveAs as importedSaveAs } from 'file-saver';
import { AllApiRoutesService } from '../all-api-routes.service';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-show-jobs-received',
  templateUrl: './show-jobs-received.component.html',
  styleUrls: ['./show-jobs-received.component.css'],
})
export class ShowJobsReceivedComponent implements OnInit {
  listOfReceJob = [];
  noPosted: string = '';
  constructor(
    private apiRoute: AllApiRoutesService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const { EMPID } = this.authService.demoTest.data[0];
    this.getPostedListFromCandidate(EMPID);
  }
  modifyData(d) {
    let temp = [];
    d.forEach((elem) => {
      temp.push({
        Name: elem.CANDIDATENAME,
        email: elem.CANDIDATEEMAILID,
        phone: elem.CANDIDATEPHONENO,
        cvorResume: elem.CANDIDATECVFILE,
        jobtitle: elem.JOBTITLE.split('~')[0],
      });
    });

    this.listOfReceJob = temp;
  }

  downloadCV(filename: string) {
    const makeUrl =
      environment.origin +
      '/' +
      'uploadFile' +
      '/' +
      'candidateCV' +
      '/' +
      filename;

    importedSaveAs(makeUrl, filename);
  }
  getPostedListFromCandidate(empid) {
    this.apiRoute.getEmployerRecJobS({ EMPID: empid }).subscribe((res: any) => {
      if (!res) {
        this.noPosted = 'No Received Jobs.';
      } else {
        this.modifyData(res.data);
        return res;
      }
    });
  }
}
