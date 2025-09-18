import { TestBed } from '@angular/core/testing';

import { DigibeeService } from './digibee.service';

describe('DigibeeService', () => {
  let service: DigibeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DigibeeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
