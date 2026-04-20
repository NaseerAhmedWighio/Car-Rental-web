export interface Address {
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  cityLocality: string;
  stateProvince: string;
  postalCode: string;
  countryCode: string;
  addressResidentialIndicator?: "unknown" | "yes" | "no";
}

export type ShippingAddress = {
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  cityLocality: string;
  stateProvince: string;
  postalCode: string;
  countryCode: string;
  addressResidentialIndicator: "unknown" | "yes" | "no";
};

interface Rate {
  rate_id: string;
  carrier_id: string;
  service_code: string;
  shipping_amount: {
    amount: number;
    currency: string;
  };
  carrier_friendly_name?: string;
  service_type?: string;
}

export interface trackingObjType {
  trackingNumber: string;
  carrierCode: string;
}

export interface Package {
  productId: string;
  name: string;
  weight: number;
  length: number;
  width: number;
  height: number;
}
