import { TestBed } from '@angular/core/testing';

import { RoleProjectService } from './role-project.service';

describe('RoleProjectService', () => {
  let service: RoleProjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoleProjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
