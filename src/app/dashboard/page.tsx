'use client';

import { useState } from 'react';

export default function Dashboard() {
  const [isCalling, setIsCalling] = useState(false);

  const handleStartCall = async () => {
    try {
      setIsCalling(true);
      // TODO: Implement call initiation logic
    } catch (error) {
      console.error('Error starting call:', error);
      setIsCalling(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Telemarketing AI Dashboard</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Call Controls</h2>
          <button
            onClick={handleStartCall}
            disabled={isCalling}
            className={`px-4 py-2 rounded ${
              isCalling
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            {isCalling ? 'Calling...' : 'Start Call'}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Call History</h2>
          <div className="space-y-4">
            {/* TODO: Add call history list */}
            <p className="text-gray-500">No calls yet</p>
          </div>
        </div>
      </div>
    </div>
  );
} 