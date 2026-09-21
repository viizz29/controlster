import { runCommandAndGetResultAsString } from './run-command-sync';
import os from 'os';

export const getIPV4AddressOfHost = (hostName: string) => {
  const result = runCommandAndGetResultAsString(`dig ${hostName} A +short`);
  return result.trim();
};

function isGlobalIPv6(address: string): boolean {
  const lower = address.toLowerCase();

  return (
    // Not loopback
    lower !== '::1' &&
    // Not link-local
    !lower.startsWith('fe80:') &&
    // Not unique local (fc00::/7)
    !lower.startsWith('fc') &&
    !lower.startsWith('fd') &&
    // Not multicast
    !lower.startsWith('ff')
  );
}

function isLocalIPv6(address: string): boolean {
  const lower = address.toLowerCase();
  return lower.startsWith('fe80:');
}

function isLocalIPv4(address: string): boolean {
  const lower = address.toLowerCase();
  return lower.startsWith('10.') || lower.startsWith('192.');
}

export function getGlobalIPv6(): string | null {
  const interfaces = os.networkInterfaces();

  for (const name of Object.keys(interfaces)) {
    const netInterface = interfaces[name];
    if (!netInterface) continue;

    for (const net of netInterface) {
      console.log(net.address);

      if (net.family === 'IPv6' && !net.internal && isGlobalIPv6(net.address)) {
        return net.address;
      }
    }
  }

  return null;
}

export function getLocalIPv6(): string | null {
  const interfaces = os.networkInterfaces();

  for (const name of Object.keys(interfaces)) {
    const netInterface = interfaces[name];
    if (!netInterface) continue;

    for (const net of netInterface) {
      // console.log(net.address, net.family, net.internal);

      if (net.family === 'IPv6' && !net.internal && isLocalIPv6(net.address)) {
        return net.address;
      }
    }
  }

  return null;
}

export function getLocalIPv4(): string | null {
  const interfaces = os.networkInterfaces();

  for (const name of Object.keys(interfaces)) {
    const netInterface = interfaces[name];
    if (!netInterface) continue;

    for (const net of netInterface) {
      // console.log(net.address);

      if (net.family === 'IPv4' && !net.internal && isLocalIPv4(net.address)) {
        return net.address;
      }
    }
  }

  return null;
}

export function getGlobalIPv4(): string | null {
  const interfaces = os.networkInterfaces();

  for (const name of Object.keys(interfaces)) {
    const netInterface = interfaces[name];
    if (!netInterface) continue;

    for (const net of netInterface) {
      // console.log(net.address);

      if (net.family === 'IPv4' && !net.internal && !isLocalIPv4(net.address)) {
        return net.address;
      }
    }
  }

  return null;
}
