'use client';
import { useState, useEffect, useRef } from 'react';
import styles from '../admin.module.css';
import bcrypt from 'bcryptjs';
import { getAuthToken, getAuthUser } from "../../../utils/utilities";

const API_ADMIN_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_ADMIN_URL;

const initialFormState = {
  first_name: '',
  last_name: '',
  user_name: '',
  email: '',
  phone_number: '',
  password_hash: '',
  user_role: '',
  profile_picture_file: null,
  address_1: '',
  landmark: '',
  state: '',
  city: '',
  pincode: ''
};

export default function AddUserForm({ onSuccess, onClose }) {
  const [form, setForm] = useState(initialFormState);
  const [roles, setRoles] = useState([]);

  /** Getting the token from the cookies */
  const token = getAuthToken();
  const admindtl = getAuthUser();

  const authUser = JSON.parse(admindtl);
  const authid = authUser.id;

  const fetchedOnce = useRef(false); // used to prevent double call

  // Fetch roles on component mount
  useEffect(() => {
    if (fetchedOnce.current) return;
    fetchedOnce.current = true;

    const fetchRoles = async () => {
      try {
        const res = await fetch(`${API_ADMIN_BASE_URL}/role/roles`);
        const data = await res.json();
        /** recode = 0 is used for the token error */
        if(data.rcode == 0){
          window.location.href = "/auth/admin";
        }

        if (res.ok && data.status && Array.isArray(data.data)) {
          setRoles(data.data); //store role array
        } else {
          console.error('Failed to fetch roles:', data);
        }
      } catch (err) {
        console.error('Error fetching roles:', err);
      }
    };

    fetchRoles();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profile_picture_file') {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

const handleSubmit = async (e) => {
    e.preventDefault();

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(form.password_hash, salt);

    const payload = new FormData();
    payload.append('user_name', form.user_name);
    payload.append('first_name', form.first_name);
    payload.append('last_name', form.last_name);
    payload.append('email', form.email);
    payload.append('phone_number', form.phone_number);
    payload.append('password_hash', hashedPassword);
    payload.append('user_role_id', parseInt(form.user_role));
    payload.append('profile_picture_file', form.profile_picture_file); // Add file to FormData
    payload.append('address_1', form.address_1);
    payload.append('landmark', form.landmark);
    payload.append('state', form.state);
    payload.append('city', form.city);
    payload.append('pincode', parseInt(form.pincode));
    payload.append('add_id', authid);
    payload.append('edit_id', 0);

    try {
        const res = await fetch(`${API_ADMIN_BASE_URL}/user/create`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${token}` // No Content-Type here, FormData sets it automatically
            },
            body: payload
        });

        const data = await res.json();
        if (res.ok && data.status === true) {
            // Success message after user is registered
            alert('User registered successfully!');
        } else {
            // Handle failure scenario
            alert(data?.message || 'Failed to register user');
        }

        if (!res.ok || data.status === false) {
            return;
        }

        setForm(initialFormState); // Reset form fields
        if (onSuccess) onSuccess(); // Trigger success callback
        if (onClose) onClose(); // Close modal

    } catch (err) {
        console.error('API Error:', err);
        alert('Server error');
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
          <div style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', padding: '24px 24px', position: 'relative' }}>
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0 text-white fw-bold" style={{ letterSpacing: '0.5px', textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>👤 Add New User</h5>
              <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={onClose} style={{ opacity: 0.9, padding: '10px' }}></button>
            </div>
          </div>

          <div className="modal-body p-4 p-md-5" style={{ background: '#ffffff' }}>
            <form onSubmit={handleSubmit}>
              
              <h6 className="text-muted fw-bold text-uppercase mb-3" style={{ letterSpacing: '0.5px', fontSize: '0.85rem' }}>Personal Information</h6>
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label text-secondary fw-semibold small mb-1">First Name</label>
                  <input type="text" name="first_name" className="form-control form-control-lg shadow-sm border-light rounded-3 bg-light text-dark fw-medium" placeholder="E.g. Rahul" value={form.first_name} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-secondary fw-semibold small mb-1">Last Name</label>
                  <input type="text" name="last_name" className="form-control form-control-lg shadow-sm border-light rounded-3 bg-light text-dark fw-medium" placeholder="E.g. Sharma" value={form.last_name} onChange={handleChange} required />
                </div>
                
                <div className="col-md-6">
                  <label className="form-label text-secondary fw-semibold small mb-1">Email Address</label>
                  <input type="email" name="email" className="form-control shadow-sm border-light rounded-3 bg-light text-dark" placeholder="Email" value={form.email} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-secondary fw-semibold small mb-1">Phone Number</label>
                  <input type="text" name="phone_number" className="form-control shadow-sm border-light rounded-3 bg-light text-dark" placeholder="10 Digit Number" value={form.phone_number} onChange={handleChange} required />
                </div>
              </div>

              <h6 className="text-muted fw-bold text-uppercase mb-3 mt-4 border-top pt-4" style={{ letterSpacing: '0.5px', fontSize: '0.85rem' }}>Security & Role</h6>
              <div className="row g-3 mb-4">
                <div className="col-md-4">
                  <label className="form-label text-secondary fw-semibold small mb-1">Username</label>
                  <input type="text" name="user_name" className="form-control shadow-sm border-light rounded-3 bg-light font-monospace" placeholder="System alias" value={form.user_name} onChange={handleChange} required />
                </div>
                <div className="col-md-4">
                  <label className="form-label text-secondary fw-semibold small mb-1">Password</label>
                  <input type="password" name="password_hash" className="form-control shadow-sm border-light rounded-3 bg-light" placeholder="Secret key" value={form.password_hash} onChange={handleChange} required />
                </div>
                <div className="col-md-4">
                  <label className="form-label text-secondary fw-semibold small mb-1">User Role</label>
                  <select name="user_role" className="form-select shadow-sm border-light rounded-3 bg-light text-dark" value={form.user_role} onChange={handleChange} required>
                    <option value="">-- Assign Role --</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>{role.name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-12 mt-3">
                  <label className="form-label text-secondary fw-semibold small mb-1">Profile Picture Requirement</label>
                  <input type="file" name="profile_picture_file" accept="image/*" className="form-control shadow-sm border-light rounded-3 bg-light" onChange={handleChange} />
                </div>
              </div>

              <h6 className="text-muted fw-bold text-uppercase mb-3 mt-4 border-top pt-4" style={{ letterSpacing: '0.5px', fontSize: '0.85rem' }}>Location Information</h6>
              <div className="row g-3 mb-4">
                <div className="col-md-12">
                  <label className="form-label text-secondary fw-semibold small mb-1">Address Line 1</label>
                  <input type="text" name="address_1" className="form-control shadow-sm border-light rounded-3 bg-light text-dark" placeholder="House/Flat No, Street" value={form.address_1} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-secondary fw-semibold small mb-1">Landmark</label>
                  <input type="text" name="landmark" className="form-control shadow-sm border-light rounded-3 bg-light text-dark" placeholder="Nearby noted location" value={form.landmark} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-secondary fw-semibold small mb-1">City</label>
                  <input type="text" name="city" className="form-control shadow-sm border-light rounded-3 bg-light text-dark" placeholder="E.g. Mumbai" value={form.city} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-secondary fw-semibold small mb-1">State</label>
                  <input type="text" name="state" className="form-control shadow-sm border-light rounded-3 bg-light text-dark" placeholder="E.g. Maharashtra" value={form.state} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-secondary fw-semibold small mb-1">Pincode</label>
                  <input type="number" name="pincode" min="10000" max="999999" className="form-control shadow-sm border-light rounded-3 bg-light text-dark" placeholder="6 Digits" value={form.pincode} onChange={handleChange} required />
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-5 pt-3 border-top">
                <button type="button" className="btn btn-light px-4 py-2 fw-semibold border rounded-3" onClick={onClose}>
                  Cancel Registration
                </button>
                <button type="submit" className="btn btn-success px-4 py-2 fw-bold shadow-sm rounded-3">
                  Register User
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
