import { TestBed } from '@angular/core/testing';

import { languageService } from './language.service';

describe('languageService', () => {
  let service: languageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(languageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
