import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DbComponent } from './db.component';

describe('DbComponent', () => {
  let component: DbComponent;
  let fixture: ComponentFixture<DbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DbComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
