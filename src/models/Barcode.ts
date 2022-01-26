import { Sku } from '@models/Sku';

export type Barcode = {
  barcode: string;
  size: string;
  size_region: string;
  verified: boolean;
  source: boolean;
  sku: string & Sku;
};
