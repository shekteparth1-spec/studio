import { PlaceHolderImages } from './placeholder-images';

const getImageUrl = (id: string): string => {
  const image = PlaceHolderImages.find((img) => img.id === id);
  return image ? image.imageUrl : `https://picsum.photos/seed/${id}/600/400`;
};
const getImageHint = (id: string): string => {
  const image = PlaceHolderImages.find((img) => img.id === id);
  return image ? image.imageHint : 'property photo';
}

export type Property = {
  id: string;
  name: string;
  title?: string;
  type: 'farmhouse' | 'resort';
  location: string;
  city?: string;
  stateProvince?: string;
  pricePerNight: number;
  bedrooms: number;
  numberOfBedrooms?: number;
  squareFeet: number;
  squareFootage?: number;
  rating: number;
  description: string;
  amenities: string[];
  amenityIds?: string[];
  imageUrls: string[];
  photoUrls?: string[];
  imageHints: string[];
  ownerId: string;
  ownerPhoneNumber?: string;
  status: 'pending' | 'approved' | 'rejected';
  listingStatus?: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  password?: string;
  phone?: string;
  phoneNumber?: string;
};

export const users: User[] = [
  { id: 'user-1', name: 'John Doe', email: 'john@example.com', role: 'user', password: 'password123', phone: '919876543210', phoneNumber: '919876543210' },
  { id: 'user-2', name: 'Jane Smith', email: 'jane@example.com', role: 'user', password: 'password456', phone: '919876543211', phoneNumber: '919876543211' },
];

export const properties: Property[] = [
  {
    id: 'prop-1',
    name: 'The Golden Fields Farmstead',
    title: 'The Golden Fields Farmstead',
    type: 'farmhouse',
    location: 'Nashik, Maharashtra',
    city: 'Nashik',
    stateProvince: 'Maharashtra',
    pricePerNight: 4500,
    bedrooms: 4,
    numberOfBedrooms: 4,
    squareFeet: 3200,
    squareFootage: 3200,
    rating: 4.9,
    description: 'A luxurious farmhouse surrounded by vineyards. Perfect for a wine country getaway. Features a gourmet kitchen, a large outdoor patio with a fire pit, and stunning views of the rolling hills.',
    amenities: ['wifi', 'pool', 'kitchen', 'parking', 'fireplace'],
    amenityIds: ['wifi', 'pool', 'kitchen', 'parking', 'fireplace'],
    imageUrls: [getImageUrl('farmhouse-1-ext'), getImageUrl('farmhouse-1-int')],
    photoUrls: [getImageUrl('farmhouse-1-ext'), getImageUrl('farmhouse-1-int')],
    imageHints: [getImageHint('farmhouse-1-ext'), getImageHint('farmhouse-1-int')],
    ownerId: 'user-1',
    ownerPhoneNumber: '919876543210',
    status: 'approved',
    listingStatus: 'Approved',
  },
  {
    id: 'prop-2',
    name: 'Ocean Breeze Resort',
    title: 'Ocean Breeze Resort',
    type: 'resort',
    location: 'Goa, India',
    city: 'Goa',
    stateProvince: 'Goa',
    pricePerNight: 7000,
    bedrooms: 2,
    numberOfBedrooms: 2,
    squareFeet: 1200,
    squareFootage: 1200,
    rating: 4.8,
    description: 'An exclusive resort with direct beach access. Enjoy world-class amenities including a spa, infinity pool, and multiple fine dining restaurants. Your tropical paradise awaits.',
    amenities: ['wifi', 'pool', 'gym', 'spa', 'restaurant'],
    amenityIds: ['wifi', 'pool', 'gym', 'spa', 'restaurant'],
    imageUrls: [getImageUrl('resort-1-pool'), getImageUrl('resort-1-room')],
    photoUrls: [getImageUrl('resort-1-pool'), getImageUrl('resort-1-room')],
    imageHints: [getImageHint('resort-1-pool'), getImageHint('resort-1-room')],
    ownerId: 'user-2',
    ownerPhoneNumber: '919876543211',
    status: 'approved',
    listingStatus: 'Approved',
  },
  {
    id: 'prop-3',
    name: 'Rustic Charm Cabin',
    title: 'Rustic Charm Cabin',
    type: 'farmhouse',
    location: 'Manali, Himachal Pradesh',
    city: 'Manali',
    stateProvince: 'Himachal Pradesh',
    pricePerNight: 2800,
    bedrooms: 2,
    numberOfBedrooms: 2,
    squareFeet: 1500,
    squareFootage: 1500,
    rating: 4.7,
    description: 'A cozy cabin nestled in the Blue Ridge Mountains. Ideal for hiking enthusiasts and those seeking a quiet retreat. Features a wood-burning stove and a screened-in porch.',
    amenities: ['kitchen', 'fireplace', 'wifi', 'parking'],
    amenityIds: ['kitchen', 'fireplace', 'wifi', 'parking'],
    imageUrls: [getImageUrl('cabin-1-exterior'), getImageUrl('farmhouse-3-bedroom')],
    photoUrls: [getImageUrl('cabin-1-exterior'), getImageUrl('farmhouse-3-bedroom')],
    imageHints: [getImageHint('cabin-1-exterior'), getImageHint('farmhouse-3-bedroom')],
    ownerId: 'user-1',
    ownerPhoneNumber: '919876543210',
    status: 'approved',
    listingStatus: 'Approved',
  },
    {
    id: 'prop-4',
    name: 'The Vintage Villa',
    title: 'The Vintage Villa',
    type: 'resort',
    location: 'Udaipur, Rajasthan',
    city: 'Udaipur',
    stateProvince: 'Rajasthan',
    pricePerNight: 6200,
    bedrooms: 5,
    numberOfBedrooms: 5,
    squareFeet: 4500,
    squareFootage: 4500,
    rating: 4.9,
    description: 'Live the Indian dream in this beautifully restored 18th-century villa. Set amidst olive groves and vineyards, it offers a private pool, classic Italian gardens, and breathtaking views.',
    amenities: ['wifi', 'pool', 'kitchen', 'parking', 'fireplace'],
    amenityIds: ['wifi', 'pool', 'kitchen', 'parking', 'fireplace'],
    imageUrls: [getImageUrl('villa-1-exterior'), getImageUrl('farmhouse-2-kitchen')],
    photoUrls: [getImageUrl('villa-1-exterior'), getImageUrl('farmhouse-2-kitchen')],
    imageHints: [getImageHint('villa-1-exterior'), getImageHint('farmhouse-2-kitchen')],
    ownerId: 'user-2',
    ownerPhoneNumber: '919876543211',
    status: 'approved',
    listingStatus: 'Approved',
  },
  {
    id: 'prop-5',
    name: 'Green Valley Homestead',
    title: 'Green Valley Homestead',
    type: 'farmhouse',
    location: 'Coonoor, Tamil Nadu',
    city: 'Coonoor',
    stateProvince: 'Tamil Nadu',
    pricePerNight: 3500,
    bedrooms: 3,
    numberOfBedrooms: 3,
    squareFeet: 2400,
    squareFootage: 2400,
    rating: 4.6,
    description: 'A classic South Indian farmhouse on a working organic farm. Participate in farm activities, enjoy fresh produce, and relax by the pond. A truly authentic farm-to-table experience.',
    amenities: ['kitchen', 'wifi', 'parking'],
    amenityIds: ['kitchen', 'wifi', 'parking'],
    imageUrls: [getImageUrl('farmhouse-2-kitchen'), getImageUrl('farmhouse-3-bedroom')],
    photoUrls: [getImageUrl('farmhouse-2-kitchen'), getImageUrl('farmhouse-3-bedroom')],
    imageHints: [getImageHint('farmhouse-2-kitchen'), getImageHint('farmhouse-3-bedroom')],
    ownerId: 'user-1',
    ownerPhoneNumber: '919876543210',
    status: 'approved',
    listingStatus: 'Approved',
  },
    {
    id: 'prop-6',
    name: 'Coastal Serenity Spa & Resort',
    title: 'Coastal Serenity Spa & Resort',
    type: 'resort',
    location: 'Varkala, Kerala',
    city: 'Varkala',
    stateProvince: 'Kerala',
    pricePerNight: 9500,
    bedrooms: 1,
    numberOfBedrooms: 1,
    squareFeet: 800,
    squareFootage: 800,
    rating: 5.0,
    description: 'A cliffside resort offering unparalleled views of the Arabian Sea. Focus on wellness and relaxation with our award-winning spa, yoga classes, and gourmet organic restaurant.',
    amenities: ['wifi', 'pool', 'gym', 'spa', 'restaurant'],
    amenityIds: ['wifi', 'pool', 'gym', 'spa', 'restaurant'],
    imageUrls: [getImageUrl('resort-2-spa'), getImageUrl('resort-3-lobby')],
    photoUrls: [getImageUrl('resort-2-spa'), getImageUrl('resort-3-lobby')],
    imageHints: [getImageHint('resort-2-spa'), getImageHint('resort-3-lobby')],
    ownerId: 'user-2',
    ownerPhoneNumber: '919876543211',
    status: 'approved',
    listingStatus: 'Approved',
  },
];
