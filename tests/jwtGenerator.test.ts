import fs from 'fs';
import { generateJWT } from '../src/index';

describe('generateJWT', () => {
  const privateKey = fs.readFileSync('path/to/your/private.pem', 'utf8');
  const appId = 12345;
  const algorithm = 'RS256';
  const expire = 600;

  test('should generate a valid JWT', () => {
    const result = generateJWT(privateKey, appId, algorithm, expire);
    expect(result).toHaveProperty('token');
    expect(result).toHaveProperty('algorithm', algorithm);
    expect(result).toHaveProperty('expire', expire);
  });
});
