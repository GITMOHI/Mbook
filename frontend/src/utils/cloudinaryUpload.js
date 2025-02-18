// import cloudinary from 'cloudinary';

// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: 'dmc0prejr', // Your Cloudinary cloud name
//   api_key: '191597999397877', // Your Cloudinary API key
//   api_secret: '3oENQokNSdMK5VPZIGwIqb7QzvM', // Your Cloudinary API secret
// });



export const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'Chat-app'); // Replace with your upload preset
  
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dmc0prejr/image/upload`, // Your Cloudinary cloud name
        {
          method: 'POST',
          body: formData,
        }
      );
  
      if (!response.ok) {
        throw new Error('Failed to upload image');
      }
  
      const data = await response.json();
      return data.secure_url; // Return the URL of the uploaded image
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };
  