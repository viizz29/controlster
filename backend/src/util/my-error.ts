export class AppError {
  private code: number;
  private msg: string;
  constructor(code: number, msg: string) {
    this.code = code;
    this.msg = msg;
  }
  getCode(): number {
    return this.code;
  }
  getMessage(): string {
    return this.msg;
  }
}

const myList = ['_', 'en', 'hin'];
export type ERROR_MESSAGE_LANGUAGE = '_' | 'en' | 'hin';

type MappedObject = {
  [K in (typeof myList)[number]]: string;
};

export type ERROR_MESSAGE_COLLECTION = { [key: number]: MappedObject };
