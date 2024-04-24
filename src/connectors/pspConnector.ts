import {
  BadRequest,
  BaseFailure,
  TcpConnectionError,
  Forbidden,
  Unauthorized,
  UpstreamServerError,
} from './connectorErrorTypes';

type MakePaymentSuccess = {
  _tag: 'MakePaymentSuccess';
  paymentId: string;
};

export type MakePaymentFailure =
  | TcpConnectionError
  | BadRequest
  | Unauthorized
  | Forbidden
  | UpstreamServerError
  | ({
      _tag: 'PaymentRejected';
    } & BaseFailure);

type MakePaymentResult = MakePaymentSuccess | MakePaymentFailure;

export type PspPaymentConnector = {
  makePayment: (orderId: string) => Promise<MakePaymentResult>;
};

export const pspConnector: PspPaymentConnector = {
  makePayment: async (orderId) => {
    return {
      _tag: 'MakePaymentSuccess',
      paymentId: 'SomePaymentId',
    } satisfies MakePaymentSuccess;
    // return {
    //   _tag: 'PaymentRejected',
    //   error: new Error('Payment was rejected by PSP'),
    // } satisfies MakePaymentFailure;
  },
};
