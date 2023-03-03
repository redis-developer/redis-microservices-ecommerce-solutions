import crypto from 'crypto';

class CryptoCls {
  static hashString(_text: string): string {
    let hash = '';
    if (_text) {
      hash = crypto.createHash('sha256').update(_text).digest('hex');
    }
    return hash;
  }
}

export { CryptoCls };
