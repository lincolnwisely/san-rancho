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
  options: number[]; // option value ids
}

export interface PrintifyOptionValue {
  id: number;
  title: string;
  colors?: string[]; // hex, present on color options
}

export interface PrintifyOption {
  name: string;
  type: string; // "color" | "size" | ...
  values: PrintifyOptionValue[];
}

export interface PrintifyProduct {
  id: string;
  title: string;
  description: string;
  images: PrintifyImage[];
  variants: PrintifyVariant[];
  options: PrintifyOption[];
  visible: boolean;
  tags: string[];
  created_at: string; // "2026-10-01 13:41:57+00:00"
}

export interface PrintifyProductsResponse {
  data: PrintifyProduct[];
}
