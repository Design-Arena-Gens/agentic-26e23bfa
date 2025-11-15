'use client';

import { useState } from 'react';
import AvatarPreview from '@/components/AvatarPreview';
import ControlPanel from '@/components/ControlPanel';
import ImageUpload from '@/components/ImageUpload';

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<'male' | 'female' | 'custom'>('male');
  const [emotion, setEmotion] = useState<'neutral' | 'happy' | 'sad' | 'angry' | 'surprised'>('neutral');
  const [text, setText] = useState('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('alloy');

  const handleImageUpload = (imageUrl: string) => {
    setUploadedImage(imageUrl);
    setSelectedAvatar('custom');
  };

  const handleGenerate = async () => {
    if (!text) return;

    setIsPlaying(true);

    // Simulate audio generation with Web Speech API
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = speechSynthesis.getVoices().find(voice => voice.name.includes('Google')) || speechSynthesis.getVoices()[0];
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setIsPlaying(false);
    };

    speechSynthesis.speak(utterance);
  };

  const handleExport = () => {
    alert('Export functionality would render the animation to MP4. This requires server-side processing with FFmpeg or similar tools.');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent mb-4">
            AI Lip-Sync Avatar Generator
          </h1>
          <p className="text-gray-400 text-lg">
            Create animated avatars with AI-powered lip-sync and facial expressions
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Avatar Selection & Upload */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-2xl">👤</span>
                Avatar Selection
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setSelectedAvatar('male')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedAvatar === 'male'
                        ? 'border-purple-500 bg-purple-500/20'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <div className="text-4xl mb-2">👨</div>
                    <div className="text-sm font-medium">Male Avatar</div>
                  </button>

                  <button
                    onClick={() => setSelectedAvatar('female')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedAvatar === 'female'
                        ? 'border-purple-500 bg-purple-500/20'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <div className="text-4xl mb-2">👩</div>
                    <div className="text-sm font-medium">Female Avatar</div>
                  </button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-800 text-gray-400">OR</span>
                  </div>
                </div>

                <ImageUpload onImageUpload={handleImageUpload} />
              </div>
            </div>

            <ControlPanel
              emotion={emotion}
              setEmotion={setEmotion}
              text={text}
              setText={setText}
              selectedVoice={selectedVoice}
              setSelectedVoice={setSelectedVoice}
              onGenerate={handleGenerate}
              onExport={handleExport}
              isPlaying={isPlaying}
            />
          </div>

          {/* Center & Right - Avatar Preview */}
          <div className="lg:col-span-2">
            <AvatarPreview
              avatarType={selectedAvatar}
              customImage={uploadedImage}
              emotion={emotion}
              isPlaying={isPlaying}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
