import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityPrivacyPolicyComponent } from './security-privacy-policy.component';

describe('SecurityPrivacyPolicyComponent', () => {
  let component: SecurityPrivacyPolicyComponent;
  let fixture: ComponentFixture<SecurityPrivacyPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecurityPrivacyPolicyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecurityPrivacyPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
