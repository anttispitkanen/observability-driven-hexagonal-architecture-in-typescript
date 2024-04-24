import { TcpConnectionError, DatabaseError } from './connectorErrorTypes';

type RecordPaymentSuccess = {
  _tag: 'RecordPaymentSuccess';
};

export type RecordPaymentFailure = TcpConnectionError | DatabaseError;

type RecordPaymentResult = RecordPaymentSuccess | RecordPaymentFailure;

export type PaymentPersistingConnector = {
  recordPayment: (
    orderId: string,
    paymentId: string,
  ) => Promise<RecordPaymentResult>;
};

export const paymentPersistingConnector: PaymentPersistingConnector = {
  recordPayment: async (input) => {
    return {
      _tag: 'RecordPaymentSuccess',
    } satisfies RecordPaymentSuccess;
    // return {
    //   _tag: 'TcpConnectionError',
    //   error: new Error('Cannot connect to the database'),
    // } satisfies RecordPaymentFailure;
  },
};
