import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnviromentComponent } from './enviroment.component';

describe('EnviromentComponent', () => {
  let component: EnviromentComponent;
  let fixture: ComponentFixture<EnviromentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnviromentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EnviromentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
