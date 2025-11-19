// API client for backend communication
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface Tag {
  id: number;
  user_id: number;
  mac_address: string | null;
  last_distance: number | null;
  alias: string | null;
  icon: string | null;
  last_date: string | null;
  battery?: number | null;
}

export interface Update {
  id: number;
  tag_id: number;
  distance: number;
  timestamp: string;
}

export interface DistanceUpdate {
  tag_id: number;
  distance_to_router: number;
  timestamp: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

// Auth APIs
export const authAPI = {
  login: async (data: LoginData): Promise<LoginResponse> => {
    const res = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Login failed');
    return res.json();
  },

  signup: async (data: SignupData): Promise<LoginResponse> => {
    const res = await fetch(`${API_BASE_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Signup failed');
    return res.json();
  },

  deleteUser: async (userId: number, token: string): Promise<void> => {
    const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Delete user failed');
  },
};

// Tags APIs
export const tagsAPI = {
  getMyTags: async (userId: number, token: string): Promise<Tag[]> => {
    const res = await fetch(`${API_BASE_URL}/users/${userId}/tags`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch tags');
    return res.json();
  },

  getMyTag: async (userId: number, tagId: number, token: string): Promise<Tag> => {
    const res = await fetch(`${API_BASE_URL}/users/${userId}/tags/${tagId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch tag');
    return res.json();
  },

  insertMyTag: async (userId: number, tag: Partial<Tag>, token: string): Promise<Tag> => {
    const res = await fetch(`${API_BASE_URL}/users/${userId}/tags`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(tag),
    });
    if (!res.ok) throw new Error('Failed to create tag');
    return res.json();
  },

  deleteMyTag: async (userId: number, tagId: number, token: string): Promise<void> => {
    const res = await fetch(`${API_BASE_URL}/users/${userId}/tags/${tagId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to delete tag');
  },
};

// Updates APIs
export const updatesAPI = {
  getMyTagUpdates: async (userId: number, tagId: number, token: string): Promise<Update[]> => {
    const res = await fetch(`${API_BASE_URL}/users/${userId}/tags/${tagId}/updates`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch updates');
    return res.json();
  },

  postDistanceUpdates: async (
    userId: number,
    tagId: number,
    updates: DistanceUpdate[],
    token: string
  ): Promise<void> => {
    const res = await fetch(`${API_BASE_URL}/users/${userId}/tags/${tagId}/updates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to post updates');
  },
};
