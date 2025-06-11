
export enum DownloadFormat {
  AUDIO = 'audio',
  VIDEO = 'video',
}

export interface DownloadRequest {
  url: string;
  format: DownloadFormat;
  filename: string;
}

export interface DownloadResponse {
  downloadLink?: string;
  message?: string; // For success or general info
  error?: string; // For error messages
}
