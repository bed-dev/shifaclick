import { delay } from '@/lib/delay';
import { mockStore } from '@/services/mockStore';
import type { FeedItem } from '@/types/models';

export interface FeedResponse {
  featured: FeedItem[];
  nearbyPharmacies: {
    id: string;
    name: string;
    distanceKm: number;
    status: 'open' | 'closing-soon';
  }[];
}

export const feedService = {
  async getFeed(): Promise<FeedResponse> {
    await delay(500);

    const items = mockStore.getFeedItems();

    return {
      featured: items,
      nearbyPharmacies: [
        { id: 'pha-001', name: 'Pharmacie Centrale', distanceKm: 0.4, status: 'open' },
        { id: 'pha-002', name: 'Pharmacie El Amel', distanceKm: 0.8, status: 'open' },
        { id: 'pha-003', name: 'Pharmacie Hasnaoui', distanceKm: 1.2, status: 'closing-soon' },
      ],
    };
  },

  async getItemDetails(itemId: string): Promise<FeedItem> {
    await delay(400);

    const item = mockStore.getFeedItemById(itemId);

    if (!item) {
      throw new Error('Medicine not found.');
    }

    return item;
  },
};
