import { EmailFilterPipe } from './email-filter.pipe';

describe('EmailFilterPipe', () => {
  it('create an instance', () => {
    const pipe = new EmailFilterPipe();
    expect(pipe).toBeTruthy();
  });
});
