export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  variant?: string;
  sku?: string;
}

export interface Cart {
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CartSummary {
  total: number;
  itemCount: number;
}

export interface UseCartReturn {
  items: Ref<CartItem[]>;
  isLoading: Ref<boolean>;
  cartCount: ComputedRef<number>;
  cartTotal: ComputedRef<number>;
  isEmpty: ComputedRef<boolean>;
  cartSummary: ComputedRef<CartSummary>;
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getItem: (productId: string) => CartItem | undefined;
}
