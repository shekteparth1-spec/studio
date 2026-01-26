'use server';

type PropertyDetails = {
  name: string;
  location: string;
  squareFeet: number;
  amenities: string[];
};

export async function getListingSuggestion(
  details: PropertyDetails
): Promise<string> {
  // In a real application, this would call a GenAI model.
  // For now, we simulate the AI's response.
  
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

  const amenitiesText = details.amenities.length > 0
    ? `Boasting desirable amenities such as ${details.amenities.join(', ')}, this property ensures a comfortable and convenient stay.`
    : 'This property is a blank canvas, ready for you to make it your own.';

  const locationFeature = `Nestled in the heart of ${details.location}, this location offers both tranquility and convenience.`;

  const sizeFeature = `Spanning an impressive ${details.squareFeet} square feet, there is ample space for relaxation and entertainment.`;

  const suggestion = `
Experience the charm of ${details.name}. ${locationFeature} ${sizeFeature} 
${amenitiesText} Whether you're seeking a peaceful retreat or a base for your adventures, this property is the perfect choice. 
Book your unforgettable stay today!
  `.trim().replace(/\s+/g, ' ');

  return suggestion;
}
