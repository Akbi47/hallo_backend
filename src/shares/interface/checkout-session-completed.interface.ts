interface AutomaticTax {
  enabled: boolean;
  status: string | null;
}

interface CustomerDetails {
  city: string | null;
  country: string;
  line1: string | null;
  line2: string | null;
  postal_code: string | null;
  state: string | null;
  email: string | null;
  name: string;
  phone: string | null;
  tax_exempt: string;
  tax_ids: any[];
}

interface CheckoutSessionData {
  id: string;
  object: string;
  after_expiration: string | null;
  allow_promotion_codes: string | null;
  amount_subtotal: number;
  amount_total: number;
  automatic_tax: AutomaticTax;
  billing_address_collection: string | null;
  cancel_url: string;
  client_reference_id: string | null;
  consent: string | null;
  consent_collection: string | null;
  created: number;
  currency: string;
  currency_conversion: string | null;
  custom_fields: any[];
  custom_text: {
    shipping_address: string | null;
    submit: string | null;
  };
  customer: string | null;
  customer_creation: string;
  customer_details: CustomerDetails;
  customer_email: string | null;
  expires_at: number;
  invoice: string | null;
  invoice_creation: {
    enabled: boolean;
    invoice_data: {
      account_tax_ids: string[] | null;
      custom_fields: any[] | null;
      description: string | null;
      footer: string | null;
      metadata: Record<string, any>;
      rendering_options: string | null;
    };
  };
  livemode: boolean;
  locale: string | null;
  metadata: Record<string, any>;
  mode: string;
  payment_intent: string;
  payment_link: string | null;
  payment_method_collection: string;
  payment_method_options: Record<string, any>;
  payment_method_types: string[];
  payment_status: string;
  phone_number_collection: {
    enabled: boolean;
  };
  recovered_from: string | null;
  setup_intent: string | null;
  shipping_address_collection: string | null;
  shipping_cost: string | null;
  shipping_details: string | null;
  shipping_options: any[];
  status: string;
  submit_type: string | null;
  subscription: string | null;
  success_url: string;
  total_details: {
    amount_discount: number;
    amount_shipping: number;
    amount_tax: number;
  };
  url: string | null;
}

export interface CheckoutSession {
  id: string;
  object: string;
  api_version: string;
  created: number;
  data: {
    object: CheckoutSessionData;
  };
  livemode: boolean;
  pending_webhooks: number;
  request: {
    id: string | null;
    idempotency_key: string | null;
  };
  type: string;
}
