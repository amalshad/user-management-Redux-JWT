import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import API from "../services/api";
import { loginSuccess } from "../features/authSlice";
import { toast } from "react-toastify";
import Avatar from "../components/Avatar";

function Profile() {
  const { user, token, admin, adminToken } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const activeUser = user || admin;
  const activeToken = token || adminToken;


  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);


  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(activeUser?.name || "");
  const [email, setEmail] = useState(activeUser?.email || "");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (activeUser) {
      setName(activeUser.name);
      setEmail(activeUser.email);
    }
  }, [activeUser]);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!image) {
      const msg = "Please select an image first";
      setError(msg);
      toast.error(msg);
      return;
    }

    const formData = new FormData();
    formData.append("profileImage", image);

    try {
      setIsUploading(true);
      const res = await API.post("/users/upload", formData, {
        headers: {
          Authorization: `Bearer ${activeToken}`,
          // Note: don't set "Content-Type" here. Let the browser/axios set it
          // automatically so it includes the required multipart boundary
          // (e.g. "multipart/form-data; boundary=----WebKitFormBoundary...").
          // Setting it manually strips the boundary and the backend can't
          // parse the file at all.
        },
      });

      dispatch(
        loginSuccess({
          user: {
            ...activeUser,
            profileImage: res.data.profileImage,
          },
          token: activeToken,
        })
      );

      toast.success("Profile image updated successfully");
      setImage(null);
      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      const msg = error?.response?.data?.message || "Upload failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageChange = (e) => {
    setError("");
    const file = e.target.files[0];

    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    } else {
      setImage(null);
      setPreview(null);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const { data } = await API.put(
        "/users/profile",
        { name, email },
        {
          headers: {
            Authorization: `Bearer ${activeToken}`,
          },
        }
      );

      dispatch(
        loginSuccess({
          user: data.user,
          token: activeToken,
        })
      );
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      if (error.response?.data?.errors) {
        const errs = error.response.data.errors;
        const msg = errs.name || errs.email || "Invalid input";
        toast.error(msg);
      } else {
        toast.error(error.response?.data?.message || "Failed to update profile");
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (!activeUser) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-lime-sprout font-sans pt-16 pb-12">
      <div className="bg-white/70 shadow-lg shadow-gray-900/10 rounded-2xl p-10 w-full max-w-md border border-lime-200">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-fresh-canopy tracking-tight">
            Your Profile
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Manage your account settings
          </p>
        </div>

        <div className="flex flex-col items-center mb-8">
          <div className="relative group">
            <div className="p-1 bg-white rounded-full shadow-sm border border-gray-200">
              {preview ? (
                <img
                  src={preview}
                  alt="profile preview"
                  className="w-32 h-32 rounded-full object-cover border border-gray-200 shadow-sm"
                />
              ) : (
                <Avatar user={activeUser} sizeClass="w-32 h-32" textClass="text-5xl" />
              )}
            </div>
          </div>
        </div>


        {isEditing ? (
          <form onSubmit={handleSaveProfile} className="mb-8 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-2.5 bg-white text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-fresh-canopy/25 focus:border-fresh-canopy transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-2.5 bg-white text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-fresh-canopy/25 focus:border-fresh-canopy transition-colors"
                required
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setName(activeUser.name);
                  setEmail(activeUser.email);
                }}
                className="flex-1 py-2.5 rounded-full font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 bg-fresh-canopy text-white py-2.5 rounded-full font-semibold hover:brightness-110 transition-all shadow-sm"
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        ) : (
          <div className="mb-8">
            <div className="bg-white rounded-xl p-5 border border-gray-200 mb-4 shadow-sm">
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                  <span className="text-gray-500 text-sm font-medium">Full Name</span>
                  <span className="text-gray-900 font-semibold">{activeUser.name}</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-gray-500 text-sm font-medium">Email</span>
                  <span className="text-gray-900 font-semibold truncate ml-4">{activeUser.email}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="w-full bg-fresh-canopy border-gray-300 text-white py-2.5 rounded-full font-semibold hover:brightness-110 transition-all shadow-sm"
            >
              Edit Profile Details
            </button>
          </div>
        )}


        <form onSubmit={handleUpload} className="space-y-5 border-t border-gray-200 pt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Update Profile Picture
            </label>
            <div className="relative">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/jpeg,image/png,image/gif,image/webp"
                className={`block w-full text-sm text-gray-700
                  file:mr-4 file:py-2.5 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-gray-100 file:text-gray-700
                  hover:file:bg-gray-200 transition-colors
                  border border-gray-300 rounded-xl p-1.5 bg-white
                  focus:outline-none focus:ring-2 focus:ring-fresh-canopy/25
                  ${error ? "border-red-500 focus:ring-red-500 bg-red-50" : ""}
                `}
              />
            </div>
            {error && (
              <p className="text-red-500 text-xs mt-2 pl-1 font-medium">{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!image || isUploading}
            className={`w-full py-3 rounded-full font-semibold transition-all shadow-sm
              ${
                !image || isUploading
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-fresh-canopy text-white hover:brightness-110"
              }
            `}
          >
            {isUploading ? "Uploading..." : "Save Picture"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;