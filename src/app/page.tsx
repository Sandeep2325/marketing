'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('all');

  const features = [
    {
      id: 'telemarketing',
      title: 'Telemarketing',
      description: 'Create automated voice calls with AI-powered voices',
      icon: '🎙️',
      category: 'voice'
    },
    {
      id: 'sms',
      title: 'SMS Marketing',
      description: 'Send bulk SMS messages with personalized content',
      icon: '📱',
      category: 'text'
    },
    {
      id: 'email',
      title: 'Email Marketing',
      description: 'Create and send personalized email campaigns',
      icon: '📧',
      category: 'text'
    },
    {
      id: 'video',
      title: 'Video Creation',
      description: 'Generate professional videos with AI scripts and transitions',
      icon: '🎥',
      category: 'media'
    }
  ];

  const filteredFeatures = activeTab === 'all' 
    ? features 
    : features.filter(feature => feature.category === activeTab);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">AI Marketing Suite</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/telemarketing"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">All-in-One Marketing</span>
              <span className="block text-blue-600">Automation Platform</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Transform your marketing with AI-powered telemarketing, bulk SMS, and email campaigns. Reach your audience effectively and efficiently.
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Powerful Marketing Tools
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Choose the right tool for your marketing needs
            </p>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Telemarketing Feature */}
              <div className="bg-white p-6 rounded-lg shadow-lg transform transition hover:scale-105">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">AI Telemarketing</h3>
                <p className="mt-2 text-gray-500">
                  Make automated calls with natural-sounding AI voices. Engage customers with personalized conversations and intelligent responses.
                </p>
                <div className="mt-6">
                  <Link
                    href="/telemarketing"
                    className="text-base font-medium text-blue-600 hover:text-blue-500"
                  >
                    Start Calling <span aria-hidden="true">&rarr;</span>
                  </Link>
                </div>
              </div>

              {/* Bulk SMS Feature */}
              <div className="bg-white p-6 rounded-lg shadow-lg transform transition hover:scale-105">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">Bulk SMS</h3>
                <p className="mt-2 text-gray-500">
                  Send personalized text messages to thousands of contacts instantly. Track delivery and engagement in real-time.
                </p>
                <div className="mt-6">
                  <Link
                    href="/sms"
                    className="text-base font-medium text-blue-600 hover:text-blue-500"
                  >
                    Send SMS <span aria-hidden="true">&rarr;</span>
                  </Link>
                </div>
              </div>

              {/* Bulk Email Feature */}
              <div className="bg-white p-6 rounded-lg shadow-lg transform transition hover:scale-105">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">Bulk Email</h3>
                <p className="mt-2 text-gray-500">
                  Create and send professional email campaigns. Personalize content, track opens and clicks, and analyze campaign performance.
                </p>
                <div className="mt-6">
                  <Link
                    href="/email"
                    className="text-base font-medium text-blue-600 hover:text-blue-500"
                  >
                    Send Emails <span aria-hidden="true">&rarr;</span>
                  </Link>
                </div>
              </div>

              {/* Video Creation Feature */}
              <div className="bg-white p-6 rounded-lg shadow-lg transform transition hover:scale-105">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-red-500 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">AI Video Creation</h3>
                <p className="mt-2 text-gray-500">
                  Generate professional videos with AI scripts, smooth transitions, and voiceovers. Perfect for marketing and social media content.
                </p>
                <div className="mt-6">
                  <Link
                    href="/video"
                    className="text-base font-medium text-blue-600 hover:text-blue-500"
                  >
                    Create Video <span aria-hidden="true">&rarr;</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Simple setup, powerful results
            </p>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                  <span className="text-xl font-bold">1</span>
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">Choose Platform</h3>
                <p className="mt-2 text-gray-500">
                  Select telemarketing, SMS, or email for your campaign
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                  <span className="text-xl font-bold">2</span>
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">Create Content</h3>
                <p className="mt-2 text-gray-500">
                  Write your message or script
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                  <span className="text-xl font-bold">3</span>
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">Upload Contacts</h3>
                <p className="mt-2 text-gray-500">
                  Add your target audience
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                  <span className="text-xl font-bold">4</span>
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">Launch Campaign</h3>
                <p className="mt-2 text-gray-500">
                  Start your campaign and track results
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to transform your marketing?</span>
            <span className="block text-blue-200">Start your free trial today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                href="/telemarketing"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
              >
                Get started
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link
                href="#features"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-500 hover:bg-blue-400"
              >
                Learn more
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500">
            <p>© 2024 AI Marketing Suite. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
