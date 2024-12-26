import { ComponentFixture, TestBed } from '@angular/core/testing';

import { languageComponent } from './language.component';

describe('languageComponent', () => {
  let component: languageComponent;
  let fixture: ComponentFixture<languageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [languageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(languageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
