export class NAXTError extends Error {
  constructor(message: string, obj?: any) {
    super(`${message}\n${stringify(obj)}`);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = NAXTError.name;
  }
}

function stringify(obj: any): string {
  return JSON.stringify(obj, undefined, 2);
}
