# Lenny - Online Marketplace

A modern e-commerce platform built with Next.js 15+, TypeScript, and Tailwind CSS.

---

## 🚀 Features

- **🛍️ Product Browsing and Searching**: Easily explore and search for products.
- **🛒 Shopping Cart Functionality**: Add, update, and remove products from your cart.
- **💳 Checkout Process**: Seamlessly checkout with promo code support.
- **👤 User Profile**: View order history and manage your account.
- **🎨 Responsive Design**: Optimized for all devices with a sleek modern UI.
- **🔄 Real-Time Updates**: Real-time cart updates across sessions.
- **💅 Custom UI Components**: Reusable components for better scalability.

---

## 🛠 Tech Stack

- **Frontend Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Font**: Geist Font Family
- **Icons**: Lucide Icons

---

## 📂 Project Structure

```
frontend/
├── app/
│   ├── components/
│   │   ├── cart/          # Cart-related components
│   │   ├── layout/        # Layout components (Navbar, Footer)
│   │   ├── product/       # Product-related components
│   │   ├── profile/       # Profile-related components
│   │   └── ui/            # Reusable UI components
│   ├── lib/
│   │   └── api.ts         # API client configuration
│   ├── types/
│   │   └── index.ts       # TypeScript type definitions
│   ├── cart/
│   │   ├── page.tsx       # Cart page
│   │   └── index.ts       # Cart hooks and utilities
│   ├── profile/
│   │   └── page.tsx       # Profile page
│   └── layout.tsx         # Root layout with Navbar and Footer
```

---

## 🧑‍💻 Getting Started

### Prerequisites

- **Node.js** 18+
- **npm** or **yarn**
- Backend server running at `http://localhost:8080`

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/iexcalibur/nextjs-lenny-marketplace.git
   cd nextjs-lenny-marketplace
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables**:
   Create a `.env.local` file in the root directory with the following content:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8080/api
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open the application**:
   Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 API Integration

The project integrates with a REST API for all backend operations. Below are the available endpoints:

### Product Endpoints

- `GET /api/products` - Fetch all products

### Cart Endpoints

- `GET /api/cart` - Retrieve cart items
- `POST /api/cart/add` - Add an item to the cart
- `PUT /api/cart/:id` - Update a cart item
- `DELETE /api/cart/:id` - Remove a cart item
- `POST /api/cart/checkout` - Checkout cart items

### Order Endpoints

- `GET /api/orders` - Fetch user order history

### Promo Code Endpoints

- `GET /api/admin/discount/active` - Fetch active promo code

---

## 🧩 Component Overview

### **Layout Components**

- **Navbar**: Global navigation bar with cart counter.
- **Footer**: Displays site information and links.

### **Product Components**

- **ProductCard**: Displays individual product details.
- **ProductGrid**: Grid layout for displaying a list of products.

### **Cart Components**

- **CartItem**: Displays individual cart items.
- **ProductSummaryCard**: Shows cart summary, including promo code input.
- **EmptyCart**: Displays a message when the cart is empty.

### **Profile Components**

- **AccountSummary**: Displays user's account and order statistics.
- **OrderHistory**: Displays the user's past orders.

---

## 🎨 UI Highlights

- **Responsive Design**: Built with Tailwind CSS to ensure a smooth experience across all devices.
- **Custom Components**: Modular and reusable components for scalability.
- **Modern Aesthetics**: Clean and minimalist UI inspired by the latest design trends.

---



