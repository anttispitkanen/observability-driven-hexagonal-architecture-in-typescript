import { TcpConnectionError, DatabaseError } from './connectorErrorTypes';

type InitializeOrderSuccess = {
  _tag: 'success';
  orderId: string;
};

export type InitializeOrderFailure = TcpConnectionError | DatabaseError;

type InitializeOrderResult = InitializeOrderSuccess | InitializeOrderFailure;

export type OrderPersistingConnector = {
  initializeOrder: () => Promise<InitializeOrderResult>;
};

export const orderPersistingConnector: OrderPersistingConnector = {
  initializeOrder: async () => {
    return {
      _tag: 'success',
      orderId: 'SomeOrderId',
    } satisfies InitializeOrderSuccess;
    // return {
    //   _tag: 'TcpConnectionError',
    //   error: new Error('Cannot establish connection to the database'),
    // } satisfies TcpConnectionError;
  },
};
