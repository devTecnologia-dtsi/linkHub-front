import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleProjectComponent } from './role-project.component';

describe('RoleProjectComponent', () => {
  let component: RoleProjectComponent;
  let fixture: ComponentFixture<RoleProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleProjectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RoleProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
