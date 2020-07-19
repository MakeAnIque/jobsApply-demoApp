import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowJobsReceivedComponent } from './show-jobs-received.component';

describe('ShowJobsReceivedComponent', () => {
  let component: ShowJobsReceivedComponent;
  let fixture: ComponentFixture<ShowJobsReceivedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowJobsReceivedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowJobsReceivedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
