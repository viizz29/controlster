import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
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

// 🔧 snake_case / kebab-case → camelCase
function toCamelCase(str: string): string {
  return str.replace(/[_-](\w)/g, (_, c) => c.toUpperCase());
}

function encodeValue(value: any): any {
  if (typeof value === 'number') {
    return getHashidsObject().encodeHex(BigInt(value).toString(16));
  }

  // Optional: handle numeric strings
  if (typeof value === 'string' && /^\d+$/.test(value)) {
    return getHashidsObject().encodeHex(BigInt(value).toString(16));
  }

  if (Array.isArray(value)) {
    return value.map(encodeValue);
  }

  return value;
}

function transformDeep(data: any): any {
  if (data === null || data === undefined) return data;

  // ✅ Sequelize instance → plain object
  if (typeof data.toJSON === 'function') {
    data = data.toJSON();
  }

  // ✅ Array
  if (Array.isArray(data)) {
    return data.map(transformDeep);
  }

  // ✅ Object
  if (typeof data === 'object') {
    const result: any = {};

    if (data?.transform == false) {
      delete data.transform;
      return data;
    }

    for (const key of Object.keys(data)) {
      const value = data[key];

      const camelKey = toCamelCase(key);

      // 👇 Check original key for ID pattern
      const isIdField =
        key === 'id' || key.endsWith('_id') || key.endsWith('Id');

      if (isIdField) {
        result[camelKey] = encodeValue(value);
      } else {
        result[camelKey] = transformDeep(value);
      }
    }

    return result;
  }

  return data;
}
@Injectable()
export class EncodeIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(map((data) => transformDeep(data)));
  }
}
