import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-homejobshow',
  templateUrl: './homejobshow.component.html',
  styleUrls: ['./homejobshow.component.css'],
})
export class HomejobshowComponent implements OnInit {
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
  @Input() item: any;

  @Output() viewAndApply = new EventEmitter<{ empid: string; jobid: string }>();

  constructor() {}

  ngOnInit(): void {}
  sendMessage(empid: string, jobid: string) {
    this.viewAndApply.emit({ empid, jobid });
  }

  modifyImage(imageUrl) {
    if (imageUrl.split('uploadFIle')[1] === '/') {
      return (
        environment.origin + '/uploadFile' + '/staticFiles' + '/avatar.jpg'
      );
    } else {
      return imageUrl;
    }
  }
  visit(url) {
    console.log(url);
    let http = /http(s)?/g;

    if (!url.match(http)) {
      url = 'https://' + url;
    }
    // window.open(
    //   url,
    //   '_blank' // <- This is what makes it open in a new window.
    // );
    return url;
  }
}
