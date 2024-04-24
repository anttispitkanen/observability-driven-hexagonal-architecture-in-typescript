import { orderPersistingConnector } from '../connectors/orderPersistingConnector';
import { paymentPersistingConnector } from '../connectors/paymentPersistingConnector';
import { pspConnector } from '../connectors/pspConnector';
import { logger } from '../logger';
import {
  CreateOrderResult,
  createOrderPaymentService,
} from '../services/orderPaymentService';

const assertNever = (x: never): never => {
  throw new Error('Unexpected object: ' + x);
};

const reporter = {
  init: (): void => {
    logger.info('orderPaymentServiceCli: init');
  },
  reportResult: (result: CreateOrderResult): void => {
    if (result._tag === 'CreateOrderSuccess') {
      logger.info('orderPaymentServiceCli: CreateOrderSuccess', {
        orderId: result.orderId,
        paymentId: result.paymentId,
      });
      return;
    }

    switch (result._tag) {
      case 'TcpConnectionError':
        logger.error('orderPaymentServiceCli: ConnectionError', result);
        return;
      case 'DatabaseError':
        logger.error('orderPaymentServiceCli: DatabaseError', result);
        return;
      case 'BadRequest':
        logger.error('orderPaymentServiceCli: BadRequest', result);
        return;
      case 'Unauthorized':
        logger.error('orderPaymentServiceCli: Unauthorized', result);
        return;
      case 'Forbidden':
        logger.error('orderPaymentServiceCli: Forbidden', result);
        return;
      case 'UpstreamServerError':
        logger.error('orderPaymentServiceCli: PspInternalServerError', result);
        return;
      case 'PaymentRejected':
        logger.warn('orderPaymentServiceCli: PaymentRejected', result);
        return;
      case 'UnknownFailure':
        logger.error('orderPaymentServiceCli: UnknownFailure', result);
        return;
      default:
        return assertNever(result);
    }
  },
};

const orderPaymentService = createOrderPaymentService(
  orderPersistingConnector,
  pspConnector,
  paymentPersistingConnector,
);

/**
 * The view's main function.
 */
const main = async () => {
  reporter.init();

  const result = await orderPaymentService.createOrder();

  reporter.reportResult(result);
};

(async () => {
  await main();
})();
