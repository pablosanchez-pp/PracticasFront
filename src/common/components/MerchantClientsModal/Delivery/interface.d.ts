export interface MerchantClientsModalProps {
  open: boolean;
  merchant: Merchant | null;
  onClose: () => void;
}