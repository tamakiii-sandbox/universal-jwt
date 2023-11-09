#!/usr/bin/env node

'use strict';

import fs from 'fs';
import jwt from 'jsonwebtoken';
import { Command } from 'commander';

interface JWTResult {
  token: string;
  algorithm: string;
  expire: number;
}

interface JWTPayload {
  iat: number;
  exp: number;
  iss: number;
}

function generateJWT(pemPath: string, appId: number, algorithm: string, expire: number): JWTResult {
  const privateKey = fs.readFileSync(pemPath, 'utf8');
  const now = Math.floor(Date.now() / 1000);
  const payload: JWTPayload = {
    iat: now,
    exp: now + expire,
    iss: appId,
  };

  const token = jwt.sign(payload, privateKey, { algorithm });
  return { token, algorithm, expire };
}

const program = new Command();
program.version('1.0.0');

program
  .command('generate')
  .description('Generate JWT token')
  .option('-p, --pem <path>', 'Path to PEM file')
  .option('-a, --app_id <number>', 'Application ID', parseInt)
  .option('-A, --algorithm <algorithm>', 'JWT signing algorithm (default: RS256)', 'RS256')
  .option('-e, --expire <seconds>', 'Expiration time in seconds (default: 600)', (v) => parseInt(v), 600)
  .action((options) => {
    try {
      const result = generateJWT(options.pem, options.app_id, options.algorithm, options.expire);
      console.log(JSON.stringify(result));
    } catch (error) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  });

program.parse(process.argv);
