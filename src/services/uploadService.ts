import axios from 'axios';
import { BASE_URL } from './config';

class UploadService {
  // Upload a single image file, returns the uploaded URL
  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(`${BASE_URL}/api/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.url;
  }

  // Upload multiple image files, returns an array of uploaded URLs
  async uploadImages(files: File[]): Promise<string[]> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    const response = await axios.post(`${BASE_URL}/api/upload/multiple`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.urls;
  }
}

export const uploadService = new UploadService(); 