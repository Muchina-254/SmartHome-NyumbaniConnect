import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css';

const AddProperty = () => {
  const [form, setForm] = useState({
    title: '',
    location: '',
    price: '',
    description: '',
    image: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) return alert('You must be logged in to post a property.');

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      await axios.post('http://localhost:5000/api/properties', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      alert('Property added successfully');
      setForm({ title: '', location: '', price: '', description: '', image: null });
    } catch (err) {
      alert('Failed to add property');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card glassy">
        <h2>Add New Property</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <input
            type="text"
            name="title"
            placeholder="Property Title"
            value={form.title}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Price (KES)"
            value={form.price}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Description (optional)"
            value={form.description}
            onChange={handleChange}
            rows="4"
          ></textarea>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
          <button type="submit">Submit Property</button>
        </form>
      </div>
    </div>
  );
};

export default AddProperty;
