export interface Address {
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  cityLocality: string;
  stateProvince: string;
  postalCode: string;
  countryCode: string;
  addressResidentialIndicator?: string;
}

export interface Rate {
  rateId: string;
  carrierFriendlyName: string;
  serviceType: string;
  shippingAmount: {
    amount: number;
    currency: string;
  };
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
