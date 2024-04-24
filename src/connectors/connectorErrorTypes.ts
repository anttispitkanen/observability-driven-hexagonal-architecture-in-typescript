/**
 * The base failure type, which all other failure types extend.
 * The Error is useful for logging and debugging, as it contains a stack trace.
 */
export type BaseFailure = {
  error: Error;
};

//
// TCP connection related failures
//
export type TcpConnectionError = {
  _tag: 'TcpConnectionError';
} & BaseFailure;

export type TcpTimeoutError = {
  _tag: 'TcpTimeoutError';
} & BaseFailure;

//
// Database related failures
//
export type DatabaseError = {
  _tag: 'DatabaseError';
} & BaseFailure;

//
// Restful HTTP API related failures
//
export type BadRequest = {
  _tag: 'BadRequest';
  httpStatusCode: 400;
} & BaseFailure;

export type Unauthorized = {
  _tag: 'Unauthorized';
  httpStatusCode: 401;
} & BaseFailure;

export type Forbidden = {
  _tag: 'Forbidden';
  httpStatusCode: 403;
} & BaseFailure;

export type UpstreamServerError = {
  _tag: 'UpstreamServerError';
  httpStatusCode: 500;
} & BaseFailure;
