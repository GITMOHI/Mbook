import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { uploadImageToCloudinary } from "../utils/cloudinaryUpload";
import { editPostAsync } from "../services/Auth/AuthSlice";
import { useDispatch } from "react-redux";

const EditPostModal = ({
  post,
  user,
  editClicked,
  setEditClicked,
  handleSubmit,
  isPostUploading,
  setIsPostUploading
}) => {
  const [editedText, setEditedText] = useState(""); // State for editable text
  const [images, setImages] = useState(post?.content?.images || []);
  const [videos, setVideos] = useState(post?.content?.videos || []);

  // Set initial value when modal opens
  useEffect(() => {
    if (editClicked && post?.content?.texts) {
      setEditedText(post.content.texts);
    }
  }, [editClicked, post]);

  // Handle Text Change
  const handlePostText = (e) => {
    setEditedText(e.target.value);
  };
  const handleDeleteImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };



  // Handle Media Upload
  const handleMediaUpload = async (e) => {
    const files = Array.from(e.target.files); // Convert FileList to Array
    console.log(files); // Log selected files

    setIsPostUploading(true);

    if (files.length > 0) {
      try {
        console.log("Uploading started...");

        // Upload each file to Cloudinary and get URLs
        const uploadedUrls = await Promise.all(
          files.map(async (file) => await uploadImageToCloudinary(file))
        );

        console.log("Uploaded URLs:", uploadedUrls);

        // Separate images and videos based on file type
        const imageUrls = uploadedUrls.filter((url) =>
          url.includes("/image/upload/")
        );
        const videoUrls = uploadedUrls.filter((url) =>
          url.includes("/video/upload/")
        );

        setImages((prev) => [...prev, ...imageUrls]); // Update images state
        setVideos((prev) => [...prev, ...videoUrls]); // Update videos state

        // Dispatch an action if needed (e.g., updating the user's media collection)
        // dispatch(
        //   updateUserMedia({ userId: user._id, images: imageUrls, videos: videoUrls })
        // ).unwrap();

        toast.success("Media uploaded successfully!");
      } catch (error) {
        console.error("Error uploading media:", error);
        toast.error("Failed to upload media!");
      } finally {
        setIsPostUploading(false);
      }
    }
  };
 
  const dispatch = useDispatch();

  const handleEdit = async (e) => {
    e.preventDefault();
  
    const updatedPost = {
      texts: editedText,
      images,
      videos
    };
  
    console.log("Updated Post:", updatedPost);
    
    // Update the local post state
    const postId = post?._id;
    console.log(postId);
    dispatch(editPostAsync({postId,updatedData:updatedPost})).unwrap()
    .then((response)=>{
         if(response.ok){
            toast.success("Post is updated!")
         }
    })
    .catch((err)=>{
        toast.error(`error: ${post._id}`)
    })
  
    // Close modal after saving
    setEditClicked(false);
  };
  



  return (
    <>
      {editClicked && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-blur-sm z-50">
          <div className="bg-white p-4 rounded-lg shadow-xl border-2 border-slate-50 lg:h-[90%] w-[88%] md:w-[500px] py-9">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl text-center w-full font-bold text-gray-800">
                Edit Post
              </h2>
              <button
                onClick={() => setEditClicked(false)}
                className="text-gray-500 hover:text-gray-700 hover:cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* User Info */}
            <div className="flex items-center gap-3 mb-4">
              <img
                src={user?.profilePicture || ""}
                className="w-10 h-10 rounded-full"
                alt="Profile"
              />
              <div>
                <div className="font-semibold">{user?.name}</div>
                <select className="text-sm text-gray-600 bg-transparent px-0 py-1">
                  <option>Public</option>
                </select>
              </div>
            </div>

            {/* Text Area */}
            <textarea
              value={editedText}
              onChange={handlePostText}
              placeholder="What's on your mind?"
              className="w-full p-3 border-none text-lg focus:ring-0 resize-none min-h-[100px]"
            />

            {/* Media Upload Area */}
            <div
              className="mt-4 p-8 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:bg-gray-50"
              onClick={() => document.getElementById("fileUpload").click()}
            >
              <div className="text-gray-600 font-medium mb-1">
                📷 Add photos/videos
              </div>
              <div className="text-gray-400 text-sm">or drag and drop</div>
              <div className="text-gray-400 text-sm mt-2">
                Add photos and videos from your mobile device.
              </div>
            </div>

            {/* Media Previews */}
            {isPostUploading ? (
              <div className="mt-4 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="mt-4 grid grid-cols-3 gap-2 overflow-y-scroll h-20 md:h-36">
                {images.map((img, index) => (
                  <div key={index} className="relative">
                    <img src={img} className="rounded-lg h-32 object-cover" />

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteImage(index)}
                      className="absolute cursor-pointer top-1 right-1 w-8 bg-red-500 text-white rounded-full p-1"
                    >
                        X
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Hidden File Input */}
            <input
              type="file"
              multiple
              onChange={handleMediaUpload}
              className="hidden"
              id="fileUpload"
            />

            {/* Post Button */}
            <button
              disabled={isPostUploading}
              onClick={ handleEdit}
              className="w-full cursor-pointer mt-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default EditPostModal;
