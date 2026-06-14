#!/usr/bin/env node

const os = require('node:os');
const { spawn } = require('node:child_process');

const extraArgs = process.argv.slice(2);
const manualHost = process.env.EXPO_DEV_HOST || process.env.REACT_NATIVE_PACKAGER_HOSTNAME;

const preferredInterfacePattern = /^(wi-?fi|wlan|en0|en1|ethernet|eth0)$/i;
const goodInterfacePattern = /(wi-?fi|wlan|wireless|ethernet|en\d+|eth\d+)/i;
const virtualInterfacePattern = /(docker|veth|vEthernet|wsl|virtualbox|vmware|loopback|bridge|hyper-v|hyperv|utun|tailscale|zerotier|ham|npcap|bluetooth|thunderbolt bridge)/i;

function isPrivateLanAddress(address) {
  return (
    /^10\./.test(address) ||
    /^192\.168\./.test(address) ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(address)
  );
}

function isBadAddress(address) {
  return (
    address === '127.0.0.1' ||
    address.startsWith('127.') ||
    address.startsWith('169.254.') ||
    address === '0.0.0.0'
  );
}

function scoreInterface(name, address) {
  let score = 0;
  if (preferredInterfacePattern.test(name)) score += 80;
  else if (goodInterfacePattern.test(name)) score += 50;

  if (isPrivateLanAddress(address)) score += 30;
  if (/^192\.168\./.test(address)) score += 8;
  if (/^10\./.test(address)) score += 5;
  if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(address)) score += 3;
  if (virtualInterfacePattern.test(name)) score -= 100;

  return score;
}

function getCandidates() {
  const interfaces = os.networkInterfaces();
  const candidates = [];

  for (const [name, addresses] of Object.entries(interfaces)) {
    for (const addressInfo of addresses || []) {
      if (addressInfo.family !== 'IPv4') continue;
      if (addressInfo.internal) continue;
      if (isBadAddress(addressInfo.address)) continue;

      candidates.push({
        name,
        address: addressInfo.address,
        score: scoreInterface(name, addressInfo.address),
      });
    }
  }

  return candidates.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
}

function validateManualHost(host) {
  if (!/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) {
    return `EXPO_DEV_HOST must be an IPv4 address, received "${host}".`;
  }

  const parts = host.split('.').map(Number);
  if (parts.some((part) => part < 0 || part > 255)) {
    return `EXPO_DEV_HOST contains an invalid IPv4 octet, received "${host}".`;
  }

  if (isBadAddress(host)) {
    return `EXPO_DEV_HOST must not be localhost/link-local/unspecified, received "${host}".`;
  }

  return null;
}

function printCandidates(candidates) {
  if (candidates.length <= 1) return;

  console.log('Multiple LAN IPv4 addresses were found:');
  for (const candidate of candidates) {
    console.log(`  - ${candidate.address} (${candidate.name}, score ${candidate.score})`);
  }
}

const candidates = manualHost ? [] : getCandidates();
const host = manualHost || candidates[0]?.address;

if (manualHost) {
  const validationError = validateManualHost(manualHost);
  if (validationError) {
    console.error(validationError);
    process.exit(1);
  }
} else if (!host) {
  console.error('No usable LAN IPv4 address was found.');
  console.error('Set EXPO_DEV_HOST manually, for example: EXPO_DEV_HOST=192.168.1.23 npm run start:lan');
  process.exit(1);
}

if (!manualHost) {
  printCandidates(candidates);
}

process.env.REACT_NATIVE_PACKAGER_HOSTNAME = host;

console.log('Starting Expo in LAN mode');
console.log(`Using REACT_NATIVE_PACKAGER_HOSTNAME=${host}`);
console.log('If Expo Go cannot connect, make sure your phone and computer are on the same Wi-Fi.');
console.log('Fallback: npm run start:tunnel');

const command = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const child = spawn(command, ['expo', 'start', '--lan', ...extraArgs], {
  stdio: 'inherit',
  env: process.env,
  shell: false,
});

child.on('error', (error) => {
  console.error(`Failed to start Expo: ${error.message}`);
  process.exit(1);
});

child.on('close', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});
