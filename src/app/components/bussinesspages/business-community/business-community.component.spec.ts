import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { BusinessCommunityComponent } from './business-community.component';

describe('BusinessCommunityComponent', () => {
  let component: BusinessCommunityComponent;
  let fixture: ComponentFixture<BusinessCommunityComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessCommunityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessCommunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
