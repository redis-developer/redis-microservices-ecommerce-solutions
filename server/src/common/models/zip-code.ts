interface IZipCode {
  zipCode?: number;
  zipLocation?: {
    latitude?: number;
    longitude?: number;
  } | string,
  statusCode?: number
}

export type {
  IZipCode
}