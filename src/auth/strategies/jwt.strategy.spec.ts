import { JwtStrategy } from './jwt.strategy';

describe('Jwt', () => {
  it('should be defined', () => {
    expect(new JwtStrategy()).toBeDefined();
  });
});
