import { sharedService } from './shared-service';

describe('sharedService', () => {
  it('should work', () => {
    expect(sharedService()).toEqual('shared-service');
  });
});
