import { TestBed } from '@angular/core/testing';

import { CvlService } from './cvl.service';

describe('CvlService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CvlService = TestBed.get(CvlService);
    expect(service).toBeTruthy();
  });
});
