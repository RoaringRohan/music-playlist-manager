import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopPlaylistsComponent } from './top-playlists.component';

describe('TopPlaylistsComponent', () => {
  let component: TopPlaylistsComponent;
  let fixture: ComponentFixture<TopPlaylistsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopPlaylistsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopPlaylistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
