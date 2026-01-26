'use server';

/**
 * @fileOverview Provides AI-powered listing recommendations for property owners.
 *
 * - getListingRecommendations - A function that takes in property details and returns recommendations to improve the listing.
 * - ListingRecommendationsInput - The input type for the getListingRecommendations function.
 * - ListingRecommendationsOutput - The return type for the getListingRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ListingRecommendationsInputSchema = z.object({
  location: z.string().describe('The location of the property.'),
  squareFootage: z.number().describe('The square footage of the property.'),
  amenities: z.string().describe('A comma-separated list of amenities offered by the property.'),
  description: z.string().describe('The current description of the property listing.'),
});
export type ListingRecommendationsInput = z.infer<typeof ListingRecommendationsInputSchema>;

const ListingRecommendationsOutputSchema = z.object({
  recommendations: z.string().describe('AI-powered recommendations to improve the property listing visibility and booking rates.'),
});
export type ListingRecommendationsOutput = z.infer<typeof ListingRecommendationsOutputSchema>;

export async function getListingRecommendations(input: ListingRecommendationsInput): Promise<ListingRecommendationsOutput> {
  return listingRecommendationsFlow(input);
}

const listingRecommendationsPrompt = ai.definePrompt({
  name: 'listingRecommendationsPrompt',
  input: {schema: ListingRecommendationsInputSchema},
  output: {schema: ListingRecommendationsOutputSchema},
  prompt: `You are an AI assistant designed to provide recommendations for improving property listings to attract more bookings.

  Given the following property details, provide specific and actionable recommendations to enhance the listing's visibility and appeal.

  Location: {{{location}}}
  Square Footage: {{{squareFootage}}} sq ft
  Amenities: {{{amenities}}}
  Current Description: {{{description}}}

  Consider the location, size, and amenities to suggest improvements to the description, highlight key features, and attract the target audience.
  Focus on how to make the listing stand out and increase its booking potential.
  Make sure the recommendations sound professional and helpful.
  `,
});

const listingRecommendationsFlow = ai.defineFlow(
  {
    name: 'listingRecommendationsFlow',
    inputSchema: ListingRecommendationsInputSchema,
    outputSchema: ListingRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await listingRecommendationsPrompt(input);
    return output!;
  }
);
