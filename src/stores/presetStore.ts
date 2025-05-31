import { create } from 'zustand'

export interface Preset {
  id: string
  name: string
  category: 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'youtube' | 'pinterest' | 'tiktok' | 'blog' | 'custom'
  width: number
  height: number
  description: string
  isPro: boolean
}

interface PresetState {
  presets: Preset[]
  selectedPresetId: string | null
  selectPreset: (id: string | null) => void
  getPresetsByCategory: (category: string) => Preset[]
  getPresetById: (id: string) => Preset | undefined
}

const socialMediaPresets: Preset[] = [
  // Instagram
  {
    id: 'instagram-post',
    name: 'Instagram Post',
    category: 'instagram',
    width: 1080,
    height: 1080,
    description: 'Square post for Instagram feed',
    isPro: false,
  },
  {
    id: 'instagram-story',
    name: 'Instagram Story',
    category: 'instagram',
    width: 1080,
    height: 1920,
    description: 'Vertical format for Instagram stories',
    isPro: false,
  },
  {
    id: 'instagram-portrait',
    name: 'Instagram Portrait',
    category: 'instagram',
    width: 1080,
    height: 1350,
    description: 'Portrait format for Instagram feed',
    isPro: true,
  },
  {
    id: 'instagram-landscape',
    name: 'Instagram Landscape',
    category: 'instagram',
    width: 1080,
    height: 608,
    description: 'Landscape format for Instagram feed',
    isPro: true,
  },
  
  // Facebook
  {
    id: 'facebook-post',
    name: 'Facebook Post',
    category: 'facebook',
    width: 1200,
    height: 630,
    description: 'Optimal size for Facebook feed posts',
    isPro: false,
  },
  {
    id: 'facebook-cover',
    name: 'Facebook Cover',
    category: 'facebook',
    width: 820,
    height: 312,
    description: 'Cover photo for Facebook profiles',
    isPro: false,
  },
  {
    id: 'facebook-profile',
    name: 'Facebook Profile',
    category: 'facebook',
    width: 170,
    height: 170,
    description: 'Profile picture for Facebook',
    isPro: false,
  },
  {
    id: 'facebook-event',
    name: 'Facebook Event',
    category: 'facebook',
    width: 1920,
    height: 1080,
    description: 'Cover image for Facebook events',
    isPro: true,
  },
  
  // Twitter
  {
    id: 'twitter-post',
    name: 'Twitter Post',
    category: 'twitter',
    width: 1200,
    height: 675,
    description: 'Optimal size for Twitter posts',
    isPro: false,
  },
  {
    id: 'twitter-header',
    name: 'Twitter Header',
    category: 'twitter',
    width: 1500,
    height: 500,
    description: 'Header image for Twitter profiles',
    isPro: false,
  },
  {
    id: 'twitter-profile',
    name: 'Twitter Profile',
    category: 'twitter',
    width: 400,
    height: 400,
    description: 'Profile picture for Twitter',
    isPro: false,
  },
  
  // LinkedIn
  {
    id: 'linkedin-post',
    name: 'LinkedIn Post',
    category: 'linkedin',
    width: 1200,
    height: 627,
    description: 'Optimal size for LinkedIn posts',
    isPro: false,
  },
  {
    id: 'linkedin-cover',
    name: 'LinkedIn Cover',
    category: 'linkedin',
    width: 1584,
    height: 396,
    description: 'Cover image for LinkedIn profiles',
    isPro: true,
  },
  {
    id: 'linkedin-profile',
    name: 'LinkedIn Profile',
    category: 'linkedin',
    width: 400,
    height: 400,
    description: 'Profile picture for LinkedIn',
    isPro: true,
  },
  
  // YouTube
  {
    id: 'youtube-thumbnail',
    name: 'YouTube Thumbnail',
    category: 'youtube',
    width: 1280,
    height: 720,
    description: 'Thumbnail for YouTube videos',
    isPro: false,
  },
  {
    id: 'youtube-channel-art',
    name: 'YouTube Channel Art',
    category: 'youtube',
    width: 2560,
    height: 1440,
    description: 'Banner for YouTube channels',
    isPro: true,
  },
  
  // Pinterest
  {
    id: 'pinterest-pin',
    name: 'Pinterest Pin',
    category: 'pinterest',
    width: 1000,
    height: 1500,
    description: 'Optimal size for Pinterest pins',
    isPro: true,
  },
  {
    id: 'pinterest-board-cover',
    name: 'Pinterest Board Cover',
    category: 'pinterest',
    width: 600,
    height: 600,
    description: 'Cover image for Pinterest boards',
    isPro: true,
  },
  
  // TikTok
  {
    id: 'tiktok-video',
    name: 'TikTok Video',
    category: 'tiktok',
    width: 1080,
    height: 1920,
    description: 'Vertical format for TikTok videos',
    isPro: true,
  },
  
  // Blog
  {
    id: 'blog-featured',
    name: 'Blog Featured Image',
    category: 'blog',
    width: 1200,
    height: 630,
    description: 'Featured image for blog posts',
    isPro: false,
  },
  {
    id: 'blog-thumbnail',
    name: 'Blog Thumbnail',
    category: 'blog',
    width: 600,
    height: 400,
    description: 'Thumbnail for blog listings',
    isPro: true,
  },
]

export const usePresetStore = create<PresetState>((set, get) => ({
  presets: socialMediaPresets,
  selectedPresetId: null,
  
  selectPreset: (id) => {
    set({ selectedPresetId: id })
  },
  
  getPresetsByCategory: (category) => {
    return get().presets.filter((preset) => preset.category === category)
  },
  
  getPresetById: (id) => {
    return get().presets.find((preset) => preset.id === id)
  },
}))
