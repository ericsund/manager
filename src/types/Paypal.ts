namespace Paypal {
  export interface AuthData {
    intent: string;
    orderID: string;
    payerID: string;
    paymentID: string;
    returnUrl: string
  }

  interface Client {
    sandbox: string;
    production: string;
  }

  type Env = 'sandbox' | 'production';

  /*
  * Please note. The is not the full list of available props
  * but for our purposes, these are the ones we require
  */
  export interface PayButtonProps {
    env: Env;
    client: Client,
    onAuthorize: () => void;
    onCancel: () => void;
    onClick: () => void;
    payment: () => string;
  }
}