export interface PrintifyImage {
  src: string;
  variant_ids: number[];
  position: string;
  is_default: boolean;
}

export interface PrintifyVariant {
  id: number;
  title: string;
  price: number; // cents
  is_enabled: boolean;
  is_available: boolean;
  is_default: boolean;
}

export interface PrintifyProduct {
  id: string;
  title: string;
  description: string;
  images: PrintifyImage[];
  variants: PrintifyVariant[];
  visible: boolean;
}

export interface PrintifyProductsResponse {
  data: PrintifyProduct[];
}
