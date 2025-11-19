import { create } from 'zustand';

interface DistanceUpdate {
  tag_id: number;
  distance_to_router: number;
  timestamp: string;
}

interface MQTTState {
  distanceUpdates: Map<number, DistanceUpdate[]>;
  addDistanceUpdate: (tagId: number, distance: number) => void;
  getUpdates: (tagId: number) => DistanceUpdate[];
  clearUpdates: (tagId: number) => void;
}

export const useMQTTStore = create<MQTTState>()((set, get) => ({
  distanceUpdates: new Map(),

  addDistanceUpdate: (tagId: number, distance: number) => {
    const updates = get().distanceUpdates;
    const tagUpdates = updates.get(tagId) || [];
    
    const newUpdate: DistanceUpdate = {
      tag_id: tagId,
      distance_to_router: distance,
      timestamp: new Date().toISOString(),
    };
    
    tagUpdates.push(newUpdate);
    updates.set(tagId, tagUpdates);
    
    set({ distanceUpdates: new Map(updates) });
  },

  getUpdates: (tagId: number) => {
    return get().distanceUpdates.get(tagId) || [];
  },

  clearUpdates: (tagId: number) => {
    const updates = get().distanceUpdates;
    updates.delete(tagId);
    set({ distanceUpdates: new Map(updates) });
  },
}));
