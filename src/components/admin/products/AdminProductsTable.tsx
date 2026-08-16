import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ProductStatusBadge } from './ProductStatusBadge'
import { ProductRowActions } from './ProductRowActions'
import { AdminProductMobileRow } from './AdminProductMobileRow'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatDate } from '@/utils/dates'
import { getMediaUrl } from '@/lib/media'
import { HugeiconsIcon } from '@hugeicons/react'
import { Image01Icon } from '@hugeicons/core-free-icons'
import type { ProductListItem } from '@/types/app'

export interface AdminProductsTableProps {
  products: ProductListItem[]
  onTogglePublish?: (product: ProductListItem) => void
  onDelete: (product: ProductListItem) => void
  isPendingPublish?: boolean
}

export const AdminProductsTable: React.FC<AdminProductsTableProps> = ({
  products,
  onTogglePublish,
  onDelete,
  isPendingPublish = false,
}) => {
  const navigate = useNavigate()

  return (
    <div className="bg-[#111111] border border-[#242424] rounded-none overflow-hidden shadow-sm">
      {/* Desktop & Tablet Table (>=640px) */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left text-xs text-[#F5F0E8] font-sans">
          <thead className="bg-[#141414] text-[#8A847A] uppercase text-[11px] font-medium border-b border-[#222222]">
            <tr>
              <th className="px-6 py-3.5 font-medium min-w-[240px]">Product</th>
              <th className="px-6 py-3.5 font-medium hidden md:table-cell">Code</th>
              <th className="px-6 py-3.5 font-medium hidden lg:table-cell">Collection</th>
              <th className="px-6 py-3.5 font-medium">Price</th>
              <th className="px-6 py-3.5 font-medium">Status</th>
              <th className="px-6 py-3.5 font-medium hidden xl:table-cell">Updated</th>
              <th className="px-6 py-3.5 text-right font-medium min-w-[120px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1C1C1C]">
            {products.map((product) => {
              const thumbUrl = product.cover_image_path
                ? getMediaUrl('product-images', product.cover_image_path, 'thumbnail')
                : null

              return (
                <tr
                  key={product.id}
                  onClick={() => navigate(`/admin/products/${product.id}`)}
                  className="hover:bg-[#161616] transition-colors cursor-pointer group"
                >
                  {/* Product Identity */}
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3.5">
                      <div className="w-14 h-14 rounded-none bg-[#161616] border border-[#2A2A2A] overflow-hidden shrink-0 flex items-center justify-center">
                        {thumbUrl ? (
                          <img
                            src={thumbUrl}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none'
                            }}
                          />
                        ) : (
                          <HugeiconsIcon icon={Image01Icon} className="w-5 h-5 text-[#555]" />
                        )}
                      </div>
                      <div className="min-w-0 space-y-0.5">
                        <div className="font-medium text-xs sm:text-sm text-[#F5F0E8] group-hover:text-[#E8B84B] transition-colors truncate">
                          {product.name}
                        </div>
                        <div className="text-[11px] text-[#7A746B] font-mono truncate max-w-xs">
                          {product.slug}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Product Code */}
                  <td className="px-6 py-3.5 whitespace-nowrap hidden md:table-cell">
                    <span className="font-mono text-xs text-[#D1CCC2]/90">
                      {product.product_code || '—'}
                    </span>
                  </td>

                  {/* Collection */}
                  <td className="px-6 py-3.5 whitespace-nowrap hidden lg:table-cell">
                    <span className="text-xs text-[#D1CCC2]/90">
                      {product.collections?.name || '—'}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="px-6 py-3.5 whitespace-nowrap">
                    <span className="font-mono text-xs font-semibold text-[#F5F0E8]">
                      {formatCurrency(product.price, product.currency)}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-3.5 whitespace-nowrap">
                    <ProductStatusBadge
                      isPublished={product.is_published}
                      onToggle={onTogglePublish ? () => onTogglePublish(product) : undefined}
                      isPending={isPendingPublish}
                      interactive={true}
                    />
                  </td>

                  {/* Updated Date */}
                  <td className="px-6 py-3.5 whitespace-nowrap text-[#7A746B] text-[11px] font-sans hidden xl:table-cell">
                    {formatDate(product.updated_at || product.created_at)}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-3.5 text-right whitespace-nowrap">
                    <ProductRowActions
                      product={product}
                      onTogglePublish={onTogglePublish}
                      onDelete={onDelete}
                      isPendingPublish={isPendingPublish}
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked List (<640px) */}
      <div className="sm:hidden p-3 space-y-2.5">
        {products.map((product) => (
          <AdminProductMobileRow
            key={product.id}
            product={product}
            onTogglePublish={onTogglePublish}
            onDelete={onDelete}
            isPendingPublish={isPendingPublish}
          />
        ))}
      </div>
    </div>
  )
}

export default AdminProductsTable
