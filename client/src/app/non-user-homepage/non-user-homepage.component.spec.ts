import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonUserHomepageComponent } from './non-user-homepage.component';

describe('NonUserHomepageComponent', () => {
  let component: NonUserHomepageComponent;
  let fixture: ComponentFixture<NonUserHomepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NonUserHomepageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NonUserHomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
