import * as yup from 'yup';

class YupCls {
  static async validateSchema(
    _data: unknown,
    _schema: yup.AnySchema,
  ): Promise<unknown> {
    if (_data && _schema) {
      _data = await _schema
        .validate(_data, {
          strict: false,
          stripUnknown: true, //remove unknown properties
        })
        .catch((err) => {
          if (err) {
            const trimmedError = {
              name: err.name,
              details: err.errors,
            };
            throw trimmedError;
          }
        });

      _data = _schema.cast(_data); //safe type casting like string to date/ number..etc
    }

    return _data;
  }
}

export { YupCls };
