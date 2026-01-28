export type Property = {
  id: string;
  name: string;
  type: 'farmhouse' | 'resort';
  location: string;
  pricePerNight: number;
  bedrooms: number;
  squareFeet: number;
  rating: number;
  description: string;
  amenities: string[];
  imageIds: string[];
  ownerId: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'user';
  password?: string;
  phone?: string;
};

export const users: User[] = [
  { id: 'user-1', name: 'John Doe', email: 'john@example.com', role: 'user', password: 'password123', phone: '919876543210' },
  { id: 'user-2', name: 'Jane Smith', email: 'jane@example.com', role: 'user', password: 'password456', phone: '919876543211' },
];

export const properties: Property[] = [
  {
    id: 'prop-1',
    name: 'The Golden Fields Farmstead',
    type: 'farmhouse',
    location: 'Nashik, Maharashtra',
    pricePerNight: 4500,
    bedrooms: 4,
    squareFeet: 3200,
    rating: 4.9,
    description: 'A luxurious farmhouse surrounded by vineyards. Perfect for a wine country getaway. Features a gourmet kitchen, a large outdoor patio with a fire pit, and stunning views of the rolling hills.',
    amenities: ['wifi', 'pool', 'kitchen', 'parking', 'fireplace'],
    imageIds: ['farmhouse-1-ext', 'farmhouse-1-int'],
    ownerId: 'user-1',
  },
  {
    id: 'prop-2',
    name: 'Ocean Breeze Resort',
    type: 'resort',
    location: 'Goa, India',
    pricePerNight: 7000,
    bedrooms: 2,
    squareFeet: 1200,
    rating: 4.8,
    description: 'An exclusive resort with direct beach access. Enjoy world-class amenities including a spa, infinity pool, and multiple fine dining restaurants. Your tropical paradise awaits.',
    amenities: ['wifi', 'pool', 'gym', 'spa', 'restaurant'],
    imageIds: ['resort-1-pool', 'resort-1-room'],
    ownerId: 'user-2',
  },
  {
    id: 'prop-3',
    name: 'Rustic Charm Cabin',
    type: 'farmhouse',
    location: 'Manali, Himachal Pradesh',
    pricePerNight: 2800,
    bedrooms: 2,
    squareFeet: 1500,
    rating: 4.7,
    description: 'A cozy cabin nestled in the Blue Ridge Mountains. Ideal for hiking enthusiasts and those seeking a quiet retreat. Features a wood-burning stove and a screened-in porch.',
    amenities: ['kitchen', 'fireplace', 'wifi', 'parking'],
    imageIds: ['cabin-1-exterior', 'farmhouse-3-bedroom'],
    ownerId: 'user-1',
  },
    {
    id: 'prop-4',
    name: 'The Vintage Villa',
    type: 'resort',
    location: 'Udaipur, Rajasthan',
    pricePerNight: 6200,
    bedrooms: 5,
    squareFeet: 4500,
    rating: 4.9,
    description: 'Live the Indian dream in this beautifully restored 18th-century villa. Set amidst olive groves and vineyards, it offers a private pool, classic Italian gardens, and breathtaking views.',
    amenities: ['wifi', 'pool', 'kitchen', 'parking', 'fireplace'],
    imageIds: ['villa-1-exterior', 'farmhouse-2-kitchen'],
    ownerId: 'user-2',
  },
  {
    id: 'prop-5',
    name: 'Green Valley Homestead',
    type: 'farmhouse',
    location: 'Coonoor, Tamil Nadu',
    pricePerNight: 3500,
    bedrooms: 3,
    squareFeet: 2400,
    rating: 4.6,
    description: 'A classic South Indian farmhouse on a working organic farm. Participate in farm activities, enjoy fresh produce, and relax by the pond. A truly authentic farm-to-table experience.',
    amenities: ['kitchen', 'wifi', 'parking'],
    imageIds: ['farmhouse-2-kitchen', 'farmhouse-3-bedroom'],
    ownerId: 'user-1',
  },
    {
    id: 'prop-6',
    name: 'Coastal Serenity Spa & Resort',
    type: 'resort',
    location: 'Varkala, Kerala',
    pricePerNight: 9500,
    bedrooms: 1,
    squareFeet: 800,
    rating: 5.0,
    description: 'A cliffside resort offering unparalleled views of the Arabian Sea. Focus on wellness and relaxation with our award-winning spa, yoga classes, and gourmet organic restaurant.',
    amenities: ['wifi', 'pool', 'gym', 'spa', 'restaurant'],
    imageIds: ['resort-2-spa', 'resort-3-lobby'],
    ownerId: 'user-2',
  },
];
