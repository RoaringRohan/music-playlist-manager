import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DmcaNoticeTakedownPolicyComponent } from './dmca-notice-takedown-policy.component';

describe('DmcaNoticeTakedownPolicyComponent', () => {
  let component: DmcaNoticeTakedownPolicyComponent;
  let fixture: ComponentFixture<DmcaNoticeTakedownPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DmcaNoticeTakedownPolicyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DmcaNoticeTakedownPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
