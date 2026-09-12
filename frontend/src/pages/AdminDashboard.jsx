import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import API from "../services/api";
import { toast } from "react-toastify";
import Avatar from "../components/Avatar";

function AdminDashboard() {
  const { adminToken } = useSelector((state) => state.auth);

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);


  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);


  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await API.get(`/users?search=${search}&page=${page}&limit=5`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      setUsers(res.data.users);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    fetchUsers();
  }, [search, page]);

  const handleDelete = (id) => {
    setUserToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await API.delete(`/users/${userToDelete}`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      toast.success("User deleted successfully");
      fetchUsers();
      setShowDeleteConfirm(false);
      setUserToDelete(null);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  };

  const openCreateModal = () => {
    setName("");
    setEmail("");
    setPassword("");
    setShowPassword(false);
    setRole("user");
    setErrors({});
    setShowCreateModal(true);
  };

  const handleCreate = async () => {
    try {
      setIsSaving(true);
      await API.post(
        "/users",
        { name, email, password, role },
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      toast.success("User created successfully");
      fetchUsers();
      setShowCreateModal(false);
    } catch (error) {
      console.log(error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
        toast.error(error.response.data.message || "Please fill the required fields");
      } else {
        toast.error(error.response?.data?.message || "Failed to create user");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setErrors({});
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    try {
      setIsSaving(true);
      await API.put(
        `/users/${selectedUser._id}`,
        { name, email, role },
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      toast.success("User updated successfully");
      fetchUsers();
      setShowEditModal(false);
    } catch (error) {
      console.log(error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
        toast.error(error.response.data.message || "Please fill the required fields");
      } else {
        toast.error(error.response?.data?.message || "Failed to update user");
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Shared input styling for the dark admin theme: recessed silver field,
  // luminous-moss focus ring, softened red for validation errors.
  const fieldClass = (hasError) =>
    `w-full border rounded-xl p-3 bg-silver text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 transition-colors ${
      hasError ? "border-red-500/60 focus:ring-red-500/20" : "border-white/10 focus:ring-luminous-moss/30 focus:border-luminous-moss"
    }`;

  return (
    <div className="min-h-screen bg-silver font-sans pt-20 p-6">
      <div className="max-w-6xl mx-auto bg-silver-surface border border-white/10 rounded-2xl p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Admin Dashboard
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Manage users and accounts across the platform.
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="bg-luminous-moss text-silver px-5 py-2.5 rounded-full font-semibold hover:brightness-90 transition-all shadow-sm flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Create User
          </button>
        </div>


        <div className="relative mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-96 border border-white/10 pl-10 pr-4 py-2.5 rounded-xl bg-silver text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-luminous-moss/30 focus:border-luminous-moss transition-colors"
          />
        </div>


        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="min-w-full divide-y divide-white/10">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                    No users found matching your search.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Avatar user={user} sizeClass="h-10 w-10" dark />
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-white">{user.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full uppercase tracking-wide border ${
                        user.role === "admin" ? "bg-luminous-moss/15 text-luminous-moss border-luminous-moss/25" : "bg-white/5 text-gray-300 border-white/10"
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                      <button
                        onClick={() => openEditModal(user)}
                        className="text-luminous-moss hover:brightness-90 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                        disabled={user.role === "admin"}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>


        <div className="flex justify-between items-center mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
            className="bg-white/5 border border-white/10 text-gray-300 px-5 py-2 rounded-full hover:bg-white/10 disabled:opacity-40 transition font-semibold text-sm"
          >
            Previous
          </button>
          <span className="text-gray-400 font-medium text-sm">
            Page {page} of {totalPages || 1}
          </span>
          <button
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage((prev) => prev + 1)}
            className="bg-white/5 border border-white/10 text-gray-300 px-5 py-2 rounded-full hover:bg-white/10 disabled:opacity-40 transition font-semibold text-sm"
          >
            Next
          </button>
        </div>
      </div>


      {showCreateModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 p-4">
          <div className="bg-silver-surface p-8 rounded-2xl w-full max-w-md border border-white/10">
            <h2 className="text-2xl font-bold mb-6 text-white tracking-tight">Create User</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                  }}
                  className={fieldClass(errors.name)}
                  placeholder="Enter full name"
                />
                {errors.name && <p className="text-red-400 text-xs mt-1.5 pl-1 font-medium">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                  }}
                  className={fieldClass(errors.email)}
                  placeholder="you@example.com"
                />
                {errors.email && <p className="text-red-400 text-xs mt-1.5 pl-1 font-medium">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
                    }}
                    className={`${fieldClass(errors.password)} pr-10`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 focus:outline-none"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && <p className="text-red-400 text-xs mt-1.5 pl-1 font-medium">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full border border-white/10 rounded-xl p-3 bg-silver text-white focus:outline-none focus:ring-2 focus:ring-luminous-moss/30 focus:border-luminous-moss transition-colors appearance-none"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-8">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setErrors({});
                }}
                className="px-5 py-2.5 rounded-full font-semibold text-gray-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={isSaving}
                className="bg-luminous-moss text-silver px-5 py-2.5 rounded-full font-semibold hover:brightness-90 transition-all shadow-sm disabled:opacity-50"
              >
                {isSaving ? "Creating..." : "Create User"}
              </button>
            </div>
          </div>
        </div>
      )}


      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 p-4">
          <div className="bg-silver-surface p-8 rounded-2xl w-full max-w-md border border-white/10">
            <h2 className="text-2xl font-bold mb-6 text-white tracking-tight">Edit User</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                  }}
                  className={fieldClass(errors.name)}
                  placeholder="Enter full name"
                />
                {errors.name && <p className="text-red-400 text-xs mt-1.5 pl-1 font-medium">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                  }}
                  className={fieldClass(errors.email)}
                  placeholder="you@example.com"
                />
                {errors.email && <p className="text-red-400 text-xs mt-1.5 pl-1 font-medium">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full border border-white/10 rounded-xl p-3 bg-silver text-white focus:outline-none focus:ring-2 focus:ring-luminous-moss/30 focus:border-luminous-moss transition-colors appearance-none"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-8">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setErrors({});
                }}
                className="px-5 py-2.5 rounded-full font-semibold text-gray-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={isSaving}
                className="bg-luminous-moss text-silver px-5 py-2.5 rounded-full font-semibold hover:brightness-90 transition-all shadow-sm disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}


      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 p-4">
          <div className="bg-silver-surface p-8 rounded-2xl w-full max-w-sm border border-white/10 text-center">
            <div className="w-16 h-16 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-white tracking-tight">Are you sure?</h2>
            <p className="mb-8 text-gray-400 text-sm leading-relaxed">
              This action cannot be undone. This will permanently delete the user account.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setUserToDelete(null);
                }}
                className="flex-1 px-5 py-2.5 rounded-full font-semibold text-gray-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-500 text-white px-5 py-2.5 rounded-full font-semibold hover:bg-red-600 transition-all shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
