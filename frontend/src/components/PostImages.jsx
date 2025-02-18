import { useState } from "react";

const PostImages = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <>
      {/* Display images as thumbnails */}
      <div className="grid grid-cols-2 gap-2 mt-2">
        {images?.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Post Image ${index + 1}`}
            className="rounded-lg cursor-pointer"
            onClick={() => setSelectedImage(image)}
          />
        ))}
      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50"
          onClick={() => setSelectedImage(null)}
        >
          <img src={selectedImage} alt="Preview" className="max-w-full max-h-screen rounded-lg" />
        </div>
      )}
    </>
  );
};

export default PostImages;
