import React, { useEffect, useState } from 'react';
import { Upload, Image, Video, CheckCircle, AlertCircle, X, Edit2, Trash2 } from 'lucide-react';
import { API_URL } from '../../hooks/tools';
import { toast } from 'react-toastify';

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

  // Banner list and edit states
  const [banners, setBanners] = useState([]);
  const [editingBanner, setEditingBanner] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

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

  // Fetch banners
  const getBanners = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/getbanners`, {
        credentials: 'include'
      });
      const data = await res.json();
      if (data.data) {
        setBanners(data.data);
      }
    } catch (err) {
      toast.error("Error in fetching banners");
    }
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

      const response = await fetch(`${API_URL}/admin/updatebanner`, {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setImageUploadStatus('success');
        setBannerImage(null);
        setBannerPreview('');
        setHeader('');
        setSubHeader('');
        toast.success('Banner uploaded successfully!');
        getBanners(); // Refresh banner list
      } else {
        setImageUploadStatus('error');
        toast.error('Upload failed');
      }
    } catch (error) {
      setImageUploadStatus('error');
      toast.error('Error uploading banner');
    } finally {
      setImageUploading(false);
    }
  };

  // Edit banner
  const handleEditBanner = (banner) => {
    setEditingBanner(banner);
    setIsEditMode(true);
    setHeader(banner.header);
    setSubHeader(banner.subHeader);
    setBannerPreview(banner.banner);
  };

  // Update banner
  const updateBannerData = async () => {
    

    setImageUploading(true);
    setImageUploadStatus('');

    try {
      const formData = new FormData();
      if (bannerImage) {
        formData.append('banner', bannerImage);
      }
      formData.append('header', header);
      formData.append('subHeader', subHeader);

      const response = await fetch(`${API_URL}/admin/editbanner/${editingBanner._id}`, {
        method: 'PUT',
        body: formData,
        credentials: 'include'
      });

      
      if (response.ok) {
        setImageUploadStatus('success');
        toast.success('Banner updated successfully!');
        cancelEdit();
        getBanners();
      } else {
        setImageUploadStatus('error');
        toast.error('Update failed');
      }
    } catch (error) {
      setImageUploadStatus('error');
      toast.error('Error updating banner');
    } finally {
      setImageUploading(false);
    }
  };

  // Cancel edit
  const cancelEdit = () => {
    setIsEditMode(false);
    setEditingBanner(null);
    setBannerImage(null);
    setBannerPreview('');
    setHeader('');
    setSubHeader('');
    setImageUploadStatus('');
  };

  // Delete banner
  const handleDeleteBanner = async (bannerId) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/admin/deletebanner/${bannerId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        toast.success('Banner deleted successfully!');
        getBanners();
      } else {
        toast.error('Delete failed');
      }
    } catch (error) {
      toast.error('Error deleting banner');
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

      const response = await fetch(`${API_URL}/admin/updatevideo`, {
        method: 'PUT',
        body: formData,
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setVideoUploadStatus('success');
        setVideoFile(null);
        setVideoPreview('');
        toast.success('Video uploaded successfully!');
      } else {
        setVideoUploadStatus('error');
        toast.error('Video upload failed');
      }
    } catch (error) {
      setVideoUploadStatus('error');
      toast.error('Error uploading video');
    } finally {
      setVideoUploading(false);
    }
  };

  useEffect(() => {
    getBanners();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="rounded-lg p-6">
          <h1 className={`text-3xl font-bold ${GRADIENT_CLASS} bg-clip-text text-transparent mb-2`}>
            Upload Client Assets
          </h1>
          <p className="text-gray-600">Upload banner images and homepage videos</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Banner Upload/Edit Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Image className="text-blue-600" size={24} />
                <h2 className="text-xl font-semibold text-gray-800">
                  {isEditMode ? 'Edit Banner' : 'Add New Banner'}
                </h2>
              </div>
              {isEditMode && (
                <button
                  onClick={cancelEdit}
                  className="text-gray-500 hover:text-gray-700 text-sm"
                >
                  Cancel
                </button>
              )}
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
                  Banner Image {isEditMode && '(Optional - leave empty to keep current)'}
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
                      <span>Banner {isEditMode ? 'updated' : 'uploaded'} successfully!</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle size={20} />
                      <span>Operation failed. Please try again.</span>
                    </>
                  )}
                </div>
              )}

              {/* Upload/Update Button */}
              <button
                onClick={isEditMode ? updateBannerData : uploadBannerData}
                disabled={imageUploading}
                className={`w-full px-6 py-3 ${GRADIENT_CLASS} text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
              >
                {imageUploading ? 'Processing...' : (isEditMode ? 'Update Banner' : 'Upload Banner')}
              </button>
            </div>
          </div>

          {/* Existing Banners List */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-6">
              <Image className="text-green-600" size={24} />
              <h2 className="text-xl font-semibold text-gray-800">Existing Banners</h2>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {banners.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No banners found</p>
              ) : (
                banners.map((banner, index) => (
                  <div
                    key={banner._id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex gap-4">
                      <img
                        src={banner.banner}
                        alt={banner.header}
                        className="w-32 h-20 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 truncate">
                          {banner.header}
                        </h3>
                        <p className="text-sm text-gray-600 truncate">
                          {banner.subHeader}
                        </p>
                        {index === 0 && (
                          <span className="inline-block mt-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            Primary
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleEditBanner(banner)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit banner"
                        >
                          <Edit2 size={18} />
                        </button>
                        {index !== 0 && (
                          <button
                            onClick={() => handleDeleteBanner(banner._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete banner"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
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