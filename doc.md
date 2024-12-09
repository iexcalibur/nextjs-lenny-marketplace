# Lenny Marketplace - Technical Documentation

## Core Architecture Decisions

### Why Next.js App Router?
We chose Next.js App Router for several critical reasons:
1. **Server Components**: Optimizes initial page load and SEO
2. **Route Groups**: Organizes features by domain (cart, profile, etc.)
3. **Layout System**: Shares UI across routes while maintaining state
4. **Streaming**: Enables progressive rendering for better UX

### API Layer Design
The API layer (`lib/api.ts`) follows a specific pattern:

```typescript
const API_BASE = 'http://localhost:8080/api';

export const api = {
  async getProducts() {
    try {
      const res = await fetch(`${API_BASE}/products`, {
        headers: {
          'Accept': 'application/json'
        },
        credentials: 'include'
      });
      // Error handling and response formatting
    } catch (error) {
      // Consistent error handling
    }
  }
};
```

Key decisions:
1. **Centralized Configuration**: Single source for API endpoints
2. **Consistent Headers**: All requests include proper headers
3. **Error Handling**: Standardized error responses
4. **Type Safety**: TypeScript interfaces for request/response

### State Management Architecture
We implemented a custom hook-based state management system:

```typescript
export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Event-based updates
  useEffect(() => {
    const handleCartUpdate = () => {
      fetchCart();
    };
    
    window.addEventListener('cart-updated', handleCartUpdate);
    return () => window.removeEventListener('cart-updated', handleCartUpdate);
  }, []);

  // Optimistic updates
  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    // Update UI immediately
    setCartItems(prev => updateQuantityOptimistically(prev, productId, newQuantity));
    
    try {
      // API call
      await api.updateCartItem(productId, { quantity: newQuantity });
      // Dispatch event for other components
      window.dispatchEvent(new Event('cart-updated'));
    } catch (error) {
      // Rollback on failure
      setCartItems(prev => rollbackUpdate(prev, productId));
    }
  };
};
```

### Component Architecture
Each component follows a specific pattern:

```typescript
interface ComponentProps {
  // Strictly typed props
}

const Component: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // Local state management
  const [state, setState] = useState();

  // Side effects
  useEffect(() => {
    // Cleanup pattern
    return () => cleanup();
  }, [dependencies]);

  // Event handlers
  const handleEvent = useCallback(() => {
    // Event logic
  }, [dependencies]);

  // Render methods
  const renderSection = () => (
    // JSX
  );

  return (
    // Component JSX
  );
};
```

### Responsive Design System
We implement a mobile-first responsive design using Tailwind CSS breakpoints:

```typescript
// Base breakpoint system
const breakpoints = {
  sm: '640px',   // Small devices
  md: '768px',   // Medium devices
  lg: '1024px',  // Large devices
  xl: '1280px',  // Extra large devices
  '2xl': '1536px' // 2X large devices
};

// Example component using responsive classes
<div className="
  grid
  grid-cols-1 
  sm:grid-cols-2 
  lg:grid-cols-4 
  gap-4 
  sm:gap-6 
  place-items-center
">
```

### Profile Management System
The profile system uses a custom hook pattern for state management:

```typescript
interface ProfileState {
  orders: Order[];
  trendingProducts: Product[];
  summary: {
    totalItems: number;
    totalPurchase: number;
    discountCodes: string[];
    totalDiscount: number;
  };
}

const useProfile = () => {
  const [state, setState] = useState<ProfileState>(initialState);
  
  // Fetch profile data
  const fetchProfileData = async () => {
    const [orders, products] = await Promise.all([
      api.getOrders(),
      api.getTrendingProducts()
    ]);
    
    setState({
      orders,
      trendingProducts: products,
      summary: calculateSummary(orders)
    });
  };
  
  return {
    ...state,
    refreshProfile: fetchProfileData
  };
};
```

### Navigation System
The navigation system implements:
1. **Dynamic Route Handling**
2. **Mobile-Responsive Menu**
3. **Cart Badge Updates**

```typescript
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Cart badge listener
  useEffect(() => {
    const handleCartUpdate = () => {
      fetchCartCount();
    };
    
    window.addEventListener('cart-updated', handleCartUpdate);
    return () => window.removeEventListener('cart-updated', handleCartUpdate);
  }, []);
};
```

### Product Display System
The product display system includes:

1. **Lazy Loading Strategy**:
```typescript
const ProductGrid = () => {
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([]);
  const observerRef = useRef<IntersectionObserver>();
  
  // Intersection Observer for infinite scroll
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreProducts();
        }
      },
      { threshold: 0.5 }
    );
  }, []);
};
```

2. **Product Card Optimization**:
```typescript
const ProductCard = memo(({ product }: ProductCardProps) => {
  const [isImageLoaded, setImageLoaded] = useState(false);
  
  return (
    <div className="relative group">
      {/* Skeleton loader */}
      {!isImageLoaded && <ProductSkeleton />}
      
      {/* Product image with blur-up loading */}
      <Image
        src={product.image_url}
        onLoad={() => setImageLoaded(true)}
        className={cn(
          'transition-opacity duration-300',
          isImageLoaded ? 'opacity-100' : 'opacity-0'
        )}
      />
    </div>
  );
});
```

### Order Management System
The order system implements:

1. **Order Tracking**:
```typescript
interface OrderTracker {
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  timeline: {
    status: string;
    timestamp: Date;
    description: string;
  }[];
}

const useOrderTracking = (orderId: string) => {
  const [tracking, setTracking] = useState<OrderTracker>();
  
  // Real-time updates using WebSocket
  useEffect(() => {
    const ws = new WebSocket(`${WS_URL}/orders/${orderId}`);
    
    ws.onmessage = (event) => {
      const update = JSON.parse(event.data);
      setTracking(prev => ({
        ...prev,
        ...update
      }));
    };
    
    return () => ws.close();
  }, [orderId]);
};
```

2. **Order History Management**:
```typescript
const OrderHistory = () => {
  const { orders, loading } = useOrders();
  
  const groupedOrders = useMemo(() => {
    return orders.reduce((acc, order) => {
      const month = format(new Date(order.created_at), 'MMMM yyyy');
      if (!acc[month]) acc[month] = [];
      acc[month].push(order);
      return acc;
    }, {});
  }, [orders]);
};
```

### Promo Code System
The promo code system uses a state machine approach:

```typescript
type PromoState = 'idle' | 'validating' | 'applied' | 'error';

interface PromoSystem {
  state: PromoState;
  code: string | null;
  discount: number;
  error: string | null;
}

const promoReducer = (state: PromoSystem, action: PromoAction): PromoSystem => {
  switch (action.type) {
    case 'VALIDATE':
      return { ...state, state: 'validating' };
    case 'APPLY':
      return { 
        state: 'applied',
        code: action.payload.code,
        discount: action.payload.discount,
        error: null
      };
    case 'ERROR':
      return {
        ...state,
        state: 'error',
        error: action.payload.message
      };
    case 'RESET':
      return {
        state: 'idle',
        code: null,
        discount: 0,
        error: null
      };
    default:
      return state;
  }
};

// Usage in component
const PromoCodeSection = () => {
  const [promoState, dispatch] = useReducer(promoReducer, {
    state: 'idle',
    code: null,
    discount: 0,
    error: null
  });

  const handleApplyPromo = async (code: string) => {
    dispatch({ type: 'VALIDATE' });
    
    try {
      const result = await api.validatePromoCode(code);
      dispatch({
        type: 'APPLY',
        payload: {
          code,
          discount: result.discount
        }
      });
    } catch (error) {
      dispatch({
        type: 'ERROR',
        payload: { message: error.message }
      });
    }
  };

  return (
    <div>
      {promoState.state === 'validating' && <LoadingSpinner />}
      {promoState.state === 'error' && (
        <ErrorMessage message={promoState.error} />
      )}
      {promoState.state === 'applied' && (
        <DiscountApplied 
          code={promoState.code} 
          amount={promoState.discount} 
        />
      )}
    </div>
  );
};
```

The promo code system provides:
1. **State Management**: Clear states for the promo code lifecycle
2. **Error Handling**: Dedicated error states and messages
3. **Loading States**: Visual feedback during validation
4. **Type Safety**: Full TypeScript support for state and actions
5. **Optimistic Updates**: Immediate UI feedback with server validation

## Performance Optimizations

### Image Loading Strategy
```typescript
<Image
  src={product.image_url}
  alt={product.name}
  width={280}
  height={280}
  loading="lazy"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  className="object-contain"
  priority={isPriority} // True for above-the-fold images
/>
```

### Component Code Splitting
```typescript
const TrendingProducts = dynamic(() => import('./TrendingProducts'), {
  loading: () => <ProductSkeleton count={4} />,
  ssr: false
});
```

### New Optimizations Added

1. **Route Pre-fetching**:
```typescript
const ProductLink = ({ product }: ProductLinkProps) => {
  const router = useRouter();
  
  // Pre-fetch on hover
  const handleMouseEnter = () => {
    router.prefetch(`/products/${product.id}`);
  };
  
  return (
    <Link 
      href={`/products/${product.id}`}
      onMouseEnter={handleMouseEnter}
    >
      {product.name}
    </Link>
  );
};
```

2. **Virtualized Lists**:
```typescript
const VirtualizedProductList = () => {
  const { height, width } = useWindowSize();
  
  return (
    <VirtualList
      height={height}
      itemCount={products.length}
      itemSize={250}
      width={width}
    >
      {({ index, style }) => (
        <ProductCard
          product={products[index]}
          style={style}
        />
      )}
    </VirtualList>
  );
};
```

## Error Handling Strategy

### API Error Handling
```typescript
interface APIError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

const handleAPIError = (error: APIError) => {
  switch (error.code) {
    case 'INVALID_PROMO':
      return { type: 'warning', message: 'Invalid promo code' };
    case 'ITEM_OUT_OF_STOCK':
      return { type: 'error', message: 'Item no longer available' };
    default:
      return { type: 'error', message: 'An unexpected error occurred' };
  }
};
```

### Component Error Boundaries
```typescript
class ErrorBoundary extends React.Component {
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to error reporting service
    logError(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

## Testing Strategy

### Component Testing
```typescript
describe('CartItem', () => {
  it('updates quantity optimistically', async () => {
    const { getByRole, queryByText } = render(<CartItem />);
    
    // Click increment
    fireEvent.click(getByRole('button', { name: '+' }));
    
    // Assert immediate UI update
    expect(queryByText('2')).toBeInTheDocument();
    
    // Wait for API
    await waitFor(() => {
      expect(mockUpdateCart).toHaveBeenCalled();
    });
  });
});
```

### Integration Testing
```typescript
describe('Cart Flow', () => {
  it('completes checkout process', async () => {
    // Setup
    const { user } = renderWithAuth(<Cart />);
    
    // Add items
    await user.click(addToCartButton);
    
    // Apply promo
    await user.type(promoInput, 'DISCOUNT20');
    await user.click(applyButton);
    
    // Checkout
    await user.click(checkoutButton);
    
    // Assertions
    expect(mockCreateOrder).toHaveBeenCalled();
    expect(screen.getByText(/order confirmed/i)).toBeInTheDocument();
  });
});
```

