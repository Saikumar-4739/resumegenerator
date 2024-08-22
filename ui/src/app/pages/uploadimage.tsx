import React, { useState, useEffect } from 'react';

export const ImageUpload = () => {
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    const savedImageUrl = localStorage.getItem('uploadedImage');
    if (savedImageUrl) {
      setImageUrl(savedImageUrl);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImageUrl(reader.result);
          localStorage.setItem('uploadedImage', reader.result);
        } else {
          console.error('Failed to read file as data URL');
        }
      };
      reader.readAsDataURL(file);
    } else {
      console.error('No file selected');
    }
  };

  return (
    <div>
      <h1>Upload Image</h1>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {imageUrl ? (
        <img src={imageUrl} alt="Preview" width="100" />
      ) : (
        <p>No image uploaded yet</p>
      )}
    </div>
  );
};
