'use client';

import { motion } from 'framer-motion';
import { Play, Download, RotateCcw } from 'lucide-react';

interface ControlPanelProps {
  emotion: 'neutral' | 'happy' | 'sad' | 'angry' | 'surprised';
  setEmotion: (emotion: 'neutral' | 'happy' | 'sad' | 'angry' | 'surprised') => void;
  text: string;
  setText: (text: string) => void;
  selectedVoice: string;
  setSelectedVoice: (voice: string) => void;
  onGenerate: () => void;
  onExport: () => void;
  isPlaying: boolean;
}

const emotions = [
  { value: 'neutral', emoji: '😐', label: 'Neutral' },
  { value: 'happy', emoji: '😊', label: 'Happy' },
  { value: 'sad', emoji: '😢', label: 'Sad' },
  { value: 'angry', emoji: '😠', label: 'Angry' },
  { value: 'surprised', emoji: '😮', label: 'Surprised' },
] as const;

const voices = [
  { value: 'alloy', label: 'Alloy (Neutral)' },
  { value: 'echo', label: 'Echo (Male)' },
  { value: 'fable', label: 'Fable (British)' },
  { value: 'onyx', label: 'Onyx (Deep)' },
  { value: 'nova', label: 'Nova (Female)' },
  { value: 'shimmer', label: 'Shimmer (Soft)' },
];

export default function ControlPanel({
  emotion,
  setEmotion,
  text,
  setText,
  selectedVoice,
  setSelectedVoice,
  onGenerate,
  onExport,
  isPlaying,
}: ControlPanelProps) {
  return (
    <div className="space-y-6">
      {/* Emotion Control */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-800 rounded-2xl p-6 border border-gray-700"
      >
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <span className="text-2xl">🎭</span>
          Emotion Control
        </h2>

        <div className="grid grid-cols-5 gap-2">
          {emotions.map(({ value, emoji, label }) => (
            <button
              key={value}
              onClick={() => setEmotion(value)}
              className={`p-3 rounded-xl border-2 transition-all transform hover:scale-105 ${
                emotion === value
                  ? 'border-purple-500 bg-purple-500/20 shadow-lg shadow-purple-500/50'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
              title={label}
            >
              <div className="text-3xl">{emoji}</div>
              <div className="text-xs mt-1 font-medium">{label}</div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Text Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-800 rounded-2xl p-6 border border-gray-700"
      >
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <span className="text-2xl">💬</span>
          Text-to-Speech
        </h2>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text for your avatar to speak..."
          className="w-full h-32 bg-gray-900 border border-gray-600 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          maxLength={500}
        />

        <div className="mt-2 text-sm text-gray-400 text-right">
          {text.length}/500 characters
        </div>

        {/* Voice Selection */}
        <div className="mt-4">
          <label className="block text-sm font-medium mb-2 text-gray-300">
            Voice Type
          </label>
          <select
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {voices.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-3"
      >
        <button
          onClick={onGenerate}
          disabled={!text || isPlaying}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isPlaying ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Play size={20} fill="white" />
              Generate & Preview
            </>
          )}
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onGenerate}
            disabled={!text || isPlaying}
            className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RotateCcw size={18} />
            Regenerate
          </button>

          <button
            onClick={onExport}
            disabled={!text}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <Download size={18} />
            Export MP4
          </button>
        </div>
      </motion.div>

      {/* Info Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-800/50 rounded-xl p-4 border border-gray-700"
      >
        <div className="text-sm text-gray-400 space-y-2">
          <p className="flex items-start gap-2">
            <span className="text-purple-400">•</span>
            <span>Real-time lip-sync synchronized with speech</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="text-purple-400">•</span>
            <span>Dynamic facial expressions based on emotions</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="text-purple-400">•</span>
            <span>Natural head, eye, and hand movements</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="text-purple-400">•</span>
            <span>Upload custom images or use 3D avatars</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
