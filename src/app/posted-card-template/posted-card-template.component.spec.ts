import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostedCardTemplateComponent } from './posted-card-template.component';

describe('PostedCardTemplateComponent', () => {
  let component: PostedCardTemplateComponent;
  let fixture: ComponentFixture<PostedCardTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostedCardTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostedCardTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
