// sslcommerz-lts.d.ts

declare module 'sslcommerz-lts' {
  interface SSLCommerzPaymentOptions {
    store_id: string;
    store_passwd: string;
    is_live: boolean;
  }

  interface InitData {
    total_amount: number;
    currency: string;
    tran_id: string;
    success_url: string;
    fail_url: string;
    cancel_url: string;
    ipn_url: string;
    shipping_method: string;
    product_name: string;
    product_category: string;
    product_profile: string;
    cus_name: string;
    cus_email: string;
    cus_add1: string;
    cus_add2: string;
    cus_city: string;
    cus_state: string;
    cus_postcode: string;
    cus_country: string;
    cus_phone: string;
    cus_fax: string;
    ship_name: string;
    ship_add1: string;
    ship_add2: string;
    ship_city: string;
    ship_state: string;
    ship_postcode: number;
    ship_country: string;
    // Add any additional fields that might be optional
    [key: string]: unknown;
  }

  interface ApiResponse {
    GatewayPageURL: string;
    [key: string]: unknown;
  }

  class SSLCommerzPayment {
    // eslint-disable-next-line no-unused-vars
    constructor(store_id: string, store_passwd: string, is_live: boolean);
    // eslint-disable-next-line no-unused-vars
    init(data: InitData): Promise<ApiResponse>;
  }

  export default SSLCommerzPayment;
}
