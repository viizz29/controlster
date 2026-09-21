import { Injectable, PipeTransform, ArgumentMetadata } from '@nestjs/common';
import Hashids from 'hashids';
import { getConfigOrThrow } from 'src/lib/config-utils';

let hashids: Hashids | null = null;

function getHashidsObject() {
  if (!hashids) {
    const HASHID_SALT = getConfigOrThrow('HASHID_SALT');
    hashids = new Hashids(HASHID_SALT, 10);
  }
  return hashids;
}

// 🔧 convert camelCase → snake_case
function toSnakeCase(str: string): string {
  return str
    .replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
    .toLowerCase();
}

// 🔍 check if key is ID-like
function isIdField(key: string): boolean {
  const snake = toSnakeCase(key);
  return key === 'id' || snake.endsWith('_id');
}

// 🔧 decode value
export function decodeValue(value: any): any {
  if (typeof value !== 'string' || !value) return value;

  const hashids = getHashidsObject();

  const hex = hashids.decodeHex(value);
  if (hex) {
    return BigInt(`0x${hex}`).toString();
  }

  const decoded = hashids.decode(value);

  if (decoded.length) {
    return decoded.length == 1 ? decoded[0] : decoded;
  }

  return value; // keep original if not decodable
}

// 🔁 recursive transform
function transformDeep(data: any): any {
  if (data === null || data === undefined) return data;

  // Array
  if (Array.isArray(data)) {
    return data.map(transformDeep);
  }

  // Object
  if (typeof data === 'object') {
    const result: any = {};

    for (const key of Object.keys(data)) {
      const value = data[key];

      if (isIdField(key)) {
        result[key] = decodeValue(value);
      } else {
        result[key] = transformDeep(value);
      }
    }

    return result;
  }

  return data;
}

@Injectable()
export class DecodeIdPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    // Only process incoming request data
    // console.log({ metadata, value });
    if (
      metadata.type === 'query' ||
      metadata.type === 'body'
      // || metadata.type === 'param'
    ) {
      const newValue = transformDeep(value);

      // console.log(newValue);

      return newValue;
    }
    // else if (metadata.type == 'param') {
    //   const newValue = isIdField(metadata.data as string)
    //     ? decodeValue(value)
    //     : value;

    //   console.log({ newValue });
    //   return newValue;
    // }

    // console.log({ value });

    return value;
  }
}
