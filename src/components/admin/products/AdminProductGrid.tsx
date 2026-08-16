import React from 'react'
import { AdminProductCard } from './AdminProductCard'
import type { ProductListItem } from '@/types/app'

export interface AdminProductGridProps {
  products: ProductListItem[]
  onTogglePublish?: (product: ProductListItem) => void
  onDelete: (product: ProductListItem) => void
  isPendingPublish?: boolean
}

export const AdminProductGrid: React.FC<AdminProductGridProps> = ({
  products,
  onTogglePublish,
  onDelete,
  isPendingPublish = false,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
      {products.map((product) => (
        <AdminProductCard
          key={product.id}
          product={product}
          onTogglePublish={onTogglePublish}
          onDelete={onDelete}
          isPendingPublish={isPendingPublish}
        />
      ))}
    </div>
  )
}

export default AdminProductGrid
