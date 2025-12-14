import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { murmurService, Murmur } from '../services/murmur.service';
import MurmurCard from '../components/MurmurCard';

const MurmurDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [murmur, setMurmur] = useState<Murmur | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMurmur = async () => {
      if (!id) return;

      setLoading(true);
      setError('');
      try {
        const data = await murmurService.getMurmurById(parseInt(id));
        setMurmur(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load murmur');
      } finally {
        setLoading(false);
      }
    };

    fetchMurmur();
  }, [id]);

  const handleDelete = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error || !murmur) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || 'Murmur not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-500 hover:underline"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold mb-6">Murmur Detail</h1>

      <MurmurCard murmur={murmur} onDelete={handleDelete} showDelete={true} />
    </div>
  );
};

export default MurmurDetail;
