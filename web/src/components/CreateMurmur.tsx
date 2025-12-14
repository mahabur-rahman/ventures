import React, { useState } from 'react';
import { murmurService } from '../services/murmur.service';

interface CreateMurmurProps {
  onMurmurCreated: () => void;
}

const CreateMurmur: React.FC<CreateMurmurProps> = ({ onMurmurCreated }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    setError('');

    try {
      await murmurService.createMurmur(content);
      setContent('');
      onMurmurCreated();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create murmur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={3}
          maxLength={280}
          required
        />

        {error && (
          <div className="text-red-500 text-sm mt-2">{error}</div>
        )}

        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-gray-500">
            {content.length}/280
          </span>
          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md disabled:opacity-50"
          >
            {loading ? 'Posting...' : 'Post Murmur'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateMurmur;
