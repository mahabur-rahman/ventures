import React, { useState, useEffect } from 'react';
import { murmurService, Murmur } from '../services/murmur.service';
import MurmurCard from '../components/MurmurCard';
import CreateMurmur from '../components/CreateMurmur';

const Timeline: React.FC = () => {
  const [murmurs, setMurmurs] = useState<Murmur[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchMurmurs = async (pageNum: number = 1) => {
    setLoading(true);
    setError('');
    try {
      const response = await murmurService.getTimeline(pageNum, 10);
      setMurmurs(response.data);
      setTotalPages(response.totalPages);
      setPage(pageNum);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load timeline');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMurmurs(1);
  }, []);

  const handleMurmurCreated = () => {
    fetchMurmurs(1);
  };

  const handleMurmurDeleted = () => {
    fetchMurmurs(page);
  };

  if (loading && murmurs.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Timeline</h1>

      <CreateMurmur onMurmurCreated={handleMurmurCreated} />

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {murmurs.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No murmurs to display. Start following users or create your first murmur!
        </div>
      ) : (
        <>
          {murmurs.map((murmur) => (
            <MurmurCard
              key={murmur.id}
              murmur={murmur}
              onDelete={handleMurmurDeleted}
              showDelete={true}
            />
          ))}

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <button
                onClick={() => fetchMurmurs(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => fetchMurmurs(page + 1)}
                disabled={page === totalPages}
                className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Timeline;
