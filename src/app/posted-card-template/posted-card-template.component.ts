import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-posted-card-template',
  templateUrl: './posted-card-template.component.html',
  styleUrls: ['./posted-card-template.component.css'],
})
export class PostedCardTemplateComponent implements OnInit {
  @Input() byU: string;
  constructor() {}

  ngOnInit(): void {}
}
