import { useState, useEffect, useMemo } from 'react';
import styles from '../admin.module.css';
import { getAuthToken, getAuthUser } from "../../../utils/utilities";

const API_ADMIN_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_ADMIN_URL;
const WEB_BASE_URL = process.env.NEXT_PUBLIC_WEB_BASE_URL;

export default function EditUserForm({ user, onClose, roles: initialRoles, onSuccess }) {
  const [formData, setFormData] = useState({
    user_id: user.user_id,
    user_name: user.user_name,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    phone_number: user.phone_number,
    user_role_id: user.user_role_id,
    password_hash: '',
    profile_picture_url: user.profile_picture_url,
    address_1: user.address_1,
    landmark: user.landmark,
    state: user.state,
    city: user.city,
    pincode: user.pincode,
    file_name: user.file_name || '',
    file_path: user.file_path || '',
  });

  const imageToShow = useMemo(() => {
    return (formData.file_path && formData.file_name && formData.file_path !== '/nullnull' && formData.file_name !== '/nullnull')
      ? `${formData.file_path}${formData.file_name}`
      : '/uploads/media/users/profile/dummy-profile-img.jpg';
  }, [formData.file_path, formData.file_name]);

  useEffect(() => {
  }, [imageToShow]);

  const [fetchedRoles, setFetchedRoles] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  /** Getting the token from the cookies */
  const token = getAuthToken();
  const admindtl = getAuthUser();

  const authUser = JSON.parse(admindtl);
  const authid = authUser.id;

  useEffect(() => {
    if (!initialRoles || initialRoles.length === 0) {
      const fetchRoles = async () => {
        try {
          const res = await fetch(`${API_ADMIN_BASE_URL}/role/roles`);
          const data = await res.json();
          if (data.rcode === 0) {
            window.location.href = "/auth/admin";
          }

          if (res.ok && data.status && Array.isArray(data.data)) {
            setFetchedRoles(data.data);
          } else {
            console.error('Failed to fetch roles:', data);
          }
        } catch (err) {
          console.error('Error fetching roles:', err);
        }
      };

      fetchRoles();
    } else {
      setFetchedRoles(initialRoles);
    }
  }, [initialRoles]);

  useEffect(() => {
    setFormData({
      user_id: user.user_id,
      user_name: user.user_name,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone_number: user.phone_number,
      user_role_id: user.user_role_id,
      password_hash: '',
      profile_picture_url: user.profile_picture_url,
      address_1: user.address_1 || '',
      landmark: user.landmark || '',
      state: user.state || '',
      city: user.city || '',
      pincode: user.pincode || '',
      edit_id: authid,
      file_name: user.file_name || '',
      file_path: user.file_path || '',
    });
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        profile_picture_url: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataObj = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataObj.append(key, formData[key]);
    });

    const profilePictureFile = document.getElementById('profile_picture_file').files[0];
    if (profilePictureFile) {
      formDataObj.append('profile_picture_file', profilePictureFile);
    }

    try {
      const res = await fetch(`${API_ADMIN_BASE_URL}/user/edit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataObj,
      });

      const data = await res.json();
      if (data.rcode === 0) {
        window.location.href = "/auth/admin";
      }

      if (!res.ok || data.status === false) {
        setErrorMessage(data.message || 'Failed to update user');
      } else {
        onSuccess();
        alert('User updated successfully');
      }
    } catch (err) {
      console.error('Error updating user:', err);
      setErrorMessage('An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <div 
      className="modal d-block" 
      style={{ backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)', overflowY: 'auto' }} 
      tabIndex="-1" 
      role="dialog"
      onClick={onClose}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered my-4" role="document" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px' }}>
        <div className="modal-content shadow-lg border-0" style={{ borderRadius: '20px', overflow: 'hidden', animation: 'scaleUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.1) forwards' }}>
          
          {/* Header Gradient */}
          <div style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', padding: '24px 24px', position: 'relative' }}>
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0 text-white fw-bold" style={{ letterSpacing: '0.5px', textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>✏️ Edit User Profile</h5>
              <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={onClose} style={{ opacity: 0.9, padding: '10px' }}></button>
            </div>
          </div>

          <div className="modal-body p-4 p-md-5" style={{ background: '#ffffff' }}>
            <form onSubmit={handleSubmit}>
              
              <h6 className="text-muted fw-bold text-uppercase mb-3" style={{ letterSpacing: '0.5px', fontSize: '0.85rem' }}>Personal Information</h6>
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label text-secondary fw-semibold small mb-1">First Name</label>
                  <input type="text" name="first_name" className="form-control form-control-lg shadow-sm border-light rounded-3 bg-light text-dark fw-medium" value={formData.first_name} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-secondary fw-semibold small mb-1">Last Name</label>
                  <input type="text" name="last_name" className="form-control form-control-lg shadow-sm border-light rounded-3 bg-light text-dark fw-medium" value={formData.last_name} onChange={handleChange} required />
                </div>
                
                <div className="col-md-6">
                  <label className="form-label text-secondary fw-semibold small mb-1">Email Address</label>
                  <input type="email" name="email" className="form-control shadow-sm border-light rounded-3 bg-light text-dark" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-secondary fw-semibold small mb-1">Phone Number</label>
                  <input type="text" name="phone_number" className="form-control shadow-sm border-light rounded-3 bg-light text-dark" value={formData.phone_number} onChange={handleChange} required />
                </div>
              </div>

              <h6 className="text-muted fw-bold text-uppercase mb-3 mt-4 border-top pt-4" style={{ letterSpacing: '0.5px', fontSize: '0.85rem' }}>Security & Role</h6>
              <div className="row g-3 mb-4 align-items-end">
                <div className="col-md-4">
                  <label className="form-label text-secondary fw-semibold small mb-1">Username (Read Only)</label>
                  <input type="text" name="user_name" className="form-control shadow-sm border-light rounded-3 bg-light font-monospace text-muted" value={formData.user_name} disabled />
                </div>
                <div className="col-md-4">
                  <label className="form-label text-secondary fw-semibold small mb-1">Update Password</label>
                  <input type="password" name="password_hash" className="form-control shadow-sm border-light rounded-3 bg-light" placeholder="Leave blank to skip" value={formData.password_hash} onChange={handleChange} />
                </div>
                <div className="col-md-4">
                  <label className="form-label text-secondary fw-semibold small mb-1">User Role</label>
                  <select name="user_role_id" className="form-select shadow-sm border-light rounded-3 bg-light text-dark" value={formData.user_role_id} onChange={handleChange} required>
                    <option value="">Select Role</option>
                    {fetchedRoles.length > 0 ? (
                      fetchedRoles.map((role) => (
                        <option key={role.id} value={role.id}>{role.name}</option>
                      ))
                    ) : (
                      <option disabled>No roles available</option>
                    )}
                  </select>
                </div>
                
                <div className="col-md-8">
                  <label className="form-label text-secondary fw-semibold small mb-1">Profile Picture (Optional update)</label>
                  <input type="file" id="profile_picture_file" name="profile_picture_file" accept="image/*" className="form-control shadow-sm border-light rounded-3 bg-light" onChange={handleFileChange} />
                </div>
                <div className="col-md-4 d-flex align-items-center justify-content-center">
                  {imageToShow && (
                    <img src={WEB_BASE_URL + imageToShow} alt="Profile" className="rounded-circle shadow-sm border" style={{ width: '60px', height: '60px', objectFit: 'cover' }} />
                  )}
                </div>
              </div>

              <h6 className="text-muted fw-bold text-uppercase mb-3 mt-4 border-top pt-4" style={{ letterSpacing: '0.5px', fontSize: '0.85rem' }}>Location Information</h6>
              <div className="row g-3 mb-4">
                <div className="col-md-12">
                  <label className="form-label text-secondary fw-semibold small mb-1">Address Line 1</label>
                  <input type="text" name="address_1" className="form-control shadow-sm border-light rounded-3 bg-light text-dark" value={formData.address_1} onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-secondary fw-semibold small mb-1">Landmark</label>
                  <input type="text" name="landmark" className="form-control shadow-sm border-light rounded-3 bg-light text-dark" value={formData.landmark} onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-secondary fw-semibold small mb-1">City</label>
                  <input type="text" name="city" className="form-control shadow-sm border-light rounded-3 bg-light text-dark" value={formData.city} onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-secondary fw-semibold small mb-1">State</label>
                  <input type="text" name="state" className="form-control shadow-sm border-light rounded-3 bg-light text-dark" value={formData.state} onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-secondary fw-semibold small mb-1">Pincode</label>
                  <input type="number" name="pincode" min="10000" max="999999" className="form-control shadow-sm border-light rounded-3 bg-light text-dark" value={formData.pincode} onChange={handleChange} />
                </div>
              </div>

              {errorMessage && (
                <div className="alert alert-danger d-flex align-items-center gap-2 py-2 px-3 rounded-3" role="alert">
                  <span style={{ fontSize: '1.2rem' }}>⚠️</span>
                  <div style={{ fontSize: '0.9rem' }}>{errorMessage}</div>
                </div>
              )}

              <div className="d-flex justify-content-end gap-2 mt-5 pt-3 border-top">
                <button type="button" className="btn btn-light px-4 py-2 fw-semibold border rounded-3" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary px-4 py-2 fw-bold shadow-sm rounded-3">
                  Update Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    
      <style>{`
        @keyframes scaleUp {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        /* Custom scrollbar for better appearance */
        .modal::-webkit-scrollbar { width: 8px; }
        .modal::-webkit-scrollbar-track { background: transparent; }
        .modal::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.3); border-radius: 4px; }
      `}</style>
    </div>
  );
}
