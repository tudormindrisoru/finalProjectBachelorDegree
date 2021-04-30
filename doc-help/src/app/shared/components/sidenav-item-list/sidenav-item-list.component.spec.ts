import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidenavItemListComponent } from './sidenav-item-list.component';

describe('SidenavItemListComponent', () => {
  let component: SidenavItemListComponent;
  let fixture: ComponentFixture<SidenavItemListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SidenavItemListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidenavItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
