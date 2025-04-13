'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface PhoneNumber {
  id: string;
  number: string;
}

export default function Setup() {
  const router = useRouter();
  const [selectedVoice, setSelectedVoice] = useState('');
  const [message, setMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
  const [newNumber, setNewNumber] = useState('');
  const [activeStep, setActiveStep] = useState(1);

  // Mock voices - replace with actual ElevenLabs voices
  const voices = [
    { id: 'voice1', name: 'Alex - Professional', description: 'Clear and confident voice perfect for business calls' },
    { id: 'voice2', name: 'Sarah - Friendly', description: 'Warm and approachable voice for customer engagement' },
    { id: 'voice3', name: 'James - Authoritative', description: 'Strong and commanding voice for sales pitches' },
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const numbers = text.split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0)
          .map(line => ({
            id: Math.random().toString(36).substr(2, 9),
            number: line
          }));
        setPhoneNumbers(prev => [...prev, ...numbers]);
      };
      reader.readAsText(file);
    }
  };

  const handleAddNumber = () => {
    if (newNumber.trim()) {
      setPhoneNumbers(prev => [...prev, {
        id: Math.random().toString(36).substr(2, 9),
        number: newNumber.trim()
      }]);
      setNewNumber('');
    }
  };

  const handleRemoveNumber = (id: string) => {
    setPhoneNumbers(prev => prev.filter(num => num.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumbers.length === 0) {
      alert('Please add at least one phone number');
      return;
    }
    
    setIsLoading(true);
    // TODO: Implement API calls
    console.log({
      voice: selectedVoice,
      message,
      numbers: phoneNumbers,
    });

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    router.push('/dashboard');
  };

  const nextStep = () => {
    setActiveStep(prev => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setActiveStep(prev => Math.max(prev - 1, 1));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress Steps */}
      <div className="bg-white shadow-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between py-6">
            <div className={`flex items-center ${activeStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${activeStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <span className="ml-2 text-sm font-medium">Choose Voice</span>
            </div>
            <div className={`flex items-center ${activeStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${activeStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <span className="ml-2 text-sm font-medium">Set Message</span>
            </div>
            <div className={`flex items-center ${activeStep >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${activeStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                3
              </div>
              <span className="ml-2 text-sm font-medium">Add Contacts</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <form onSubmit={handleSubmit}>
              {/* Step 1: Voice Selection */}
              {activeStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Choose Your AI Voice</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Select the voice that best represents your brand
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {voices.map((voice) => (
                      <div
                        key={voice.id}
                        className={`relative rounded-lg border p-4 cursor-pointer transition-all ${
                          selectedVoice === voice.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                        onClick={() => setSelectedVoice(voice.id)}
                      >
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                              </svg>
                            </div>
                          </div>
                          <div className="ml-4">
                            <h4 className="text-sm font-medium text-gray-900">{voice.name}</h4>
                            <p className="text-sm text-gray-500">{voice.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Message Setup */}
              {activeStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Craft Your Message</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Write the message you want the AI to deliver
                    </p>
                  </div>
                  <div>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={6}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Enter your message here..."
                    />
                    <p className="mt-2 text-sm text-gray-500">
                      Tip: Keep your message clear and concise for better engagement
                    </p>
                  </div>
                </div>
              )}

              {/* Step 3: Contact Management */}
              {activeStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Add Phone Numbers</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Add phone numbers manually or upload a CSV file
                    </p>
                  </div>

                  {/* Manual Entry */}
                  <div className="flex gap-2">
                    <input
                      type="tel"
                      value={newNumber}
                      onChange={(e) => setNewNumber(e.target.value)}
                      placeholder="Enter phone number"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                    <button
                      type="button"
                      onClick={handleAddNumber}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </div>

                  {/* CSV Upload */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <div className="space-y-1">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                          <span>Upload CSV</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            accept=".csv"
                            onChange={handleFileUpload}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        CSV file with phone numbers (one per line)
                      </p>
                    </div>
                  </div>

                  {/* Numbers Table */}
                  <div className="mt-4">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Phone Number
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {phoneNumbers.map((number) => (
                            <tr key={number.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {number.number}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveNumber(number.id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Remove
                                </button>
                              </td>
                            </tr>
                          ))}
                          {phoneNumbers.length === 0 && (
                            <tr>
                              <td colSpan={2} className="px-6 py-4 text-center text-sm text-gray-500">
                                No phone numbers added yet
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="mt-8 flex justify-between">
                {activeStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Previous
                  </button>
                )}
                {activeStep < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading || phoneNumbers.length === 0}
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 ${
                      (isLoading || phoneNumbers.length === 0) ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isLoading ? 'Starting Campaign...' : 'Start Campaign'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 