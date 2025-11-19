import { create } from 'zustand';
import { Tag, tagsAPI } from '@/lib/api';

interface TagsState {
  tags: Tag[];
  loading: boolean;
  error: string | null;
  fetchTags: (userId: number, token: string) => Promise<void>;
  addTag: (userId: number, tag: Partial<Tag>, token: string) => Promise<void>;
  deleteTag: (userId: number, tagId: number, token: string) => Promise<void>;
  clearTags: () => void;
}

export const useTagsStore = create<TagsState>()((set, get) => ({
  tags: [],
  loading: false,
  error: null,

  fetchTags: async (userId: number, token: string) => {
    set({ loading: true, error: null });
    try {
      const tags = await tagsAPI.getMyTags(userId, token);
      set({ tags, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  addTag: async (userId: number, tag: Partial<Tag>, token: string) => {
    set({ loading: true, error: null });
    try {
      const newTag = await tagsAPI.insertMyTag(userId, tag, token);
      set({ tags: [...get().tags, newTag], loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  deleteTag: async (userId: number, tagId: number, token: string) => {
    set({ loading: true, error: null });
    try {
      await tagsAPI.deleteMyTag(userId, tagId, token);
      set({ tags: get().tags.filter((tag) => tag.id !== tagId), loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  clearTags: () => {
    set({ tags: [], loading: false, error: null });
  },
}));
