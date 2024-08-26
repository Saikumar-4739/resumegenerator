import React, { useState, useEffect } from 'react';
import { Card, Spin, Alert, Button, Upload, message } from 'antd';
import 'antd/dist/reset.css';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { RcFile } from 'antd/es/upload';

const BASE_URL = 'http://localhost:3023/images/uploads/';

export const ImageUpload = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImageUrl = async () => {
      setLoading(true);
      setError(null);

      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError('User ID not found');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3023/images/user/${userId}`);
        if (response.status === 200) {
          const data = response.data;
          if (data.length > 0 && data[0].path) {
            setImageUrl(`${BASE_URL}${data[0].path}`);
          } else {
            setError('Image URL not found in response');
          }
        } else {
          setError(`Failed to fetch image. Status: ${response.status}`);
        }
      } catch (error) {
        setError(`Error fetching image: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchImageUrl();
  }, []);

  const handleCustomRequest = async (options: any) => {
    const { file, onSuccess, onError } = options;

    const userId = localStorage.getItem('userId');
    if (!userId) {
      message.error('User ID not found');
      onError(new Error('User ID not found'));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      if (typeof reader.result === 'string') {
        const base64 = reader.result;
        try {
          const response = await axios.post('http://localhost:3023/images/upload', {
            base64,
            userId: Number(userId),
          }, {
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (response.status === 200) {
            setImageUrl(`${BASE_URL}${response.data.path}`);
            message.success('Image uploaded successfully');
            onSuccess({}, file);
          } else {
            throw new Error(`Failed to upload image. Status: ${response.status}`);
          }
        } catch (error) {
          message.error(`Error uploading image: ${error instanceof Error ? error.message : 'Unknown error'}`);
          onError(error);
        }
      } else {
        onError(new Error('Failed to read file as data URL'));
      }
    };

    reader.readAsDataURL(file as RcFile);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Upload Image</h1>
      <Upload
        customRequest={handleCustomRequest}
        showUploadList={false}
      >
        <Button icon={<UploadOutlined />}>Click to Upload</Button>
      </Upload>
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        {loading && (
          <div style={{ position: 'relative', height: '300px' }}>
            <Spin tip="Loading image..." spinning={loading} />
          </div>
        )}
        {error && <Alert message={error} type="error" showIcon />}
        {imageUrl && !loading && !error && (
          <Card
            style={{
              width: 250,
              height: 300,
              margin: '0 auto',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden'
            }}
            cover={
              <img
                alt="Preview"
                src={imageUrl}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            }
          />
        )}
        {!imageUrl && !loading && !error && <p>No image uploaded yet</p>}
      </div>
    </div>
  );
};
