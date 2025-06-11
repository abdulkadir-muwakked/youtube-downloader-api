
import React, { useState, useCallback } from 'react';
import { DownloadFormat, DownloadResponse } from './types';
import DownloadForm from './components/DownloadForm';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadLink, setDownloadLink] = useState<string | null>(null);

  const handleDownloadRequest = useCallback(async (url: string, format: DownloadFormat, filename: string) => {
    setIsLoading(true);
    setError(null);
    setDownloadLink(null);

    // Simulate API call to the backend
    // In a real application, this would be an actual fetch request:
    // const backendUrl = '/download'; 
    // try {
    //   const response = await fetch(backendUrl, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ url, format, filename }),
    //   });
    //   const data: DownloadResponse = await response.json();
    //   if (!response.ok || data.error) {
    //     throw new Error(data.error || 'Failed to initiate download.');
    //   }
    //   setDownloadLink(data.downloadLink || null);
    //   if (data.message) console.log(data.message); // Or display it
    // } catch (err) {
    //   setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    // } finally {
    //   setIsLoading(false);
    // }

    // Mocked API call for demonstration:
    console.log('Simulating download request:', { url, format, filename });
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

    // Basic validation for mock
    if (!url.toLowerCase().includes('youtube.com')) {
      setError('Mock Error: Please use a valid YouTube.com URL for this demo.');
      setIsLoading(false);
      return;
    }
    if (filename.trim() === "") {
        setError('Mock Error: Filename cannot be empty.');
        setIsLoading(false);
        return;
    }


    const fileExtension = format === DownloadFormat.AUDIO ? 'mp3' : 'mp4';
    // Remove existing extension from filename if present, then add new one
    const baseFilename = filename.includes('.') ? filename.substring(0, filename.lastIndexOf('.')) : filename;
    const mockFileNameWithExtension = `${baseFilename}.${fileExtension}`;
    
    // Simulate a successful response
    const mockResponse: DownloadResponse = {
      downloadLink: `/downloads/${mockFileNameWithExtension}`, // Simulates link from backend 'downloads/' folder
      message: `Download request for ${mockFileNameWithExtension} processed successfully (simulated).`
    };
    
    setDownloadLink(mockResponse.downloadLink || null);
    // You could also use mockResponse.message to show a success message
    
    setIsLoading(false);

  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-700 p-4 selection:bg-blue-500 selection:text-white">
      <main className="container mx-auto flex flex-col items-center">
        <DownloadForm 
          onSubmit={handleDownloadRequest}
          isLoading={isLoading}
          error={error}
          downloadLink={downloadLink}
        />
        <footer className="mt-8 text-center">
          <p className="text-sm text-gray-400">
            This is a UI demonstration. Actual downloads are handled by a backend service.
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Inspired by the request for a `youtube-downloader-api`.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default App;
