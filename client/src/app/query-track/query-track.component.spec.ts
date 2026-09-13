import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryTrackComponent } from './query-track.component';

describe('QueryTrackComponent', () => {
  let component: QueryTrackComponent;
  let fixture: ComponentFixture<QueryTrackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QueryTrackComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QueryTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
