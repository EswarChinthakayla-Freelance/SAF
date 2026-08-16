import React, { Suspense, lazy } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { RouteErrorBoundary } from '@/components/common/RouteErrorBoundary'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'

// Route-Level Code Splitting (Public Marketing & Catalogue)
const HomePage = lazy(() => import('@/pages/public/HomePage'))
const CollectionsPage = lazy(() => import('@/pages/public/CollectionsPage'))
const CollectionDetailPage = lazy(() => import('@/pages/public/CollectionDetailPage'))
const ProductsPage = lazy(() => import('@/pages/public/ProductsPage'))
const ProductDetailPage = lazy(() => import('@/pages/public/ProductDetailPage'))
const ProductVisualViewerPage = lazy(() => import('@/pages/public/ProductVisualViewerPage'))
const GalleryPage = lazy(() => import('@/pages/public/GalleryPage'))
const GalleryInspectPage = lazy(() => import('@/pages/public/GalleryInspectPage'))
const AboutPage = lazy(() => import('@/pages/public/AboutPage'))
const ContactPage = lazy(() => import('@/pages/public/ContactPage'))
const SearchPage = lazy(() => import('@/pages/public/SearchPage'))
const NotFoundPage = lazy(() => import('@/pages/public/NotFoundPage'))

// Route-Level Code Splitting (Admin Control Panel)
const AdminLoginPage = lazy(() => import('@/pages/admin/AdminLoginPage'))
const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage'))
const AdminProductsPage = lazy(() => import('@/pages/admin/AdminProductsPage'))
const AdminProductNewPage = lazy(() => import('@/pages/admin/AdminProductNewPage'))
const AdminProductEditPage = lazy(() => import('@/pages/admin/AdminProductEditPage'))
const AdminCollectionsPage = lazy(() => import('@/pages/admin/AdminCollectionsPage'))
const AdminGalleryPage = lazy(() => import('@/pages/admin/AdminGalleryPage'))
const AdminInquiriesPage = lazy(() => import('@/pages/admin/AdminInquiriesPage'))
const AdminSettingsPage = lazy(() => import('@/pages/admin/AdminSettingsPage'))

/**
 * Route Suspense fallback wrapper with accessible loading status.
 */
const SuspenseWrapper: React.FC<{ children: React.ReactNode; label?: string }> = ({
  children,
  label = 'Loading view...',
}) => (
  <Suspense fallback={<LoadingSpinner fullScreen={false} label={label} />}>
    {children}
  </Suspense>
)

/**
 * Centralized Application Router
 * Sri Anjaneya Furnitures — Blueprint Version 2.0
 */
export const router = createBrowserRouter([
  // 1. Public Website Routes (anonymous access, wrapped in PageWrapper)
  {
    path: '/',
    element: <PageWrapper />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        index: true,
        element: (
          <SuspenseWrapper label="Loading Sri Anjaneya Furnitures...">
            <HomePage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'collections',
        element: (
          <SuspenseWrapper label="Loading Collections...">
            <CollectionsPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'collections/:slug',
        element: (
          <SuspenseWrapper label="Loading Collection...">
            <CollectionDetailPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'products',
        element: (
          <SuspenseWrapper label="Loading Furniture Catalogue...">
            <ProductsPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'products/:slug',
        element: (
          <SuspenseWrapper label="Loading Furniture Piece...">
            <ProductDetailPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'gallery',
        element: (
          <SuspenseWrapper label="Loading Inspiration Gallery...">
            <GalleryPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'about',
        element: (
          <SuspenseWrapper label="Loading Our Craft Heritage...">
            <AboutPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'contact',
        element: (
          <SuspenseWrapper label="Loading Bespoke Quote Request...">
            <ContactPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'search',
        element: (
          <SuspenseWrapper label="Searching Catalogue...">
            <SearchPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: '*',
        element: (
          <SuspenseWrapper label="Loading...">
            <NotFoundPage />
          </SuspenseWrapper>
        ),
      },
    ],
  },

  // 2. Dedicated Full-Page Product Visual Inspection (Light-Table Workspace)
  {
    path: '/products/:slug/view',
    errorElement: <RouteErrorBoundary />,
    element: (
      <SuspenseWrapper label="Loading Visual Inspection Workspace...">
        <ProductVisualViewerPage />
      </SuspenseWrapper>
    ),
  },

  // 3. Dedicated Full-Page Gallery Frame Inspection Studio
  {
    path: '/gallery/frame/:id',
    errorElement: <RouteErrorBoundary />,
    element: (
      <SuspenseWrapper label="Loading Inspiration Inspection Studio...">
        <GalleryInspectPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/gallery/:id',
    errorElement: <RouteErrorBoundary />,
    element: (
      <SuspenseWrapper label="Loading Inspiration Inspection Studio...">
        <GalleryInspectPage />
      </SuspenseWrapper>
    ),
  },

  // 4. Standalone Admin Authentication
  {
    path: '/admin/login',
    errorElement: <RouteErrorBoundary />,
    element: (
      <SuspenseWrapper label="Loading Admin Portal...">
        <AdminLoginPage />
      </SuspenseWrapper>
    ),
  },

  // 4. Protected Admin Control Panel Routes
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        index: true,
        element: (
          <SuspenseWrapper label="Loading ACP Dashboard...">
            <AdminDashboardPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'products',
        element: (
          <SuspenseWrapper label="Loading Catalogue Records...">
            <AdminProductsPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'products/new',
        element: (
          <SuspenseWrapper label="Loading New Product Editor...">
            <AdminProductNewPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'products/:id',
        element: (
          <SuspenseWrapper label="Loading Product Editor...">
            <AdminProductEditPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'products/:id/edit',
        element: (
          <SuspenseWrapper label="Loading Product Editor...">
            <AdminProductEditPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'collections',
        element: (
          <SuspenseWrapper label="Loading Collections Manager...">
            <AdminCollectionsPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'gallery',
        element: (
          <SuspenseWrapper label="Loading Gallery Manager...">
            <AdminGalleryPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'inquiries',
        element: (
          <SuspenseWrapper label="Loading Quote Inquiries...">
            <AdminInquiriesPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'settings',
        element: (
          <SuspenseWrapper label="Loading Brand Settings...">
            <AdminSettingsPage />
          </SuspenseWrapper>
        ),
      },
    ],
  },
])

export const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />
}

export default AppRouter
