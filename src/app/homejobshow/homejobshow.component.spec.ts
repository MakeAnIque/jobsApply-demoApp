import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomejobshowComponent } from './homejobshow.component';

describe('HomejobshowComponent', () => {
  let component: HomejobshowComponent;
  let fixture: ComponentFixture<HomejobshowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomejobshowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomejobshowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
