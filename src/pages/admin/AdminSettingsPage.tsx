import React, { useState, useEffect } from 'react'
import { PageHeader } from '@/components/common/PageHeader'
import { AdminImageUploader } from '@/components/admin/AdminImageUploader'
import { GoldButton } from '@/components/brand/GoldButton'
import { useSiteSettings } from '@/hooks/queries/useSiteSettings'
import { useSettingsMutation } from '@/hooks/mutations/useSettingsMutation'
import { getMediaUrl } from '@/lib/media'
import { supabase } from '@/lib/supabase'
import { useAdminProducts } from '@/hooks/queries/useProducts'
import type { SiteSettingsUpdate } from '@/types/app'

type SettingsCategory =
  | 'general'
  | 'brand'
  | 'contact'
  | 'showroom'
  | 'homepage'
  | 'social'
  | 'featured'

interface CategoryItem {
  id: SettingsCategory
  label: string
  description: string
  icon: React.ReactNode
}

export const AdminSettingsPage: React.FC = () => {
  const { data: settings, isLoading, isError, error, refetch } = useSiteSettings()
  const { data: productsData } = useAdminProducts({ pageSize: 100 })
  const { saveSettings } = useSettingsMutation()

  const [activeCategory, setActiveCategory] = useState<SettingsCategory>('general')

  // Form State
  const [formData, setFormData] = useState<SiteSettingsUpdate>({
    brand_name: '',
    tagline: '',
    logo_path: null,
    email: '',
    phone: '',
    address: '',
    instagram_url: '',
    whatsapp_number: '',
    hero_heading: '',
    hero_subtext: '',
    showroom_hours: {
      mon_sat: '10:00 AM – 8:00 PM',
      sun: '10:00 AM – 2:00 PM',
    },
  })

  // Featured Products State
  const [featuredProductIds, setFeaturedProductIds] = useState<string[]>([])
  const [selectedAddProductId, setSelectedAddProductId] = useState<string>('')
  const [newUploadedLogo, setNewUploadedLogo] = useState<string | null>(null)

  const [isDirty, setIsDirty] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Initialize form data and featured products when loaded
  useEffect(() => {
    if (settings) {
      setFormData({
        brand_name: settings.brand_name || 'Sri Anjaneya Furnitures',
        tagline: settings.tagline || '',
        logo_path: settings.logo_path || null,
        email: settings.email || '',
        phone: settings.phone || '',
        address: settings.address || '',
        instagram_url: settings.instagram_url || '',
        whatsapp_number: settings.whatsapp_number || '',
        hero_heading: settings.hero_heading || '',
        hero_subtext: settings.hero_subtext || '',
        showroom_hours: settings.showroom_hours || {
          mon_sat: '10:00 AM – 8:00 PM',
          sun: '10:00 AM – 2:00 PM',
        },
      })
      setIsDirty(false)
    }
  }, [settings])

  // Load initial featured products from Supabase
  useEffect(() => {
    async function loadFeatured() {
      const { data, error } = await supabase
        .from('homepage_featured_products')
        .select('product_id, sort_order')
        .order('sort_order', { ascending: true })

      if (!error && data) {
        setFeaturedProductIds(data.map((row) => row.product_id))
      }
    }
    loadFeatured()
  }, [])

  // Prevent accidental close when dirty
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isDirty])

  const handleFieldChange = (field: keyof SiteSettingsUpdate, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setIsDirty(true)
    setSaveSuccess(false)
  }

  const handleAddFeaturedProduct = (productId: string) => {
    if (!productId || featuredProductIds.includes(productId)) return
    setFeaturedProductIds((prev) => [...prev, productId])
    setSelectedAddProductId('')
    setIsDirty(true)
    setSaveSuccess(false)
  }

  const handleRemoveFeaturedProduct = (productId: string) => {
    setFeaturedProductIds((prev) => prev.filter((id) => id !== productId))
    setIsDirty(true)
    setSaveSuccess(false)
  }

  const handleReorderFeatured = (currentIndex: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (targetIndex < 0 || targetIndex >= featuredProductIds.length) return

    setFeaturedProductIds((prev) => {
      const copy = [...prev]
      const [moved] = copy.splice(currentIndex, 1)
      copy.splice(targetIndex, 0, moved)
      return copy
    })
    setIsDirty(true)
    setSaveSuccess(false)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await saveSettings.mutateAsync({
        settings: formData,
        featuredProductIds,
        oldLogoPath: settings?.logo_path,
        newUploadedLogoPath: newUploadedLogo,
      })
      setIsDirty(false)
      setSaveSuccess(true)
      setNewUploadedLogo(null)
      setTimeout(() => setSaveSuccess(false), 3500)
    } catch (err) {
      console.error('Failed to save settings:', err)
      alert('Failed to save settings configuration.')
    }
  }

  const categories: CategoryItem[] = [
    {
      id: 'general',
      label: 'General',
      description: 'Brand identity & core naming',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      id: 'brand',
      label: 'Brand & Logo',
      description: 'Logomark and visual identity',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: 'contact',
      label: 'Contact & Concierge',
      description: 'Phone, email & showroom address',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: 'showroom',
      label: 'Showroom Hours',
      description: 'Visiting schedules & holiday hours',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: 'homepage',
      label: 'Homepage Hero',
      description: 'Cinematic title & subtext',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      id: 'featured',
      label: 'Featured Pieces',
      description: 'Homepage curated showcase',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
    },
    {
      id: 'social',
      label: 'Social Presence',
      description: 'Instagram & public channels',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      ),
    },
  ]

  // Showroom hours structured editor helpers
  const hoursObj =
    typeof formData.showroom_hours === 'object' && formData.showroom_hours !== null
      ? (formData.showroom_hours as Record<string, string>)
      : { mon_sat: '10:00 AM – 8:00 PM', sun: '10:00 AM – 2:00 PM' }

  const handleHoursChange = (key: string, val: string) => {
    const nextHours = { ...hoursObj, [key]: val }
    handleFieldChange('showroom_hours', nextHours)
  }

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-64 bg-[#171717] rounded" />
        <div className="h-96 bg-[#171717] rounded-none" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-8 text-center bg-[#111111] rounded-none border border-[#2A2A2A] space-y-3">
        <p className="text-xs text-red-400">{error?.message || 'Failed to load site settings.'}</p>
        <GoldButton onClick={() => refetch()} size="sm">
          Retry
        </GoldButton>
      </div>
    )
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 pb-24">
      {/* Header */}
      <PageHeader
        variant="admin"
        title="Brand & Showroom Settings"
        description="Manage brand identity, contact channels, showroom hours, and homepage narrative."
      />

      {/* Mobile Category Pills (Horizontal scrolling) */}
      <div className="flex lg:hidden items-center gap-2 overflow-x-auto pb-2 border-b border-[#2A2A2A]">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3.5 py-2 rounded-none text-xs font-mono whitespace-nowrap transition-all flex items-center gap-2 ${activeCategory === cat.id
              ? 'bg-[#171717] text-[#C9A84C] border border-[#C9A84C]/40 font-semibold'
              : 'text-[#9B958B] hover:text-[#F5F0E8] hover:bg-[#171717]/40'
              }`}
          >
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* ChatGPT-Style Grouped Settings Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Desktop Category Navigation Sidebar (approx 240px / 3 cols) */}
        <div className="hidden lg:block lg:col-span-4 bg-[#111111] border border-[#2A2A2A] rounded-none p-2 space-y-1 sticky top-6">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`w-full text-left p-3.5 rounded-none transition-all flex items-center gap-3 cursor-pointer ${isActive
                  ? 'bg-[#171717] text-[#C9A84C] border border-[#C9A84C]/30 shadow-sm'
                  : 'text-[#9B958B] hover:text-[#F5F0E8] hover:bg-[#171717]/50'
                  }`}
              >
                <div className={`${isActive ? 'text-[#C9A84C]' : 'text-[#7A746B]'}`}>{cat.icon}</div>
                <div className="min-w-0">
                  <div className="text-xs font-mono font-semibold truncate">{cat.label}</div>
                  <div className="text-[11px] text-[#7A746B] font-sans truncate font-light">
                    {cat.description}
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Right Active Settings Content Panel (8 cols) */}
        <div className="lg:col-span-8 bg-[#111111] border border-[#2A2A2A] rounded-none p-6 sm:p-8 space-y-8">
          {/* 1. General Category */}
          {activeCategory === 'general' && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-[#2A2A2A] pb-4">
                <h2 className="text-base font-serif font-bold text-[#F5F0E8]">General Identity</h2>
                <p className="text-xs text-[#9B958B]">Brand naming and public marketing tagline.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono uppercase text-[#F5F0E8] font-semibold">
                    Brand Name <span className="text-[#C9A84C]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.brand_name || ''}
                    onChange={(e) => handleFieldChange('brand_name', e.target.value)}
                    placeholder="Sri Anjaneya Furnitures"
                    className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-none px-4 py-3 text-xs sm:text-sm text-[#F5F0E8] focus:border-[#C9A84C] outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono uppercase text-[#F5F0E8] font-semibold">
                    Brand Tagline
                  </label>
                  <input
                    type="text"
                    value={formData.tagline || ''}
                    onChange={(e) => handleFieldChange('tagline', e.target.value)}
                    placeholder="Bespoke Solid Wood Craftsmanship"
                    className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-none px-4 py-3 text-xs sm:text-sm text-[#F5F0E8] focus:border-[#C9A84C] outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 2. Brand & Logo Category */}
          {activeCategory === 'brand' && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-[#2A2A2A] pb-4">
                <h2 className="text-base font-serif font-bold text-[#F5F0E8]">Brand Logomark</h2>
                <p className="text-xs text-[#9B958B]">Public logomark displayed in Navbar and Footer.</p>
              </div>

              <div className="space-y-4">
                {formData.logo_path ? (
                  <div className="space-y-3">
                    <div className="w-32 h-32 rounded-none bg-[#0A0A0A] border border-[#2A2A2A] p-3 flex items-center justify-center">
                      <img
                        src={getMediaUrl('brand-assets', formData.logo_path, 'card')}
                        alt="Brand Logomark"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleFieldChange('logo_path', null)}
                      className="text-xs text-red-400 hover:text-red-300 font-mono"
                    >
                      Remove Logo &rarr;
                    </button>
                  </div>
                ) : (
                  <AdminImageUploader
                    maxFiles={1}
                    onUploadFiles={async (files) => {
                      if (files.length === 0) return
                      const file = files[0]
                      const fileExt = file.name.split('.').pop()
                      const filePath = `logos/${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`
                      const { error: uploadErr } = await supabase.storage
                        .from('brand-assets')
                        .upload(filePath, file, { upsert: false })
                      if (uploadErr) throw uploadErr
                      handleFieldChange('logo_path', filePath)
                    }}
                  />
                )}
              </div>
            </div>
          )}

          {/* 3. Contact & Concierge Category */}
          {activeCategory === 'contact' && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-[#2A2A2A] pb-4">
                <h2 className="text-base font-serif font-bold text-[#F5F0E8]">Contact Channels</h2>
                <p className="text-xs text-[#9B958B]">Official concierge phone, email, and showroom location.</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono uppercase text-[#F5F0E8] font-semibold">
                      Concierge Email
                    </label>
                    <input
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => handleFieldChange('email', e.target.value)}
                      placeholder="concierge@srianjaneyafurnitures.com"
                      className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-none px-4 py-3 text-xs text-[#F5F0E8] focus:border-[#C9A84C] outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono uppercase text-[#F5F0E8] font-semibold">
                      Telephone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone || ''}
                      onChange={(e) => handleFieldChange('phone', e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-none px-4 py-3 text-xs text-[#F5F0E8] focus:border-[#C9A84C] outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono uppercase text-[#F5F0E8] font-semibold">
                    WhatsApp Concierge Number
                  </label>
                  <input
                    type="text"
                    value={formData.whatsapp_number || ''}
                    onChange={(e) => handleFieldChange('whatsapp_number', e.target.value)}
                    placeholder="+919876543210"
                    className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-none px-4 py-3 text-xs text-[#F5F0E8] focus:border-[#C9A84C] outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono uppercase text-[#F5F0E8] font-semibold">
                    Showroom Physical Address
                  </label>
                  <textarea
                    rows={3}
                    value={formData.address || ''}
                    onChange={(e) => handleFieldChange('address', e.target.value)}
                    placeholder="No. 42 Artisans Avenue, Woodcraft District, Bengaluru, Karnataka 560001"
                    className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-none p-3 text-xs text-[#F5F0E8] focus:border-[#C9A84C] outline-none leading-relaxed resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 4. Showroom Hours Category */}
          {activeCategory === 'showroom' && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-[#2A2A2A] pb-4">
                <h2 className="text-base font-serif font-bold text-[#F5F0E8]">Showroom Visiting Hours</h2>
                <p className="text-xs text-[#9B958B]">Structured schedule displayed in About and Contact pages.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono uppercase text-[#F5F0E8] font-semibold">
                    Monday – Saturday Schedule
                  </label>
                  <input
                    type="text"
                    value={hoursObj.mon_sat || ''}
                    onChange={(e) => handleHoursChange('mon_sat', e.target.value)}
                    placeholder="10:00 AM – 8:00 PM"
                    className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-none px-4 py-3 text-xs text-[#F5F0E8] focus:border-[#C9A84C] outline-none font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono uppercase text-[#F5F0E8] font-semibold">
                    Sunday Schedule
                  </label>
                  <input
                    type="text"
                    value={hoursObj.sun || ''}
                    onChange={(e) => handleHoursChange('sun', e.target.value)}
                    placeholder="10:00 AM – 2:00 PM"
                    className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-none px-4 py-3 text-xs text-[#F5F0E8] focus:border-[#C9A84C] outline-none font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 5. Homepage Hero Category */}
          {activeCategory === 'homepage' && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-[#2A2A2A] pb-4">
                <h2 className="text-base font-serif font-bold text-[#F5F0E8]">Homepage Hero Narrative</h2>
                <p className="text-xs text-[#9B958B]">Primary headline and introduction on the landing page.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono uppercase text-[#F5F0E8] font-semibold">
                    Hero Headline
                  </label>
                  <input
                    type="text"
                    value={formData.hero_heading || ''}
                    onChange={(e) => handleFieldChange('hero_heading', e.target.value)}
                    placeholder="Heirloom Woodcraft for Architectural Sanctuaries"
                    className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-none px-4 py-3 text-xs text-[#F5F0E8] focus:border-[#C9A84C] outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono uppercase text-[#F5F0E8] font-semibold">
                    Hero Subtext
                  </label>
                  <textarea
                    rows={3}
                    value={formData.hero_subtext || ''}
                    onChange={(e) => handleFieldChange('hero_subtext', e.target.value)}
                    placeholder="Preserving classical Indian artisanal joinery with contemporary European proportions..."
                    className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-none p-3 text-xs text-[#F5F0E8] focus:border-[#C9A84C] outline-none leading-relaxed resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 6. Featured Products Category */}
          {activeCategory === 'featured' && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-[#2A2A2A] pb-4">
                <h2 className="text-base font-serif font-bold text-[#F5F0E8]">Homepage Featured Pieces</h2>
                <p className="text-xs text-[#9B958B]">
                  Curated furniture showcase featured directly on the public homepage hero slider.
                </p>
              </div>

              {/* Add Product Selector */}
              <div className="p-4 bg-[#0A0A0A] border border-[#2A2A2A] rounded-none space-y-3">
                <label className="block text-xs font-mono uppercase text-[#F5F0E8] font-semibold">
                  Add Product to Featured Showcase
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <select
                    value={selectedAddProductId}
                    onChange={(e) => setSelectedAddProductId(e.target.value)}
                    className="w-full bg-[#111111] border border-[#2A2A2A] rounded-none px-4 py-2.5 text-xs text-[#F5F0E8] focus:border-[#C9A84C] outline-none"
                  >
                    <option value="">Select a published piece...</option>
                    {(productsData?.products || [])
                      .filter((p) => !featuredProductIds.includes(p.id))
                      .map((prod) => (
                        <option key={prod.id} value={prod.id}>
                          {prod.name} ({prod.product_code || prod.slug}) — ₹{prod.price.toLocaleString('en-IN')}
                        </option>
                      ))}
                  </select>
                  <GoldButton
                    type="button"
                    size="sm"
                    disabled={!selectedAddProductId}
                    onClick={() => handleAddFeaturedProduct(selectedAddProductId)}
                    className="w-full sm:w-auto shrink-0 text-xs"
                  >
                    + Add Piece
                  </GoldButton>
                </div>
              </div>

              {/* Featured List */}
              <div className="space-y-3">
                <div className="text-xs font-mono uppercase text-[#7A746B] font-semibold">
                  Currently Featured ({featuredProductIds.length})
                </div>

                {featuredProductIds.length === 0 ? (
                  <div className="p-8 text-center bg-[#0A0A0A] border border-[#2A2A2A] rounded-none text-xs text-[#9B958B]">
                    No featured pieces selected yet. Add pieces above to curate the homepage showcase.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {featuredProductIds.map((prodId, idx) => {
                      const prod = (productsData?.products || []).find((p) => p.id === prodId)
                      const thumbUrl = prod?.cover_image_path
                        ? getMediaUrl('product-images', prod.cover_image_path, 'thumbnail')
                        : null

                      return (
                        <div
                          key={prodId}
                          className="flex items-center justify-between gap-4 p-3 bg-[#0A0A0A] border border-[#2A2A2A] rounded-none group hover:border-[#C9A84C]/40 transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="font-mono text-xs text-[#C9A84C] font-semibold w-5">
                              #{idx + 1}
                            </span>
                            <div className="w-10 h-10 bg-[#171717] border border-[#2A2A2A] shrink-0 overflow-hidden">
                              {thumbUrl ? (
                                <img
                                  src={thumbUrl}
                                  alt={prod?.name || 'Featured'}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[9px] text-[#7A746B]">
                                  No Img
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-medium text-[#F5F0E8] truncate">
                                {prod?.name || `Product (${prodId.substring(0, 8)})`}
                              </div>
                              <div className="text-[11px] text-[#7A746B] font-mono">
                                {prod?.product_code || 'No SKU'} · ₹{prod?.price?.toLocaleString('en-IN') || '0'}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => handleReorderFeatured(idx, 'up')}
                              aria-label={`Move item ${idx + 1} up`}
                              className="p-1.5 text-xs text-[#9B958B] hover:text-[#C9A84C] disabled:opacity-20 disabled:cursor-not-allowed rounded hover:bg-[#171717]"
                            >
                              ▲
                            </button>
                            <button
                              type="button"
                              disabled={idx === featuredProductIds.length - 1}
                              onClick={() => handleReorderFeatured(idx, 'down')}
                              aria-label={`Move item ${idx + 1} down`}
                              className="p-1.5 text-xs text-[#9B958B] hover:text-[#C9A84C] disabled:opacity-20 disabled:cursor-not-allowed rounded hover:bg-[#171717]"
                            >
                              ▼
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveFeaturedProduct(prodId)}
                              className="p-1.5 text-xs text-red-400 hover:text-red-300 font-mono ml-2 rounded hover:bg-red-950/40"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 7. Social Category */}
          {activeCategory === 'social' && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-[#2A2A2A] pb-4">
                <h2 className="text-base font-serif font-bold text-[#F5F0E8]">Social & External Channels</h2>
                <p className="text-xs text-[#9B958B]">Public social media links displayed in Footer.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono uppercase text-[#F5F0E8] font-semibold">
                    Instagram Profile URL
                  </label>
                  <input
                    type="url"
                    value={formData.instagram_url || ''}
                    onChange={(e) => handleFieldChange('instagram_url', e.target.value)}
                    placeholder="https://instagram.com/srianjaneyafurnitures"
                    className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-none px-4 py-3 text-xs text-[#F5F0E8] focus:border-[#C9A84C] outline-none font-mono"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Save Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#111111]/95 border-t border-[#2A2A2A] backdrop-blur-md px-4 sm:px-8 py-3.5 shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="text-xs text-[#9B958B] hidden sm:flex items-center gap-2">
            {isDirty ? (
              <span className="text-[#E8B84B] font-mono font-medium">● Unsaved settings changes</span>
            ) : saveSuccess ? (
              <span className="text-emerald-400 font-mono font-medium">✓ Settings saved successfully</span>
            ) : (
              <span>Site settings synchronized</span>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 w-full sm:w-auto">
            <GoldButton
              type="submit"
              size="default"
              loading={saveSettings.isPending}
              loadingText="Saving Settings..."
              className="text-xs uppercase tracking-wider font-semibold px-6"
            >
              Save Changes
            </GoldButton>
          </div>
        </div>
      </div>
    </form>
  )
}

export default AdminSettingsPage
