import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OsComponent } from './os.component';

describe('OsComponent', () => {
  let component: OsComponent;
  let fixture: ComponentFixture<OsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
