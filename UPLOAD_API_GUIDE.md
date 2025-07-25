# File Upload API Guide

This guide covers the complete File Upload API implementation for handling single and multiple file uploads with image validation and storage.

## 📋 Overview

The Upload API provides secure file upload functionality with:
- Single file upload
- Multiple file upload (up to 10 files)
- Image format validation
- Automatic file naming with timestamps
- File size limits
- Static file serving

## 🔐 Authentication

**Note**: The Upload API does **NOT** require authentication by default. However, you can add authentication middleware if needed for your use case.

## 📁 Supported File Types

### ✅ **Allowed Formats:**
- **JPEG** (`.jpg`, `.jpeg`)
- **PNG** (`.png`)
- **WebP** (`.webp`)

### ❌ **Not Supported:**
- GIF, SVG, PDF, DOC, etc.
- Any non-image files

## 📏 File Size Limits

- **Maximum File Size**: 5MB per file
- **Maximum Files**: 10 files per request (for multiple upload)

## 📝 API Endpoints

### 1. Upload Single File
**POST** `/api/upload`

Upload a single image file and get its URL.

**Headers:**
```http
Content-Type: multipart/form-data
```

**Form Data:**
- `file` (required): Single image file

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/upload \
  -F "file=@/path/to/image.jpg"
```

**Response:**
```json
{
  "url": "/uploads/1751387168020-741826672-image.jpg"
}
```

**Error Response (No File):**
```json
{
  "message": "No file uploaded"
}
```

**Error Response (Invalid File Type):**
```json
{
  "message": "Error: Images Only!"
}
```

### 2. Upload Multiple Files
**POST** `/api/upload/multiple`

Upload multiple image files (up to 10) and get their URLs.

**Headers:**
```http
Content-Type: multipart/form-data
```

**Form Data:**
- `files` (required): Array of image files (max 10)

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/upload/multiple \
  -F "files=@/path/to/image1.jpg" \
  -F "files=@/path/to/image2.png" \
  -F "files=@/path/to/image3.webp"
```

**Response:**
```json
{
  "urls": [
    "/uploads/1751387168020-741826672-image1.jpg",
    "/uploads/1751387168021-123456789-image2.png",
    "/uploads/1751387168022-987654321-image3.webp"
  ]
}
```

**Error Response (No Files):**
```json
{
  "message": "No files uploaded"
}
```

## 🖼️ File Storage Details

### Storage Location
Files are stored in the `uploads/` directory at the project root.

### File Naming Convention
Files are automatically renamed using the format:
```
{timestamp}-{random_number}-{original_filename}
```

**Example:**
- Original: `profile.jpg`
- Stored as: `1751387168020-741826672-profile.jpg`

### File Access
Uploaded files are served statically at:
```
http://localhost:3000/uploads/{filename}
```

## 🔒 Security Features

### 1. File Type Validation
- Only image files (JPEG, PNG, WebP) are allowed
- Both MIME type and file extension are validated
- Rejects non-image files with clear error message

### 2. File Size Limits
- Maximum 5MB per file
- Prevents large file uploads that could impact performance

### 3. Unique File Names
- Timestamp-based naming prevents filename conflicts
- Random number suffix adds additional uniqueness
- Original filename is preserved for reference

### 4. Storage Isolation
- Files are stored in a dedicated uploads directory
- Separate from application code for security

## 🚨 Error Handling

### Common Error Scenarios:

**1. No File Uploaded:**
```json
{
  "message": "No file uploaded"
}
```

**2. Invalid File Type:**
```json
{
  "message": "Error: Images Only!"
}
```

**3. File Too Large:**
```json
{
  "message": "File too large"
}
```

**4. Multiple Files Error:**
```json
{
  "message": "No files uploaded"
}
```

## 📊 File Upload Statistics

### Current Implementation:
- **Supported Formats**: 3 (JPEG, PNG, WebP)
- **Max File Size**: 5MB
- **Max Files per Request**: 10
- **Storage**: Local disk storage
- **File Serving**: Static file serving

## 🔧 Configuration

### Multer Configuration:
```typescript
const upload = multer({
  storage: multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, `${uniqueSuffix}-${file.originalname}`);
    }
  }),
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Error: Images Only!'));
  },
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB
  }
});
```

## 📝 Usage Examples

### Frontend Integration (JavaScript):

#### Single File Upload:
```javascript
async function uploadSingleFile(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  });

  const result = await response.json();
  return result.url;
}

// Usage
const fileInput = document.getElementById('fileInput');
fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (file) {
    try {
      const url = await uploadSingleFile(file);
      console.log('File uploaded:', url);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  }
});
```

#### Multiple File Upload:
```javascript
async function uploadMultipleFiles(files) {
  const formData = new FormData();
  
  Array.from(files).forEach(file => {
    formData.append('files', file);
  });

  const response = await fetch('/api/upload/multiple', {
    method: 'POST',
    body: formData
  });

  const result = await response.json();
  return result.urls;
}

// Usage
const fileInput = document.getElementById('multipleFileInput');
fileInput.addEventListener('change', async (e) => {
  const files = e.target.files;
  if (files.length > 0) {
    try {
      const urls = await uploadMultipleFiles(files);
      console.log('Files uploaded:', urls);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  }
});
```

### React Integration:
```jsx
import React, { useState } from 'react';

const FileUpload = () => {
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (files.length === 0) return;

    setUploading(true);
    
    try {
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('files', file);
      });

      const response = await fetch('/api/upload/multiple', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      setUploadedUrls(result.urls);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileUpload}
        disabled={uploading}
      />
      
      {uploading && <p>Uploading...</p>}
      
      {uploadedUrls.length > 0 && (
        <div>
          <h3>Uploaded Images:</h3>
          {uploadedUrls.map((url, index) => (
            <img key={index} src={url} alt={`Uploaded ${index + 1}`} style={{ width: 100, height: 100, margin: 5 }} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
```

### Node.js/Express Integration:
```javascript
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  
  const url = `/uploads/${req.file.filename}`;
  res.json({ url });
});
```

## 🔄 Integration with Other APIs

The Upload API integrates seamlessly with:

### Product API:
```javascript
// Upload product images
const uploadProductImages = async (productId, images) => {
  // First upload images
  const formData = new FormData();
  images.forEach(image => formData.append('files', image));
  
  const uploadResponse = await fetch('/api/upload/multiple', {
    method: 'POST',
    body: formData
  });
  
  const { urls } = await uploadResponse.json();
  
  // Then create product with image URLs
  const productResponse = await fetch('/api/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'x-company-id': companyId
    },
    body: JSON.stringify({
      name: 'Product Name',
      description: 'Product Description',
      price: 29.99,
      category: categoryId,
      stock: 100,
      images: urls // Use uploaded image URLs
    })
  });
  
  return productResponse.json();
};
```

### Review API:
```javascript
// Upload review images
const uploadReviewImages = async (reviewId, images) => {
  const formData = new FormData();
  images.forEach(image => formData.append('files', image));
  
  const uploadResponse = await fetch('/api/upload/multiple', {
    method: 'POST',
    body: formData
  });
  
  const { urls } = await uploadResponse.json();
  
  // Update review with image URLs
  const reviewResponse = await fetch(`/api/reviews/${reviewId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'x-company-id': companyId
    },
    body: JSON.stringify({
      images: urls
    })
  });
  
  return reviewResponse.json();
};
```

## 📈 Performance Considerations

### Current Optimizations:
- **File Size Limit**: 5MB prevents large uploads
- **File Count Limit**: 10 files max per request
- **Static Serving**: Direct file access without processing
- **Unique Naming**: Prevents filename conflicts

### Future Enhancements:
- Image compression
- Thumbnail generation
- CDN integration
- Cloud storage (AWS S3, Google Cloud Storage)

## 🛠️ Troubleshooting

### Common Issues:

**1. "No file uploaded" Error:**
- Check if the form field name is `file` (single) or `files` (multiple)
- Ensure the file is actually selected

**2. "Images Only!" Error:**
- Verify the file is JPEG, PNG, or WebP format
- Check both file extension and MIME type

**3. "File too large" Error:**
- Reduce file size to under 5MB
- Consider image compression

**4. Files not displaying:**
- Check if the uploads directory exists
- Verify static file serving is configured
- Ensure file permissions are correct

This comprehensive Upload API provides robust file handling with proper validation, security, and integration capabilities for your e-commerce application. 