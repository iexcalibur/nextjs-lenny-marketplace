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

## Feature Implementation Details

### Cart System
The cart system implements several key features:

1. **Unique Product Handling**:
```typescript
// In useProductCard hook
const handleAddToCart = async () => {
  const cart = await api.getCart("user123");
  const existingItem = cart.items.find(
    item => String(item.product_id) === String(product.id)
  );

  if (existingItem) {
    // Update quantity of existing item
    await api.updateCartItem(String(product.id), {
      userId: "user123",
      quantity: existingItem.quantity + 1
    });
  } else {
    // Add new unique item
    await api.addToCart({
      userId: "user123",
      productId: String(product.id),
      quantity: 1,
      price: product.price,
      name: product.name,
      imageUrl: product.imageUrl || ''
    });
  }
};
```

Key features:
- Maintains unique products in cart
- Updates quantities for existing items
- Preserves product details across updates

2. **Cart Badge System**:
```typescript
// In Navbar component
const fetchCartCount = async () => {
  const cart = await api.getCart("user123");
  // Shows number of unique products, not total quantity
  setCartCount(cart.items.length);
};
```

3. **Cart Item Consolidation**:
```typescript
// In CartPage component
const consolidatedCartItems = cartItems.reduce((acc, item) => {
  const existingItem = acc.find(i => i.product_id === item.product_id);
  if (existingItem) {
    existingItem.quantity += item.quantity;
  } else {
    acc.push({ ...item });
  }
  return acc;
}, [] as typeof cartItems);
```

### Product Management System

1. **Product Display**:
```typescript
const ProductCard = ({ product }: ProductCardProps) => {
  const { isLoading, handleAddToCart } = useProductCard(product);

  return (
    <div className="bg-white rounded-lg overflow-hidden">
      <Image
        src={product.imageUrl}
        alt={product.name}
        fill
        className="object-contain"
      />
      <div className="p-4">
        <h3>{product.name}</h3>
        <p>${product.price}</p>
        <Button
          text={isLoading ? 'Adding...' : 'Add to Cart'}
          onClick={handleAddToCart}
        />
      </div>
    </div>
  );
};
```

2. **Product Grid Layout**:
```typescript
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  {products.map((product) => (
    <ProductCard key={product.id} product={product} />
  ))}
</div>
```

### Profile System
The profile system tracks user activity and orders:

1. **Order Summary**:
```typescript
const calculateSummary = () => {
  if (!orders || orders.length === 0) {
    return {
      totalItems: 0,
      totalPurchase: 0,
      discountCodes: [],
      totalDiscount: 0
    };
  }

  const totalItems = orders.reduce((sum, order) => 
    sum + order.items.reduce((itemSum, item) => 
      itemSum + item.quantity, 0
    ), 0
  );

  // Other calculations...
};
```

2. **Account Summary Display**:
```typescript
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* Total Items */}
  <div className="bg-gray-50 p-4 rounded-lg">
    <h3>Total Items Purchased</h3>
    <p>{summary.totalItems || 0}</p>
  </div>
  
  {/* Other summary cards */}
</div>
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

// State transitions
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
    // Other cases...
  }
};
```

### Responsive Design System
The application implements a mobile-first approach:

```typescript
// Base breakpoint system
const breakpoints = {
  sm: '640px',   // Small devices
  md: '768px',   // Medium devices
  lg: '1024px',  // Large devices
  xl: '1280px'   // Extra large devices
};

// Example responsive component
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

## Technical Implementation Details

### Component Architecture Decisions

1. **Cart System Implementation**
```typescript
// Unique product handling with optimistic updates
const handleAddToCart = async (product) => {
  // Optimistic update
  setCartItems(prev => [...prev, product]);
  
  try {
    // Backend validation and update
    await api.addToCart(product);
  } catch (error) {
    // Rollback on failure
    setCartItems(prev => prev.filter(item => item.id !== product.id));
    handleError(error);
  }
};
```

2. **State Management Choices**
- Used React's Context API for global state
- Implemented custom hooks for business logic
- Maintained component-level state for UI

3. **Type Safety Implementation**
```typescript
// Strong typing for all interfaces
interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
}

interface CartItem extends Product {
  quantity: number;
}
```

### Performance Optimizations

1. **Image Loading**
- Implemented lazy loading
- Used Next.js Image optimization
- Added blur placeholders

2. **Code Splitting**
```typescript
// Dynamic imports for route-based code splitting
const ProductGrid = dynamic(() => import('./ProductGrid'), {
  loading: () => <Skeleton />,
  ssr: true
});
```

3. **Memoization**
```typescript
// Preventing unnecessary re-renders
const MemoizedProductCard = memo(ProductCard, (prev, next) => {
  return prev.id === next.id && prev.price === next.price;
});
```

### API Integration

1. **Error Handling**
```typescript
const api = {
  async getProducts() {
    try {
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new APIError(response.statusText);
      }
      return response.json();
    } catch (error) {
      handleAPIError(error);
    }
  }
};
```

2. **Data Fetching Strategy**
- Used SSR for initial page load
- Implemented client-side fetching for dynamic updates
- Added proper error boundaries

### Testing Strategy

1. **Unit Tests**
```typescript
describe('ProductCard', () => {
  it('handles add to cart', async () => {
    const { getByRole } = render(<ProductCard />);
    await userEvent.click(getByRole('button'));
    expect(mockAddToCart).toHaveBeenCalled();
  });
});
```

2. **Integration Tests**
- Cart flow testing
- Checkout process
- Error scenarios

### Responsive Design Implementation

1. **Mobile-First Approach**
```typescript
// Tailwind classes showing mobile-first design
<div className="
  w-full                // Base mobile style
  sm:w-1/2             // Tablet breakpoint
  lg:w-1/4             // Desktop breakpoint
  p-4                  // Base padding
  sm:p-6               // Larger padding on tablet
  lg:p-8               // Even larger on desktop
">
```

2. **Breakpoint Strategy**
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Project Structure
```
frontend/
├── app/
│   ├── components/    # Reusable UI components
│   │   ├── cart/     # Cart-related components
│   │   ├── product/  # Product-related components
│   │   └── ui/       # Generic UI components
│   ├── lib/          # Utilities and API
│   ├── types/        # TypeScript definitions
│   └── hooks/        # Custom React hooks
```

### Key Technical Decisions

1. **Next.js App Router**
- Better SEO optimization
- Improved performance
- Server-side rendering capabilities

2. **TypeScript**
- Type safety
- Better developer experience
- Reduced runtime errors

3. **Tailwind CSS**
- Rapid development
- Consistent styling
- Better performance

4. **Custom Hooks**
- Reusable business logic
- Better separation of concerns
- Easier testing

### Challenges and Solutions

1. **Cart State Management**
- Challenge: Maintaining consistent cart state
- Solution: Implemented optimistic updates with rollback

2. **Performance**
- Challenge: Large product lists
- Solution: Implemented virtualization and pagination

3. **Type Safety**
- Challenge: Complex nested types
- Solution: Created comprehensive type definitions

### Future Improvements

1. **Technical Enhancements**
- Add Redux for complex state
- Implement WebSocket for real-time updates
- Add service worker for offline support

2. **Performance Optimizations**
- Implement infinite scrolling
- Add request caching
- Optimize bundle size

3. **Testing**
- Add E2E tests with Cypress
- Improve test coverage
- Add performance testing

### Development Decisions Log

1. **State Management**
- Chose Context over Redux for simplicity
- Implemented custom hooks for reusability

2. **API Design**
- Created centralized API client
- Added proper error handling
- Implemented request caching

3. **Component Design**
- Used atomic design principles
- Implemented proper prop typing
- Added proper error boundaries

