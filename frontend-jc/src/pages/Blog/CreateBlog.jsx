import React, { useState } from 'react';
import axios from '../../api/axios';

const CreateBlog = () => {
  const [title, setTitle] = useState('');
  const [paragraphs, setParagraphs] = useState(['']);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const handleParagraphChange = (index, value) => {
    const updated = [...paragraphs];
    updated[index] = value;
    setParagraphs(updated);
  };

  const addParagraph = () => {
    setParagraphs([...paragraphs, '']);
  };

  const removeParagraph = (index) => {
    setParagraphs(paragraphs.filter((_, i) => i !== index));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', JSON.stringify(paragraphs));
      if (image) formData.append('images', image);

      await axios.post('/blogs', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('Blog created!');
      setTitle('');
      setParagraphs(['']);
      setImage(null);
      setImagePreview('');
    } catch (err) {
      console.error(err);
      alert('Failed to create blog');
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 p-4">
      <h1 className="text-3xl font-bold mb-4">Create Blog</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded p-2 text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Paragraphs</label>
          {paragraphs.map((para, index) => (
            <div key={index} className="mb-2 relative">
              <textarea
                value={para}
                onChange={(e) => handleParagraphChange(index, e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded p-2 text-sm"
                placeholder={`Paragraph ${index + 1}`}
                required
              />
              {paragraphs.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeParagraph(index)}
                  className="absolute top-1 right-1 text-red-500 text-xs hover:underline"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addParagraph}
            className="text-blue-600 text-sm hover:underline mt-1"
          >
            + Add Paragraph
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block"
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-2 border rounded object-cover"
              style={{ width: '100%', maxWidth: '400px', height: '250px' }}
            />
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create Blog
        </button>
      </form>
    </div>
  );
};

export default CreateBlog;
