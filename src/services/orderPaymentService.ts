import {
  InitializeOrderFailure,
  OrderPersistingConnector,
} from '../connectors/orderPersistingConnector';
import {
  PaymentPersistingConnector,
  RecordPaymentFailure,
} from '../connectors/paymentPersistingConnector';
import {
  PspPaymentConnector,
  MakePaymentFailure,
} from '../connectors/pspConnector';

//
// Service method return types
//
type CreateOrderSuccess = {
  _tag: 'CreateOrderSuccess';
  orderId: string;
  paymentId: string;
};

type CreateOrderFailure =
  | InitializeOrderFailure
  | MakePaymentFailure
  | RecordPaymentFailure
  | {
      _tag: 'UnknownFailure';
      error: unknown;
    };

/** A tagged union of the high level result, either a success or failure */
export type CreateOrderResult = CreateOrderSuccess | CreateOrderFailure;

type OrderPaymentService = {
  createOrder: () => Promise<CreateOrderResult>;
};

export const createOrderPaymentService = (
  orderPersistingConnector: OrderPersistingConnector,
  pspConnector: PspPaymentConnector,
  paymentPersistingConnector: PaymentPersistingConnector,
): OrderPaymentService => ({
  createOrder: async () => {
    //
    // The service method is an error boundary, so wrapping it in a try-catch
    //
    try {
      //
      // First we initialize the order to get its ID
      //
      const initializeOrderResult =
        await orderPersistingConnector.initializeOrder();

      if (initializeOrderResult._tag !== 'success') {
        return initializeOrderResult;
      }

      const { orderId } = initializeOrderResult;

      //
      // Then we make the payment to the PSP and get the payment ID
      //
      const pspPaymentResult = await pspConnector.makePayment(orderId);

      if (pspPaymentResult._tag !== 'MakePaymentSuccess') {
        return pspPaymentResult;
      }

      const { paymentId } = pspPaymentResult;

      //
      // Then we record the successful payment
      //
      const recordPaymentResult =
        await paymentPersistingConnector.recordPayment(orderId, paymentId);

      if (recordPaymentResult._tag !== 'RecordPaymentSuccess') {
        return recordPaymentResult;
      }

      //
      // No errors, return success result
      //
      return {
        _tag: 'CreateOrderSuccess',
        orderId: orderId,
        paymentId: paymentId,
      } satisfies CreateOrderSuccess;
    } catch (err) {
      // Coming here means that some error happened in the service itself (e.g.
      // accessing a property that didn't exist), or some error "leaked" from a
      // connector without being handled at that error boundary, so we must treat
      // it as an unknown failure.
      return {
        _tag: 'UnknownFailure',
        error: err,
      } satisfies CreateOrderFailure;
    }
  },
});
