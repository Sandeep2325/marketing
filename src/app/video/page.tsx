'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Voice {
  id: string;
  name: string;
  preview_url: string;
  category: string;
  accent: string;
  language: string;
}

export default function VideoCreation() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<Voice | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedAccent, setSelectedAccent] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const voicesPerPage = 6;

  const [videoDetails, setVideoDetails] = useState({
    title: '',
    description: '',
    duration: 60,
    language: 'en',
    size: '1080p',
    script: '',
    aspectRatio: 'landscape',
  });

  useEffect(() => {
    fetchVoices();
  }, []);

  const fetchVoices = async () => {
    try {
      const response = await fetch('/api/voices');
      if (!response.ok) throw new Error('Failed to fetch voices');
      const data = await response.json();
      setVoices(data.voices);
    } catch (err) {
      setError('Failed to load voices. Please try again later.');
    }
  };

  // Get unique languages and accents
  const languages = useMemo(() => {
    const uniqueLanguages = new Set(voices.map(voice => voice.language));
    return ['all', ...Array.from(uniqueLanguages)];
  }, [voices]);

  const accents = useMemo(() => {
    const uniqueAccents = new Set(voices.map(voice => voice.accent));
    return ['all', ...Array.from(uniqueAccents)];
  }, [voices]);

  // Filter voices based on search, language, and accent
  const filteredVoices = useMemo(() => {
    return voices.filter(voice => {
      const matchesSearch = voice.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLanguage = selectedLanguage === 'all' || voice.language === selectedLanguage;
      const matchesAccent = selectedAccent === 'all' || voice.accent === selectedAccent;
      return matchesSearch && matchesLanguage && matchesAccent;
    });
  }, [voices, searchQuery, selectedLanguage, selectedAccent]);

  // Pagination
  const totalPages = Math.ceil(filteredVoices.length / voicesPerPage);
  const paginatedVoices = useMemo(() => {
    const startIndex = (currentPage - 1) * voicesPerPage;
    return filteredVoices.slice(startIndex, startIndex + voicesPerPage);
  }, [filteredVoices, currentPage]);

  const handleVoiceSelect = (voice: Voice) => {
    setSelectedVoice(voice);
    setIsPlaying(false);
  };

  const handlePreviewVoice = () => {
    if (selectedVoice?.preview_url) {
      setIsPlaying(!isPlaying);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setVideoDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGenerateScript = async () => {
    if (!videoDetails.title || !videoDetails.description) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/generate-script', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: videoDetails.title,
          description: videoDetails.description,
          language: videoDetails.language,
        }),
      });

      if (!response.ok) throw new Error('Failed to generate script');

      const data = await response.json();
      setVideoDetails(prev => ({
        ...prev,
        script: data.script
      }));
    } catch (err) {
      setError('Failed to generate script. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateVideo = async () => {
    if (!selectedVoice || !videoDetails.script) {
      setError('Please select a voice and generate a script first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          script: videoDetails.script,
          voiceId: selectedVoice.id,
          duration: videoDetails.duration,
          size: videoDetails.size,
        }),
      });

      if (!response.ok) throw new Error('Failed to generate video');

      const data = await response.json();
      router.push(`/video/preview?url=${encodeURIComponent(data.videoUrl)}`);
    } catch (err) {
      setError('Failed to generate video. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-blue-600">AI Marketing Suite</Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/telemarketing"
                className="text-gray-600 hover:text-gray-900"
              >
                Telemarketing
              </Link>
              <Link
                href="/sms"
                className="text-gray-600 hover:text-gray-900"
              >
                SMS
              </Link>
              <Link
                href="/email"
                className="text-gray-600 hover:text-gray-900"
              >
                Email
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Create Your Video</h1>
          <p className="text-xl text-gray-600">Generate professional videos with AI-powered scripts and voiceovers</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Video Details */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Video Details</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={videoDetails.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter video title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  name="description"
                  value={videoDetails.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe your video content"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration (seconds)</label>
                  <input
                    type="number"
                    name="duration"
                    value={videoDetails.duration}
                    onChange={handleInputChange}
                    min="30"
                    max="300"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                  <select
                    name="language"
                    value={videoDetails.language}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Resolution</label>
                  <select
                    name="size"
                    value={videoDetails.size}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="720p">720p HD</option>
                    <option value="1080p">1080p Full HD</option>
                    <option value="4k">4K Ultra HD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Aspect Ratio</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setVideoDetails(prev => ({ ...prev, aspectRatio: 'landscape' }))}
                      className={`p-2 border rounded-md flex items-center justify-center ${
                        videoDetails.aspectRatio === 'landscape'
                          ? 'border-blue-500 bg-blue-50 text-blue-600'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
                      </svg>
                      <span className="ml-2 text-sm">16:9</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setVideoDetails(prev => ({ ...prev, aspectRatio: 'portrait' }))}
                      className={`p-2 border rounded-md flex items-center justify-center ${
                        videoDetails.aspectRatio === 'portrait'
                          ? 'border-blue-500 bg-blue-50 text-blue-600'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
                      </svg>
                      <span className="ml-2 text-sm">9:16</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setVideoDetails(prev => ({ ...prev, aspectRatio: 'square' }))}
                      className={`p-2 border rounded-md flex items-center justify-center ${
                        videoDetails.aspectRatio === 'square'
                          ? 'border-blue-500 bg-blue-50 text-blue-600'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
                      </svg>
                      <span className="ml-2 text-sm">1:1</span>
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={handleGenerateScript}
                disabled={loading || !videoDetails.title || !videoDetails.description}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Generating...' : 'Generate Script'}
              </button>
            </div>
          </div>

          {/* Right Column - Voice Selection and Script */}
          <div className="space-y-6">
            {/* Voice Selection */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Select Voice</h2>
              
              {/* Search and Filters */}
              <div className="mb-6 space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search voices..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    {languages.map(lang => (
                      <option key={lang} value={lang}>
                        {lang === 'all' ? 'All Languages' : lang}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedAccent}
                    onChange={(e) => setSelectedAccent(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    {accents.map(accent => (
                      <option key={accent} value={accent}>
                        {accent === 'all' ? 'All Accents' : accent}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Voice Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {paginatedVoices.map((voice) => (
                  <div
                    key={voice.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedVoice?.id === voice.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => handleVoiceSelect(voice)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{voice.name}</h3>
                        <div className="flex gap-2 mt-1">
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {voice.language}
                          </span>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {voice.accent}
                          </span>
                        </div>
                      </div>
                      {selectedVoice?.id === voice.id && (
                        <button
                          onClick={handlePreviewVoice}
                          className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
                        >
                          {isPlaying ? '⏸️' : '▶️'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded-md disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border rounded-md disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}

              {selectedVoice && isPlaying && (
                <audio
                  src={selectedVoice.preview_url}
                  autoPlay
                  onEnded={() => setIsPlaying(false)}
                  className="mt-4 w-full"
                />
              )}
            </div>

            {/* Generated Script */}
            {videoDetails.script && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Generated Script</h2>
                <div className="prose max-w-none">
                  <p className="whitespace-pre-wrap text-gray-700">{videoDetails.script}</p>
                </div>
                <button
                  onClick={handleGenerateVideo}
                  disabled={loading || !selectedVoice}
                  className="mt-6 w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Generating Video...' : 'Generate Video'}
                </button>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
} 