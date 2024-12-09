# Lenny Marketplace - Technical Documentation

## 1. Core Architecture Decisions

### 1.1 Why Next.js App Router?
We chose Next.js App Router for several critical reasons:
1. **Server Components**: 
   - Optimizes initial page load and SEO
   - Reduces client-side JavaScript bundle size
   - Enables direct database queries in components
2. **Route Groups**: 
   - Organizes features by domain (e.g., cart, profile)
   - Enables better code organization and maintainability
   - Allows for feature-specific layouts
3. **Layout System**: 
   - Shares UI across routes while maintaining state
   - Reduces code duplication
   - Improves performance through partial rendering
4. **Streaming**: 
   - Enables progressive rendering for better UX
   - Reduces time to first byte (TTFB)
   - Improves perceived performance

```
frontend/
├── app/
│   ├── cart/                 # Cart feature
│   │   ├── page.tsx         # Cart page component
│   │   └── index.ts         # Cart hooks and utilities
│   ├── products/            # Products feature
│   │   ├── page.tsx         # Products listing page
│   │   └── index.ts         # Product-related hooks
│   ├── profile/             # User profile feature
│   │   └── page.tsx         # Profile page component
│   ├── components/          # Shared components
│   │   ├── cart/           
│   │   │   ├── CartItem.tsx
│   │   │   └── ProductSummaryCard.tsx
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   └── SecondHeroSection.tsx
│   │   ├── product/
│   │   │   └── ProductCard.tsx
│   │   ├── profile/
│   │   │   └── AccountSummary.tsx
│   │   └── ui/
│   │       └── Button.tsx
│   ├── lib/                 # Shared utilities
│   │   └── api.ts          # API client
│   ├── types/              # TypeScript definitions
│   ├── assets/             # Static assets
│   │   └── svg/
```


### 1.2 Key Technical Decisions
1. **Next.js App Router**:
   - Better SEO optimization through server-side rendering
   - Improved performance with automatic code splitting
   - Server-side rendering capabilities for faster initial loads
   - Built-in image optimization and caching

2. **TypeScript**:
   - Type safety to catch errors during development
   - Better developer experience with IDE support
   - Reduced runtime errors through static type checking
   - Self-documenting code through type definitions

3. **Tailwind CSS**:
   - Rapid development with utility-first approach
   - Consistent styling through design system
   - Better performance with minimal CSS output
   - Easy responsive design implementation

4. **Custom Hooks**:
   - Reusable business logic across components
   - Better separation of concerns
   - Easier testing through isolated logic
   - Improved code maintainability

---

## 2. API Layer Design
The API layer (`lib/api.ts`) follows a centralized and type-safe pattern:

```typescript
const API_BASE = 'http://localhost:8080/api';

export const api = {
  async getProducts() {
    try {
      const res = await fetch(`${API_BASE}/products`, {
        headers: { 'Accept': 'application/json' },
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch products');
      return res.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
};
```

---

## 3. State Management Architecture

### 3.1 Cart State Management
Our cart implementation uses a custom hook pattern with several key features:

1. **Event-Based Updates**:
   ```typescript
   useEffect(() => {
     const handleCartUpdate = () => {
       console.log('Cart update event received');
       setTimeout(fetchCart, 100);
     };

     window.addEventListener('cart-updated', handleCartUpdate);
     return () => {
       window.removeEventListener('cart-updated', handleCartUpdate);
     };
   }, []);
   ```
   - Uses custom events for cross-component communication
   - Implements debouncing for better performance
   - Ensures cleanup to prevent memory leaks

2. **Quantity Management**:
   ```typescript
   const handleQuantityChange = async (productId: string, newQuantity: number) => {
     if (newQuantity < 1) {
       await handleRemove(productId);
       return;
     }
     try {
       await api.updateCartItem(productId, { userId: "user123", quantity: newQuantity });
       await fetchCart();
       window.dispatchEvent(new Event('cart-updated'));
     } catch (error) {
       console.error('Failed to update quantity:', error);
     }
   };
   ```
   - Handles edge cases (quantity < 1)
   - Implements proper error handling
   - Updates UI optimistically
   - Notifies other components of changes

3. **Error Handling**:
   - Graceful degradation on API failures
   - User-friendly error messages
   - Automatic retry mechanisms
   - Error boundary integration

### 3.2 PromoCode System
Our promotion system implements several key features:

1. **Validation Logic**:
   ```typescript
   const handleApplyPromo = async () => {
     try {
       const response = await api.getActivePromo();
       if (response.code === promoInput.trim().toUpperCase()) {
         setIsPromoApplied(true);
         setPromoCode(response.code);
         setPromoInput('');
       } else {
         throw new Error('Invalid promo code');
       }
     } catch (error) {
       console.error(error);
     }
   };
   ```
   - Case-insensitive matching
   - Server-side validation
   - Proper error handling
   - User feedback mechanisms

2. **Discount Calculation**:
   - Percentage-based discounts
   - Multiple discount types support
   - Real-time total updates
   - Clear discount display

3. **State Management**:
   - Tracks application status
   - Maintains input state
   - Handles loading states
   - Provides error feedback

---

## 4. Component Architecture

### 4.1 Component Design Principles
- **Reusability**: Components are designed for use across features.
- **Type Safety**: Strict TypeScript typing for props and state.
- **Performance**: Optimized rendering with proper state management.

Example:
```typescript
interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    image_url: string;
    description: string;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const router = useRouter();
  
  return (
    <div 
      className="relative group cursor-pointer"
      onClick={() => router.push(`/products/${product.id}`)}
    >
      <Image
        src={product.image_url}
        alt={product.name}
        width={300}
        height={300}
        className="object-cover w-full rounded-lg"
        priority
      />
      <div className="mt-4">
        <h3 className="text-lg font-medium">{product.name}</h3>
        <p className="text-gray-600">${product.price.toFixed(2)}</p>
        <p className="text-sm text-gray-500 truncate">
          {product.description}
        </p>
      </div>
    </div>
  );
};
```

Key features of our component architecture:

1. **Type Safety**:
   - Strictly typed props using TypeScript interfaces
   - Proper React.FC typing for components

2. **Image Optimization**:
   - Using Next.js Image component for optimal loading
   - Proper image dimensions and priority handling

3. **Navigation**:
   - Integration with Next.js router
   - Proper event handling for navigation

4. **Styling**:
   - Tailwind CSS for consistent styling
   - Responsive design patterns
   - Interactive states (group hover, etc.)

---

## 5. Performance Optimizations

### 5.1 Image Loading Strategy

```typescript
<Image
  src={product.image_url}
  alt={product.name}
  loading="lazy"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  className="object-contain"
/>
```

### 5.2 Code Splitting

```typescript
const TrendingProducts = dynamic(() => import('./TrendingProducts'), {
  loading: () => <ProductSkeleton count={4} />,
  ssr: false,
});
```

---

## 6. Error Handling Strategy

### 6.1 API Error Handling
```typescript
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

### 6.2 Component Error Boundaries
```typescript
class ErrorBoundary extends React.Component {
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

---

## 7. Project Structure

This structure follows Next.js App Router conventions with:

1. **Feature-based Organization**:
   - Each major feature (cart, products, profile) has its own directory
   - Features contain their page components and related logic

2. **Shared Components**:
   - Organized by domain (cart, layout, product, etc.)
   - UI components separated for reusability

3. **Core Infrastructure**:
   - Centralized API client in `lib/`
   - Shared types and hooks
   - Asset management

4. **Component Categories**:
   - Layout components for page structure
   - Feature-specific components
   - Reusable UI components
   - Domain-specific components


---

## 8. Testing Strategy

### 8.1 Unit Testing
```typescript
describe('CartItem', () => {
  it('updates quantity optimistically', async () => {
    const { getByRole } = render(<CartItem />);
    fireEvent.click(getByRole('button', { name: '+' }));
    expect(screen.getByText('2')).toBeInTheDocument();
  });
});
```

### 8.2 Integration Testing
```typescript
describe('Cart Flow', () => {
  it('completes checkout process', async () => {
    const { user } = renderWithAuth(<Cart />);
    await user.click(addToCartButton);
    await user.type(promoInput, 'DISCOUNT20');
    await user.click(applyButton);
    await user.click(checkoutButton);
    expect(screen.getByText(/order confirmed/i)).toBeInTheDocument();
  });
});
```

---

## 9. Challenges and Solutions

### 9.1 Cart State Management
- **Challenge**: Maintaining consistent cart state
- **Solution**: Implemented optimistic updates with rollback

### 9.2 Performance
- **Challenge**: Large product lists
- **Solution**: Implemented virtualization and pagination

### 9.3 Type Safety
- **Challenge**: Complex nested types
- **Solution**: Created comprehensive type definitions

---

## 10. Development Decisions Log

### 10.1 State Management
- Chose Context over Redux for simplicity
- Implemented custom hooks for reusability

### 10.2 API Design
- Created centralized API client
- Added proper error handling
- Implemented request caching

### 10.3 Component Design
- Used atomic design principles
- Implemented proper prop typing
- Added proper error boundaries

