import fs from 'fs';
import jwt from 'jsonwebtoken';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const argv = yargs(hideBin(process.argv))
  .usage('Usage: $0 <command> [options]')
  .command('generate', 'Generate JWT token')
  .example('$0 generate -p private.pem -a 12345', 'Generate JWT token with given PEM file and app_id')
  .alias('p', 'pem')
  .nargs('p', 1)
  .describe('p', 'Path to PEM file')
  .alias('a', 'app_id')
  .nargs('a', 1)
  .describe('a', 'Application ID')
  .alias('A', 'algorithm')
  .default('A', 'RS256')
  .describe('A', 'JWT signing algorithm (default: RS256)')
  .alias('e', 'expire')
  .default('e', 600)
  .describe('e', 'Expiration time in seconds (default: 600)')
  .demandOption(['p', 'a'])
  .help('h')
  .alias('h', 'help')
  .argv;

function generateJWT(pemPath, appId, algorithm, expire) {
  const privateKey = fs.readFileSync(pemPath, 'utf8');
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iat: now,
    exp: now + expire,
    iss: appId,
  };

  const token = jwt.sign(payload, privateKey, { algorithm });
  return { token, algorithm, expire };
}

if (argv._[0] === 'generate') {
  try {
    const result = generateJWT(argv.pem, argv.app_id, argv.algorithm, argv.expire);
    console.log(JSON.stringify(result));
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

