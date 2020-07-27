import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcriberNewsLetterComponent } from './subcriber-news-letter.component';

describe('SubcriberNewsLetterComponent', () => {
  let component: SubcriberNewsLetterComponent;
  let fixture: ComponentFixture<SubcriberNewsLetterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubcriberNewsLetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubcriberNewsLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
