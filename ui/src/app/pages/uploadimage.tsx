import React from 'react';
import { Card, Spin, Alert, Button, Upload, message } from 'antd';
import { LeftOutlined, RightOutlined, UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { RcFile } from 'antd/es/upload/interface';
import { useNavigate } from 'react-router-dom';
import "./styles/uploadimage.css"

const BASE_URL = 'http://localhost:3023/images/uploads/';

export const ImageUpload = () => {
  const [imageUrl, setImageUrl] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  const navigate = useNavigate();

  React.useEffect(() => {
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
        if (response.status === 200 && response.data.length > 0) {
          const { path } = response.data[0];
          if (path) {
            setImageUrl(`${BASE_URL}${path}`);
          } else {
            setError('Image URL not found in response');
          }
        } else {
          setError(`Failed to fetch image. Status: ${response.status}`);
        }
      } catch (err) {
        setError(`Error fetching image: ${err instanceof Error ? err.message : 'Unknown error'}`);
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
      const errorMsg = 'User ID not found';
      message.error(errorMsg);
      onError(new Error(errorMsg));
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

          if (response.status === 200 || response.status === 201) {
            setImageUrl(`${BASE_URL}${response.data.path}`);
            message.success('Image uploaded successfully');
            onSuccess({}, file);
          } else {
            const errorMsg = `Failed to upload image. Status: ${response.status}`;
            message.error(errorMsg);
            onError(new Error(errorMsg));
          }
        } catch (err) {
          const errorMsg = `Error uploading image: ${err instanceof Error ? err.message : 'Unknown error'}`;
          message.error(errorMsg);
          onError(err);
        }
      } else {
        const errorMsg = 'Failed to read file as data URL';
        message.error(errorMsg);
        onError(new Error(errorMsg));
      }
    };

    reader.readAsDataURL(file as RcFile);
  };

  const handlePrevious = () => {
    navigate('/perosnal-details');
  };

  const handleNextSection = () => {
    navigate('/preview-resume');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 className='name'>Upload Image</h1>
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        {loading && (
          <div style={{ position: 'relative', height: '300px' }}>
            <Spin spinning={loading} />
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
              border: '2px solid black',
              overflow: 'hidden',
              backgroundColor: 'white',
            }}
          >
            <img
              alt="Preview"
              src={imageUrl}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </Card>
        )}
        {!imageUrl && !loading && !error && <p>No image uploaded yet</p>}
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '20px'
      }}>
        <Button
          type="default"
          onClick={handlePrevious}
          icon={<LeftOutlined />}
          style={{ marginRight: '8px' }}
        />
        <Upload
          customRequest={handleCustomRequest}
          showUploadList={false}
        >
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
        <Button
          type="default"
          onClick={handleNextSection}
          icon={<RightOutlined />}
          style={{ marginLeft: '8px' }}
        />
      </div>
    </div>
  );
};
