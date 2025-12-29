import { CSSProperties } from 'react';

export enum AppModule {
  DH_AUDIO = '2d-audio',
  DH_CHAT = '2d-chat',
  DH_AVATAR = '2d-avatar',
  DH_3D = '3d-avatar',
  AI_VOICE = 'ai-voice'
}

export enum Page {
  HOME = 'home',
  PRESET = 'preset',
  CUSTOM = 'custom',
  ASR = 'asr',
  TTS = 'tts',
  VOICE_CLONING = 'voice-cloning',
  VOICEPRINT = 'voiceprint',
  LIVE_CHAT = 'live-chat',
  PROMPT_DISCOVER = 'prompt-discover',
  PROMPT_FAVORITES = 'prompt-favorites',
  PROMPT_MINE = 'prompt-mine',
  PROMPT_CREATE = 'prompt-create'
}

export interface Voice {
  id: string;
  name: string;
  gender: string;
  language: string;
  tags: string[];
  category: string;
  avatarUrl: string;
  previewUrl: string;
  source: 'preset' | 'custom';
  isCustom?: boolean;
  isFavorite?: boolean;
  notes?: string;
  isPublic?: boolean;
}

export interface SpeakerIdentity {
  id: string;
  name: string;
  color: string;
  isKnown: boolean;
  avatarSeed: string;
  source: 'detected' | 'cloned';
}

export interface SpeakerSegment {
  id: string;
  speakerId: string;
  text: string;
  startTime: number;
  endTime: number;
  confidence: number;
}

export interface PromptItem {
  id: string;
  title: string;
  category: string;
  tags: string[];
  description: string;
  negativePrompt?: string;
  usageCount: string;
  isFavorite: boolean;
  author: string;
  isPublic: boolean;
  createdAt: number;
  imageUrl?: string;
  model?: string;
  brand?: string;
  version?: string;
}

export interface Asset {
  id: string;
  name: string;
  type: 'base' | 'accessory' | 'template' | 'upload' | 'snapshot';
  category?: 'male' | 'female' | 'pet';
  previewColor?: string;
  src?: string;
  mediaType?: 'image' | 'video';
  state?: {
    baseModel: string;
    accessory: string | null;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
}

export interface ColorBendsProps {
  colors?: string[];
  rotation?: number;
  speed?: number;
  scale?: number;
  frequency?: number;
  warpStrength?: number;
  mouseInfluence?: number;
  parallax?: number;
  noise?: number;
  autoRotate?: number;
  transparent?: boolean;
  className?: string;
  style?: CSSProperties;
}