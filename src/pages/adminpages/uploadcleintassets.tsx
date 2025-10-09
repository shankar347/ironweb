import React, { useState } from 'react';
import { Upload, Image, Video, CheckCircle, AlertCircle, X } from 'lucide-react';
import { API_URL } from '../../hooks/tools';

// const GRADIENT_CLASS = 'bg-gradient-to-r from-blue-600 to-purple-600';
const GRADIENT_CLASS = 'bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700';


const UploadClientAssets = () => {
  // Image upload states
  const [bannerImage, setBannerImage] = useState(null);
  const [bannerPreview, setBannerPreview] = useState('');
  const [header, setHeader] = useState('');
  const [subHeader, setSubHeader] = useState('');
  const [imageUploadStatus, setImageUploadStatus] = useState('');
  const [imageUploading, setImageUploading] = useState(false);

  // Video upload states
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState('');
  const [videoUploadStatus, setVideoUploadStatus] = useState('');
  const [videoUploading, setVideoUploading] = useState(false);

  // Handle banner image selection
  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setBannerImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setBannerPreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        alert('Please select a valid image file');
      }
    }
  };

  // Handle video selection
  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('video/')) {
        setVideoFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setVideoPreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        alert('Please select a valid video file');
      }
    }
  };

  // Remove banner image
  const removeBannerImage = () => {
    setBannerImage(null);
    setBannerPreview('');
  };

  // Remove video
  const removeVideo = () => {
    setVideoFile(null);
    setVideoPreview('');
  };

  // Upload banner and text data
  const uploadBannerData = async () => {
    if (!bannerImage || !header || !subHeader) {
      setImageUploadStatus('error');
      alert('Please fill in all fields and select an image');
      return;
    }

    setImageUploading(true);
    setImageUploadStatus('');

    try {
      const formData = new FormData();
      formData.append('banner', bannerImage);
      formData.append('header', header);
      formData.append('subHeader', subHeader);

      // Replace with your actual API endpoint
      const response = await fetch(`${API_URL}/admin/updatebanner`, {
        method: 'POST',
        body: formData,
        credentials:'include'
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data)
        setImageUploadStatus('success');
        // Reset form
        setBannerImage(null);
        setBannerPreview('');
        setHeader('');
        setSubHeader('');
        // console.log('Upload successful:', data);
      } else {
        setImageUploadStatus('error');
        console.error('Upload failed');
      }
    } catch (error) {
      setImageUploadStatus('error');
      console.error('Error uploading banner:', error);
    } finally {
      setImageUploading(false);
    }
  };

  
  // Upload homepage video
  const uploadHomeVideo = async () => {
    if (!videoFile) {
      setVideoUploadStatus('error');
      alert('Please select a video file');
      return;
    }

    setVideoUploading(true);
    setVideoUploadStatus('');

    try {
      const formData = new FormData();
      formData.append('video', videoFile);

      // Replace with your actual API endpoint
      const response = await fetch(`${API_URL}/admin/updatevideo`, {
        method: 'PUT',
        body: formData,
        credentials:'include'
      });

      if (response.ok) {
        const data = await response.json();
        setVideoUploadStatus('success');
        // Reset form
        setVideoFile(null);
        setVideoPreview('');
        console.log('Video upload successful:', data);
      } else {
        setVideoUploadStatus('error');
        console.error('Video upload failed');
      }
    } catch (error) {
      setVideoUploadStatus('error');
      console.error('Error uploading video:', error);
    } finally {
      setVideoUploading(false);
    }
  };



  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="rounded-lg p-6">
          <h1 className={`text-3xl font-bold ${GRADIENT_CLASS} bg-clip-text text-transparent mb-2`}>
            Upload Client Assets
          </h1>
          <p className="text-gray-600">Upload banner images and homepage videos</p>
        </div>

        {/* Banner Upload Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-6">
            <Image className="text-blue-600" size={24} />
            <h2 className="text-xl font-semibold text-gray-800">Banner Image Upload</h2>
          </div>

          <div className="space-y-4">
            {/* Header Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Header Text
              </label>
              <input
                type="text"
                value={header}
                onChange={(e) => setHeader(e.target.value)}
                placeholder="Enter header text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Sub Header Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Sub Header Text
              </label>
              <input
                type="text"
                value={subHeader}
                onChange={(e) => setSubHeader(e.target.value)}
                placeholder="Enter sub header text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Banner Image Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Banner Image
              </label>
              
              {!bannerPreview ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBannerChange}
                    className="hidden"
                    id="banner-upload"
                  />
                  <label htmlFor="banner-upload" className="cursor-pointer">
                    <Upload className="mx-auto text-gray-400 mb-3" size={48} />
                    <p className="text-gray-600 mb-1">Click to upload banner image</p>
                    <p className="text-sm text-gray-400">PNG, JPG, WEBP up to 10MB</p>
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={bannerPreview}
                    alt="Banner preview"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <button
                    onClick={removeBannerImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              )}
            </div>

            {/* Upload Status */}
            {imageUploadStatus && (
              <div className={`flex items-center gap-2 p-3 rounded-lg ${
                imageUploadStatus === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                {imageUploadStatus === 'success' ? (
                  <>
                    <CheckCircle size={20} />
                    <span>Banner uploaded successfully!</span>
                  </>
                ) : (
                  <>
                    <AlertCircle size={20} />
                    <span>Upload failed. Please try again.</span>
                  </>
                )}
              </div>
            )}

            {/* Upload Button */}
            <button
              onClick={uploadBannerData}
              disabled={imageUploading}
              className={`w-full px-6 py-3 ${GRADIENT_CLASS} text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
            >
              {imageUploading ? 'Uploading...' : 'Upload Banner'}
            </button>
          </div>
        </div>

        {/* Video Upload Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-6">
            <Video className="text-purple-600" size={24} />
            <h2 className="text-xl font-semibold text-gray-800">Homepage Video Upload</h2>
          </div>

          <div className="space-y-4">
            {/* Video Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Upload Video
              </label>
              
              {!videoPreview ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-500 transition-colors">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className="hidden"
                    id="video-upload"
                  />
                  <label htmlFor="video-upload" className="cursor-pointer">
                    <Video className="mx-auto text-gray-400 mb-3" size={48} />
                    <p className="text-gray-600 mb-1">Click to upload video</p>
                    <p className="text-sm text-gray-400">MP4, WEBM, MOV up to 100MB</p>
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <video
                    src={videoPreview}
                    controls
                    className="w-full h-64 rounded-lg bg-black"
                  />
                  <button
                    onClick={removeVideo}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              )}
            </div>

            {/* Upload Status */}
            {videoUploadStatus && (
              <div className={`flex items-center gap-2 p-3 rounded-lg ${
                videoUploadStatus === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                {videoUploadStatus === 'success' ? (
                  <>
                    <CheckCircle size={20} />
                    <span>Video uploaded successfully!</span>
                  </>
                ) : (
                  <>
                    <AlertCircle size={20} />
                    <span>Upload failed. Please try again.</span>
                  </>
                )}
              </div>
            )}

            {/* Upload Button */}
            <button
              onClick={uploadHomeVideo}
              disabled={videoUploading}
              className={`w-full px-6 py-3 ${GRADIENT_CLASS} text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
            >
              {videoUploading ? 'Uploading...' : 'Upload Video'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadClientAssets;