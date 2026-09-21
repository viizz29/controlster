// decode-hashid.pipe.ts
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
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

@Injectable()
export class DecodeHashIdPipe implements PipeTransform {
  transform(value: string) {
    const hashids = getHashidsObject();

    const hex = hashids.decodeHex(value);
    if (hex) {
      return BigInt(`0x${hex}`).toString();
    }

    const decoded = hashids.decode(value);

    if (!decoded.length) {
      throw new BadRequestException('Invalid ID');
    }

    return decoded.length == 1 ? decoded[0] : decoded;
  }
}
