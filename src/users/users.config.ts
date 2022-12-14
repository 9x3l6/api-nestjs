import { registerAs } from "@nestjs/config";

export default registerAs('users', () => ({
  foo: 'bar',
}));