export interface Merchant {
  id: string;
  name: string;
  address: string;
  merchantType: string;
  status: string;
  createdDate: string;
}
export const MERCHANT_TYPES = [
  {
    label: 'MERCHANT_TYPE_PERSONAL_SERVICES',
    value: 'MERCHANT_TYPE_PERSONAL_SERVICES',
  },
  {
    label: 'MERCHANT_TYPE_FINANCIAL_SERVICES',
    value: 'MERCHANT_TYPE_FINANCIAL_SERVICES',
  },
];