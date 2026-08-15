export interface Testimonial {
  id: string
  name: string
  location: string
  quote: string
  rating: number
  roomType: string
}

export const staticTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Rajesh & Sunita Sharma',
    location: 'Banjara Hills, Hyderabad',
    quote: 'The solid teak dining table and handcrafted chairs exceeded our expectations. The joinery, finish, and attention to detail from Sri Anjaneya Furnitures are truly world-class.',
    rating: 5,
    roomType: 'Dining Room',
  },
  {
    id: '2',
    name: 'Vikramaditya Reddy',
    location: 'Jubilee Hills, Hyderabad',
    quote: 'We commissioned custom executive office desks and sacred pooja mandir wood carvings. The craftsmanship and noble hardwood quality are remarkable.',
    rating: 5,
    roomType: 'Executive Office',
  },
  {
    id: '3',
    name: 'Dr. Ananya Rao',
    location: 'Gachibowli, Hyderabad',
    quote: 'From custom wood selection to flawless delivery, the bespoke experience was seamless. Their architectural furniture adds timeless warmth to our home.',
    rating: 5,
    roomType: 'Living Space',
  },
]
