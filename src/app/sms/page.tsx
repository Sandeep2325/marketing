'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Contact {
  id: string;
  name: string;
  number: string;
}

interface UserNumbers {
  telemarketingNumber: string;
  smsNumber: string;
  email: string;
}

export default function SMS() {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [newContact, setNewContact] = useState({ name: '', number: '' });
  const [activeStep, setActiveStep] = useState(1);
  const [userNumbers, setUserNumbers] = useState<UserNumbers | null>(null);
  const [loadingNumbers, setLoadingNumbers] = useState(true);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const lines = text.split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0);
        
        const newContacts = lines.map(line => {
          const [name, number] = line.split(',').map(item => item.trim());
          return {
            id: Math.random().toString(36).substr(2, 9),
            name: name || 'Unknown',
            number: number || ''
          };
        });
        
        setContacts(prev => [...prev, ...newContacts]);
      };
      reader.readAsText(file);
    }
  };

  const handleAddContact = () => {
    if (newContact.number.trim()) {
      setContacts(prev => [...prev, {
        id: Math.random().toString(36).substr(2, 9),
        name: newContact.name.trim() || 'Unknown',
        number: newContact.number.trim()
      }]);
      setNewContact({ name: '', number: '' });
    }
  };

  const handleRemoveContact = (id: string) => {
    setContacts(prev => prev.filter(contact => contact.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (contacts.length === 0) {
      alert('Please add at least one contact');
      return;
    }
    
    setIsLoading(true);
    // TODO: Implement API calls
    console.log({
      message,
      contacts,
    });

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    router.push('/dashboard');
  };

  const nextStep = () => {
    setActiveStep(prev => Math.min(prev + 1, 2));
  };

  const prevStep = () => {
    setActiveStep(prev => Math.max(prev - 1, 1));
  };

  useEffect(() => {
    const fetchUserNumbers = async () => {
      try {
        const response = await fetch('/api/assign-numbers', {
          method: 'POST',
        });
        if (response.ok) {
          const data = await response.json();
          setUserNumbers(data);
        }
      } catch (error) {
        console.error('Error fetching user numbers:', error);
      } finally {
        setLoadingNumbers(false);
      }
    };

    fetchUserNumbers();
  }, []);

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
                href="/email"
                className="text-gray-600 hover:text-gray-900"
              >
                Email
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Progress Steps */}
      <div className="bg-white shadow-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between py-6">
            <div className={`flex items-center ${activeStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${activeStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <span className="ml-2 text-sm font-medium">Set Message</span>
            </div>
            <div className={`flex items-center ${activeStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${activeStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <span className="ml-2 text-sm font-medium">Add Contacts</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">SMS Campaign</h1>
          <p className="text-xl text-gray-600">
            {loadingNumbers ? (
              'Loading your dedicated phone number...'
            ) : userNumbers ? (
              `Your dedicated number: ${userNumbers.smsNumber}`
            ) : (
              'Failed to load your dedicated number'
            )}
          </p>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <form onSubmit={handleSubmit}>
                {/* Step 1: Message Setup */}
                {activeStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Craft Your Message</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Write the message you want to send to your contacts
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

                {/* Step 2: Contact Management */}
                {activeStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Add Contacts</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Add contacts manually or upload a CSV file
                      </p>
                    </div>

                    {/* Manual Entry */}
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={newContact.name}
                        onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Contact name (optional)"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                      <div className="flex gap-2">
                        <input
                          type="tel"
                          value={newContact.number}
                          onChange={(e) => setNewContact(prev => ({ ...prev, number: e.target.value }))}
                          placeholder="Phone number"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                        <button
                          type="button"
                          onClick={handleAddContact}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                        >
                          Add
                        </button>
                      </div>
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
                          CSV file with name and phone number (comma-separated)
                        </p>
                      </div>
                    </div>

                    {/* Contacts Table */}
                    <div className="mt-4">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Phone Number
                              </th>
                              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {contacts.map((contact) => (
                              <tr key={contact.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {contact.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {contact.number}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveContact(contact.id)}
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    Remove
                                  </button>
                                </td>
                              </tr>
                            ))}
                            {contacts.length === 0 && (
                              <tr>
                                <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                                  No contacts added yet
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
                  {activeStep < 2 ? (
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
                      disabled={isLoading || contacts.length === 0}
                      className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 ${
                        (isLoading || contacts.length === 0) ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {isLoading ? 'Sending Messages...' : 'Send Messages'}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 