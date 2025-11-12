# 🛍️ ANAIS - Elegant Modest Fashion E-commerce

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-blue.svg)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3.0-blue.svg)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-2.0-green.svg)](https://supabase.com/)
[![Vite](https://img.shields.io/badge/Vite-6.4.1-yellow.svg)](https://vitejs.dev/)
[![PWA](https://img.shields.io/badge/PWA-Ready-orange.svg)](https://web.dev/progressive-web-apps/)

> **ANAIS** is a modern, elegant e-commerce platform specializing in modest fashion for the contemporary Algerian woman. Built with cutting-edge technologies for optimal performance and user experience.

## ✨ Features

### 🛒 Core E-commerce Features
- **Product Catalog**: Browse and search through fashion collections
- **User Authentication**: Secure signup/login with Supabase Auth
- **Shopping Cart**: Persistent cart with local storage integration
- **Checkout Process**: Secure payment processing (Cash on Delivery)
- **Order Management**: Complete order tracking and history
- **Product Reviews**: Customer feedback and ratings

### 👩‍💼 Admin Dashboard
- **Product Management**: Add, edit, delete products with image uploads
- **Order Management**: View and update order statuses
- **User Management**: Manage customer accounts
- **Analytics**: Sales and performance insights
- **Category Management**: Organize products by categories

### 🎨 User Experience
- **Responsive Design**: Mobile-first approach, works perfectly on all devices
- **Modern UI**: Inspired by Material Design 3 with elegant animations
- **Dark/Light Mode**: Adaptive theme support
- **Accessibility**: WCAG compliant with keyboard navigation
- **Performance**: Optimized loading with lazy loading and caching

### 📱 Progressive Web App (PWA)
- **Installable**: Can be installed as a native app
- **Offline Support**: Core functionality works offline
- **Push Notifications**: Ready for marketing notifications
- **Fast Loading**: Service worker caching for instant loads

## 🚀 Tech Stack

### Frontend
- **React 18** with TypeScript for type safety
- **Tailwind CSS** for modern, responsive styling
- **Framer Motion** for smooth animations
- **React Router** for client-side routing
- **React Query** for server state management

### Backend & Database
- **Supabase** (PostgreSQL + Auth + Storage + Edge Functions)
- **Row Level Security (RLS)** for data security
- **Real-time subscriptions** for live updates

### DevOps & Tools
- **Vite** for fast development and building
- **ESLint** for code quality
- **Prettier** for code formatting
- **GitHub Actions** for CI/CD
- **Vercel/Netlify** ready for deployment

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- GitHub account (for deployment)

## 🛠️ Installation

### 1. Clone the repository
```bash
git clone https://github.com/Gameminde/anais-ecommerce.git
cd anais-ecommerce
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Analytics (Optional)
VITE_GA_TRACKING_ID=your_google_analytics_id
VITE_FB_PIXEL_ID=your_facebook_pixel_id
```

### 4. Supabase Setup
1. Create a new project on [Supabase](https://supabase.com)
2. Run the SQL migrations in `supabase/migrations/`
3. Configure authentication providers
4. Set up storage buckets for product images

### 5. Development Server
```bash
npm run dev
```

Visit `http://localhost:5173` to see the application.

## 📁 Project Structure

```
anais-ecommerce/
├── public/                 # Static assets
│   ├── logos/             # Brand assets
│   └── manifest.json      # PWA manifest
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── admin/        # Admin-specific components
│   │   └── ui/           # Base UI components
│   ├── contexts/         # React contexts (Auth, Cart)
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utilities and configurations
│   ├── pages/            # Page components
│   │   └── admin/        # Admin dashboard pages
│   ├── utils/            # Helper functions
│   └── types/            # TypeScript type definitions
├── supabase/
│   ├── functions/        # Edge Functions
│   └── migrations/       # Database migrations
├── tailwind.config.js    # Tailwind CSS configuration
├── vite.config.ts        # Vite configuration
└── package.json          # Dependencies and scripts
```

## 🎯 Key Features Explained

### 🔐 Authentication & Security
- JWT-based authentication with Supabase
- Protected routes for admin and user areas
- Secure password hashing and validation
- Row Level Security on all database tables

### 🛒 Shopping Experience
- Intuitive product browsing with filters
- Advanced search functionality
- Wishlist and favorites
- Persistent shopping cart
- Guest checkout support

### 📊 Admin Dashboard
- Comprehensive order management
- Product inventory control
- Customer insights and analytics
- Content management system
- Automated reporting

### 📱 Mobile Optimization
- Touch-friendly interfaces
- Swipe gestures for image galleries
- Optimized performance on mobile networks
- Installable PWA experience

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on every push

### Netlify
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables

### Manual Deployment
```bash
# Build for production
npm run build

# Serve the dist folder on any static hosting
```

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format code with Prettier

# Testing
npm run test         # Run tests
npm run test:e2e     # Run end-to-end tests

# PWA & Performance
npm run build-pwa    # Build with PWA optimizations
npm run analyze      # Bundle size analysis
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Design Inspiration**: Material Design 3, Apple Design Guidelines
- **Icons**: Lucide React, Hero Icons
- **Fonts**: Google Fonts (Cormorant Garamond, Lato, Playfair Display)
- **Color Palette**: Carefully selected for Algerian fashion aesthetics

## 📞 Support

For support, email contact@anaisfashion.com or join our Discord community.

---

**Made with ❤️ for the modern Algerian woman**

#AlgerianFashion #ModestFashion #Ecommerce #PWA #React #TypeScript
- **Supabase** (PostgreSQL + Auth + Storage + Edge Functions)
- **Row Level Security (RLS)** for data security
- **Real-time subscriptions** for live updates

### DevOps & Tools
- **Vite** for fast development and building
- **ESLint** for code quality
- **Prettier** for code formatting
- **GitHub Actions** for CI/CD
- **Vercel/Netlify** ready for deployment

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- GitHub account (for deployment)

## 🛠️ Installation

### 1. Clone the repository
```bash
git clone https://github.com/Gameminde/anais-ecommerce.git
cd anais-ecommerce
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Analytics (Optional)
VITE_GA_TRACKING_ID=your_google_analytics_id
VITE_FB_PIXEL_ID=your_facebook_pixel_id
```

### 4. Supabase Setup
1. Create a new project on [Supabase](https://supabase.com)
2. Run the SQL migrations in `supabase/migrations/`
3. Configure authentication providers
4. Set up storage buckets for product images

### 5. Development Server
```bash
npm run dev
```

Visit `http://localhost:5173` to see the application.

## 📁 Project Structure

```
anais-ecommerce/
├── public/                 # Static assets
│   ├── logos/             # Brand assets
│   └── manifest.json      # PWA manifest
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── admin/        # Admin-specific components
│   │   └── ui/           # Base UI components
│   ├── contexts/         # React contexts (Auth, Cart)
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utilities and configurations
│   ├── pages/            # Page components
│   │   └── admin/        # Admin dashboard pages
│   ├── utils/            # Helper functions
│   └── types/            # TypeScript type definitions
├── supabase/
│   ├── functions/        # Edge Functions
│   └── migrations/       # Database migrations
├── tailwind.config.js    # Tailwind CSS configuration
├── vite.config.ts        # Vite configuration
└── package.json          # Dependencies and scripts
```

## 🎯 Key Features Explained

### 🔐 Authentication & Security
- JWT-based authentication with Supabase
- Protected routes for admin and user areas
- Secure password hashing and validation
- Row Level Security on all database tables

### 🛒 Shopping Experience
- Intuitive product browsing with filters
- Advanced search functionality
- Wishlist and favorites
- Persistent shopping cart
- Guest checkout support

### 📊 Admin Dashboard
- Comprehensive order management
- Product inventory control
- Customer insights and analytics
- Content management system
- Automated reporting

### 📱 Mobile Optimization
- Touch-friendly interfaces
- Swipe gestures for image galleries
- Optimized performance on mobile networks
- Installable PWA experience

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on every push

### Netlify
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables

### Manual Deployment
```bash
# Build for production
npm run build

# Serve the dist folder on any static hosting
```

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format code with Prettier

# Testing
npm run test         # Run tests
npm run test:e2e     # Run end-to-end tests

# PWA & Performance
npm run build-pwa    # Build with PWA optimizations
npm run analyze      # Bundle size analysis
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Design Inspiration**: Material Design 3, Apple Design Guidelines
- **Icons**: Lucide React, Hero Icons
- **Fonts**: Google Fonts (Cormorant Garamond, Lato, Playfair Display)
- **Color Palette**: Carefully selected for Algerian fashion aesthetics

## 📞 Support

For support, email contact@anaisfashion.com or join our Discord community.

---

**Made with ❤️ for the modern Algerian woman**

#AlgerianFashion #ModestFashion #Ecommerce #PWA #React #TypeScript
- **Supabase** (PostgreSQL + Auth + Storage + Edge Functions)
- **Row Level Security (RLS)** for data security
- **Real-time subscriptions** for live updates

### DevOps & Tools
- **Vite** for fast development and building
- **ESLint** for code quality
- **Prettier** for code formatting
- **GitHub Actions** for CI/CD
- **Vercel/Netlify** ready for deployment

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- GitHub account (for deployment)

## 🛠️ Installation

### 1. Clone the repository
```bash
git clone https://github.com/Gameminde/anais-ecommerce.git
cd anais-ecommerce
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Analytics (Optional)
VITE_GA_TRACKING_ID=your_google_analytics_id
VITE_FB_PIXEL_ID=your_facebook_pixel_id
```

### 4. Supabase Setup
1. Create a new project on [Supabase](https://supabase.com)
2. Run the SQL migrations in `supabase/migrations/`
3. Configure authentication providers
4. Set up storage buckets for product images

### 5. Development Server
```bash
npm run dev
```

Visit `http://localhost:5173` to see the application.

## 📁 Project Structure

```
anais-ecommerce/
├── public/                 # Static assets
│   ├── logos/             # Brand assets
│   └── manifest.json      # PWA manifest
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── admin/        # Admin-specific components
│   │   └── ui/           # Base UI components
│   ├── contexts/         # React contexts (Auth, Cart)
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utilities and configurations
│   ├── pages/            # Page components
│   │   └── admin/        # Admin dashboard pages
│   ├── utils/            # Helper functions
│   └── types/            # TypeScript type definitions
├── supabase/
│   ├── functions/        # Edge Functions
│   └── migrations/       # Database migrations
├── tailwind.config.js    # Tailwind CSS configuration
├── vite.config.ts        # Vite configuration
└── package.json          # Dependencies and scripts
```

## 🎯 Key Features Explained

### 🔐 Authentication & Security
- JWT-based authentication with Supabase
- Protected routes for admin and user areas
- Secure password hashing and validation
- Row Level Security on all database tables

### 🛒 Shopping Experience
- Intuitive product browsing with filters
- Advanced search functionality
- Wishlist and favorites
- Persistent shopping cart
- Guest checkout support

### 📊 Admin Dashboard
- Comprehensive order management
- Product inventory control
- Customer insights and analytics
- Content management system
- Automated reporting

### 📱 Mobile Optimization
- Touch-friendly interfaces
- Swipe gestures for image galleries
- Optimized performance on mobile networks
- Installable PWA experience

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on every push

### Netlify
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables

### Manual Deployment
```bash
# Build for production
npm run build

# Serve the dist folder on any static hosting
```

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format code with Prettier

# Testing
npm run test         # Run tests
npm run test:e2e     # Run end-to-end tests

# PWA & Performance
npm run build-pwa    # Build with PWA optimizations
npm run analyze      # Bundle size analysis
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Design Inspiration**: Material Design 3, Apple Design Guidelines
- **Icons**: Lucide React, Hero Icons
- **Fonts**: Google Fonts (Cormorant Garamond, Lato, Playfair Display)
- **Color Palette**: Carefully selected for Algerian fashion aesthetics

## 📞 Support

For support, email contact@anaisfashion.com or join our Discord community.

---

**Made with ❤️ for the modern Algerian woman**

#AlgerianFashion #ModestFashion #Ecommerce #PWA #React #TypeScript
- **Supabase** (PostgreSQL + Auth + Storage + Edge Functions)
- **Row Level Security (RLS)** for data security
- **Real-time subscriptions** for live updates

### DevOps & Tools
- **Vite** for fast development and building
- **ESLint** for code quality
- **Prettier** for code formatting
- **GitHub Actions** for CI/CD
- **Vercel/Netlify** ready for deployment

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- GitHub account (for deployment)

## 🛠️ Installation

### 1. Clone the repository
```bash
git clone https://github.com/Gameminde/anais-ecommerce.git
cd anais-ecommerce
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Analytics (Optional)
VITE_GA_TRACKING_ID=your_google_analytics_id
VITE_FB_PIXEL_ID=your_facebook_pixel_id
```

### 4. Supabase Setup
1. Create a new project on [Supabase](https://supabase.com)
2. Run the SQL migrations in `supabase/migrations/`
3. Configure authentication providers
4. Set up storage buckets for product images

### 5. Development Server
```bash
npm run dev
```

Visit `http://localhost:5173` to see the application.

## 📁 Project Structure

```
anais-ecommerce/
├── public/                 # Static assets
│   ├── logos/             # Brand assets
│   └── manifest.json      # PWA manifest
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── admin/        # Admin-specific components
│   │   └── ui/           # Base UI components
│   ├── contexts/         # React contexts (Auth, Cart)
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utilities and configurations
│   ├── pages/            # Page components
│   │   └── admin/        # Admin dashboard pages
│   ├── utils/            # Helper functions
│   └── types/            # TypeScript type definitions
├── supabase/
│   ├── functions/        # Edge Functions
│   └── migrations/       # Database migrations
├── tailwind.config.js    # Tailwind CSS configuration
├── vite.config.ts        # Vite configuration
└── package.json          # Dependencies and scripts
```

## 🎯 Key Features Explained

### 🔐 Authentication & Security
- JWT-based authentication with Supabase
- Protected routes for admin and user areas
- Secure password hashing and validation
- Row Level Security on all database tables

### 🛒 Shopping Experience
- Intuitive product browsing with filters
- Advanced search functionality
- Wishlist and favorites
- Persistent shopping cart
- Guest checkout support

### 📊 Admin Dashboard
- Comprehensive order management
- Product inventory control
- Customer insights and analytics
- Content management system
- Automated reporting

### 📱 Mobile Optimization
- Touch-friendly interfaces
- Swipe gestures for image galleries
- Optimized performance on mobile networks
- Installable PWA experience

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on every push

### Netlify
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables

### Manual Deployment
```bash
# Build for production
npm run build

# Serve the dist folder on any static hosting
```

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format code with Prettier

# Testing
npm run test         # Run tests
npm run test:e2e     # Run end-to-end tests

# PWA & Performance
npm run build-pwa    # Build with PWA optimizations
npm run analyze      # Bundle size analysis
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Design Inspiration**: Material Design 3, Apple Design Guidelines
- **Icons**: Lucide React, Hero Icons
- **Fonts**: Google Fonts (Cormorant Garamond, Lato, Playfair Display)
- **Color Palette**: Carefully selected for Algerian fashion aesthetics

## 📞 Support

For support, email contact@anaisfashion.com or join our Discord community.

---

**Made with ❤️ for the modern Algerian woman**

#AlgerianFashion #ModestFashion #Ecommerce #PWA #React #TypeScript#   D e p l o y   f i x   1 1 / 1 2 / 2 0 2 5   0 4 : 2 8 : 2 0  
 