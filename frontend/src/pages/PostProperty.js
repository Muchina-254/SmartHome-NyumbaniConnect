import React, { useState } from 'react';
import axios from 'axios';

const PostProperty = () => {
  const [form, setForm] = useState({
    title: '',
    location: '',
    price: '',
    description: ''
  });
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => {
      formData.append(key, val);
    });
    if (image) {
      formData.append('image', image);
    }

    try {
      await axios.post('http://localhost:5000/api/properties', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      alert('Property posted successfully');
    } catch (err) {
      alert('Failed to post');
    }
  };

  return (
    <div style={{ padding: '40px' }}>
      <h2>Post New Property</h2>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '10px', maxWidth: '400px' }}>
        <input name="title" placeholder="Title" onChange={handleChange} required />
        <input name="location" placeholder="Location" onChange={handleChange} required />
        <input name="price" type="number" placeholder="Price" onChange={handleChange} required />
        <textarea name="description" placeholder="Description" onChange={handleChange} required />
        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
        <button type="submit">Post Property</button>
      </form>
    </div>
  );
};

export default PostProperty;

