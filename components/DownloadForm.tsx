
import React, { useState } from 'react';
import { DownloadFormat } from '../types';
import LoadingSpinner from './LoadingSpinner';
import DownloadIcon from './icons/DownloadIcon';
import VideoIcon from './icons/VideoIcon';
import AudioIcon from './icons/AudioIcon';

interface DownloadFormProps {
  onSubmit: (url: string, format: DownloadFormat, filename: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  downloadLink: string | null;
}

const DownloadForm: React.FC<DownloadFormProps> = ({ onSubmit, isLoading, error, downloadLink }) => {
  const [url, setUrl] = useState<string>('');
  const [format, setFormat] = useState<DownloadFormat>(DownloadFormat.VIDEO);
  const [filename, setFilename] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!url.trim() || !filename.trim()) {
      // Basic validation, more can be handled by parent or here
      alert("URL and Filename cannot be empty.");
      return;
    }
    onSubmit(url, format, filename);
  };

  return (
    <div className="w-full max-w-lg p-8 space-y-6 bg-white shadow-xl rounded-lg">
      <h1 className="text-3xl font-bold text-center text-gray-800">YouTube Downloader</h1>
      <p className="text-center text-gray-600">Enter YouTube link, choose format, and specify filename.</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
            YouTube URL
          </label>
          <input
            type="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150"
          />
        </div>

        <div>
          <label htmlFor="format" className="block text-sm font-medium text-gray-700 mb-1">
            Format
          </label>
          <div className="flex space-x-2">
            {(Object.values(DownloadFormat) as Array<DownloadFormat>).map((fmtOption) => (
                <button
                    type="button"
                    key={fmtOption}
                    onClick={() => setFormat(fmtOption)}
                    className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 border rounded-md transition-all duration-150 ease-in-out
                                ${format === fmtOption ? 'bg-blue-500 text-white border-blue-500 ring-2 ring-blue-300' : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-300'}`}
                >
                    {fmtOption === DownloadFormat.VIDEO ? <VideoIcon className="w-5 h-5" /> : <AudioIcon className="w-5 h-5" />}
                    <span className="capitalize">{fmtOption}</span>
                </button>
            ))}
          </div>
        </div>
        
        <div>
          <label htmlFor="filename" className="block text-sm font-medium text-gray-700 mb-1">
            Filename (without extension)
          </label>
          <input
            type="text"
            id="filename"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            placeholder="my-cool-video"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              <DownloadIcon className="w-5 h-5 mr-2" />
              Request Download
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {downloadLink && (
        <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
          <p className="font-medium">Download Ready (Simulated):</p>
          <p className="break-all">
            Your file would be available at: 
            <a 
              href={downloadLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-semibold text-blue-600 hover:underline ml-1"
              onClick={(e) => {
                e.preventDefault();
                alert(`This is a simulated link. In a real application, clicking this would download the file from: ${downloadLink}`);
              }}
            >
              {downloadLink}
            </a>
          </p>
          <p className="text-sm text-gray-600 mt-1">Note: This is a frontend demonstration. No actual file has been downloaded by this UI. The link points to where a backend service would make the file available.</p>
        </div>
      )}
    </div>
  );
};

export default DownloadForm;
