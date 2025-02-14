import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { AppAccessComponent } from './app-access.component';

describe('AppAccessComponent', () => {
  let component: AppAccessComponent;
  let fixture: ComponentFixture<AppAccessComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AppAccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
