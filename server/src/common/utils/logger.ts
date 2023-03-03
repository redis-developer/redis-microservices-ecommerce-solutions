/*
  basic console logger
*/
class LoggerCls {
  static getPureError(err: unknown) {
    return JSON.parse(JSON.stringify(err, Object.getOwnPropertyNames(err)));
  }

  static info(_message: string, _details?: unknown): void {
    if (_message) {
      if (!_details) {
        _details = null;
      } else {
        _details = JSON.stringify(_details, null, 4);
      }

      console.log(_message, { meta: _details });
      //other loggers can be added here
    }
  }

  static error(_message: string, _details?: unknown): void {
    if (_message) {
      if (!_details) {
        _details = null;
      }
      console.error(_message, { meta: _details });
      //other loggers can be added here
    }
  }
}

export { LoggerCls };
