import React, { useEffect, useState } from 'react';
import { Upload, Image, Video, CheckCircle, AlertCircle, X, Edit2, Trash2, Shirt, ShirtIcon, ToggleLeft, ToggleRight } from 'lucide-react';
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
  
  const [Itemlist, setItemlist] = useState([]);
  const [name, setname] = useState('');
  const [price, setprice] = useState('');
  const [isItemuploading, setisitemuploading] = useState(false);
  const [isItemedit, setIsitemEdit] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Booking status states
  const [bookingStatus, setBookingStatus] = useState({
    status: true,
    lastUpdated: null,
    updatedBy: 'admin'
  });
  const [isToggling, setIsToggling] = useState(false);

  // Fetch booking status using the provided endpoint
  const getBookingStatus = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/getbookstatus`, {
        credentials: 'include',
      });
      const data = await res.json();
      
      if (data?.success) {
        setBookingStatus({
          status: data.status,
          lastUpdated: data.lastUpdated,
          updatedBy: data.updatedBy
        });
      }
    } catch (err) {
      console.error("Error fetching booking status:", err);
      // Set default if API fails
      setBookingStatus({
        status: true,
        lastUpdated: new Date().toISOString(),
        updatedBy: 'system'
      });
    }
  };

  // Toggle booking status
  const toggleBookingStatus = async () => {
    setIsToggling(true);
    try {
      const res = await fetch(`${API_URL}/admin/updatebookstatus`, {
        method: 'PUT',
        credentials: 'include',
      });
      const data = await res.json();
      
      if (data.success) {
        // Update local state with new status
        setBookingStatus({
          status: data.data.isOpen,
          lastUpdated: data.data.lastUpdated,
          updatedBy: data.data.updatedBy || 'admin'
        });
        toast.success(data.message);
      } else {
        toast.error(data.message || "Failed to toggle booking status");
      }
    } catch (err) {
      toast.error("Error toggling booking status");
      console.error("Toggle error:", err);
    } finally {
      setIsToggling(false);
    }
  };

  // Fetch book items
  const getbookItems = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/getbookitems`, {
        credentials: 'include', 
      });
      const data = await res.json();
      
      if (data?.data) {
        setItemlist(data?.data);
      }
    } catch (err) {
      toast.error("Error in fetching book items");
    }   
  };

  const handleItemedit = (item) => {
    setSelectedItem(item);
    setIsitemEdit(true);
    setname(item.name);
    setprice(item.price);
  };

  const cancelItemedit = () => {
    setSelectedItem(null);
    setIsitemEdit(false);
    setname('');
    setprice('');
  };

  const editbookItems = async () => {
    try {
      setisitemuploading(true);
      const res = await fetch(`${API_URL}/admin/editbookitems/${selectedItem?._id}`, {
        credentials: 'include',
        method: 'PUT',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          name,
          price
        })
      });
      const data = await res.json();
     
      if (data?.message) {
        setSelectedItem(null);
        getbookItems();
        setname('');
        setprice('');
        setIsitemEdit(false);
        toast.success(data?.message);
      }
    } catch (err) {
      toast.error("Error in editing book items");
    } finally {
      setisitemuploading(false);
    }
  };

  const createbookItems = async () => {
    try {
      setisitemuploading(true);
      const res = await fetch(`${API_URL}/admin/createbookitems`, {
        credentials: 'include',
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          name,
          price
        })
      });
      const data = await res.json();
     
      if (data?.message) {
        getbookItems();
        setname('');
        setprice('');
        toast.success(data?.message);
      }
    } catch (err) {
      toast.error("Error in creating book items");
    } finally {
      setisitemuploading(false);
    }
  };

  const deletebookItems = async (item) => {
    try {
      const res = await fetch(`${API_URL}/admin/deletebookitems/${item?._id}`, {
        credentials: 'include',
        method: 'DELETE',
      });
      const data = await res.json();
     
      if (data?.message) {
        setSelectedItem(null);
        getbookItems();
        toast.success(data?.message);
      }
    } catch (err) {
      toast.error("Error in deleting book items");
    }
  };

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
    getbookItems();
    getBookingStatus();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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

        {/* Booking Status Toggle Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              {bookingStatus.status ? (
                <ToggleRight className="text-green-600" size={24} />
              ) : (
                <ToggleLeft className="text-red-600" size={24} />
              )}
              <h2 className="text-xl font-semibold text-gray-800">Booking Slots Status</h2>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              bookingStatus.status 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {bookingStatus.status ? 'OPEN' : 'CLOSED'}
            </span>
          </div>
          
          <div className="space-y-4">
            <p className="text-gray-600">
              {bookingStatus.status 
                ? "Booking slots are currently OPEN. Users can book appointments."
                : "Booking slots are currently CLOSED. Users cannot book appointments."}
            </p>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-700">Toggle Booking Status</p>
                <p className="text-sm text-gray-500">
                  Switch to {bookingStatus.status ? 'close' : 'open'} booking slots
                </p>
              </div>
              
              <div className="flex items-center">
                <button
                  onClick={toggleBookingStatus}
                  disabled={isToggling}
                  className="relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Toggle booking status</span>
                  <span className={`inline-block w-11 h-6 rounded-full transition-colors duration-300 ease-in-out ${
                    bookingStatus.status ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <span className={`absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full transition-transform duration-300 ease-in-out transform ${
                    bookingStatus.status ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
                
                <span className="ml-3 text-sm font-medium text-gray-700">
                  {isToggling ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      Updating...
                    </span>
                  ) : bookingStatus.status ? 'Open' : 'Closed'}
                </span>
              </div>
            </div>
            
            <div className="text-sm text-gray-500 border-t pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <p className="font-medium text-gray-600">Last updated:</p>
                  <p>{formatDate(bookingStatus.lastUpdated)}</p>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Rest of the component remains the same */}
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
                  className="text-red-500 hover:text-gray-700 text-sm"
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

        {/* Book Items Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <ShirtIcon className="text-blue-600" size={24} />
                <h2 className="text-xl font-semibold text-gray-800"> 
                  {!isItemedit ? 'Upload Book items' : 'Edit Book items'} 
                </h2>
              </div>
              {isItemedit && (
                <button
                  onClick={cancelItemedit}
                  className="text-red-500 hover:text-gray-700 text-sm"
                >
                  Cancel
                </button>
              )}
            </div>
            <div className="space-y-8">
              <div className='space-y-2'>
                <label className="block text-sm font-medium text-gray-700">
                  Item Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setname(e.target.value)}
                  placeholder="Enter Book item name ex: Shirt , Pant/Jeans"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className='space-y-2'>
                <label className="block text-sm font-medium text-gray-700">
                  Item price
                </label>
                <input
                  type="text"
                  value={price}
                  onChange={(e) => setprice(e.target.value)}
                  placeholder="Enter Book item price ex: 25 or 40"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <button
              onClick={isItemedit ? editbookItems : createbookItems}
              disabled={isItemuploading}
              className={`w-full px-6 py-3 mt-12 ${GRADIENT_CLASS} text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
            >
              {isItemuploading ? 'Processing...' : (isItemedit ? 'Update Book Item' : 'Upload Book Item')}
            </button>
          </div>    
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-6">
              <ShirtIcon className="text-green-600" size={24} />
              <h2 className="text-xl font-semibold text-gray-800">Existing Book Items</h2>
            </div>
            <div className="space-y-4 max-h-[350px] overflow-y-auto">
              {Itemlist.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No Book Items found</p>
              ) : (
                Itemlist.map((item, index) => (
                  <div
                    key={item._id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 truncate">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-600 truncate">
                          ₹{item.price}
                        </p>
                        {index === 0 && (
                          <span className="inline-block mt-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            Primary
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleItemedit(item)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit banner"
                        >
                          <Edit2 size={18} />
                        </button>
                        {index !== 0 && (
                          <button
                            onClick={() => deletebookItems(item)}
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
      </div>
    </div>
  );
};

export default UploadClientAssets;