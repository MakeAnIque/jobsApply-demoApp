import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-posted-card-template',
  templateUrl: './posted-card-template.component.html',
  styleUrls: ['./posted-card-template.component.css'],
})
export class PostedCardTemplateComponent implements OnInit {
  @Input() item: any;
  @Input() showButton: boolean;
  @Output() viewAndApply = new EventEmitter<{ empid: string; jobid: string }>();
  @Input() showOtherInfo: boolean;
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
