import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WantJobComponent } from './want-job.component';

describe('WantJobComponent', () => {
  let component: WantJobComponent;
  let fixture: ComponentFixture<WantJobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WantJobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WantJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
