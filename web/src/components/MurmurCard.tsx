import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { murmurService, Murmur } from '../services/murmur.service';
import { useAuth } from '../context/AuthContext';

interface MurmurCardProps {
  murmur: Murmur;
  onDelete?: () => void;
  showDelete?: boolean;
}

const MurmurCard: React.FC<MurmurCardProps> = ({ murmur, onDelete, showDelete = false }) => {
  const [likesCount, setLikesCount] = useState(murmur.likesCount);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  React.useEffect(() => {
    const checkLiked = async () => {
      if (isAuthenticated) {
        try {
          const liked = await murmurService.hasUserLiked(murmur.id);
          setIsLiked(liked);
        } catch (error) {
          console.error('Error checking like status:', error);
        }
      }
    };
    checkLiked();
  }, [murmur.id, isAuthenticated]);

  const handleLike = async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    try {
      if (isLiked) {
        await murmurService.unlikeMurmur(murmur.id);
        setLikesCount(likesCount - 1);
        setIsLiked(false);
      } else {
        await murmurService.likeMurmur(murmur.id);
        setLikesCount(likesCount + 1);
        setIsLiked(true);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this murmur?')) {
      try {
        await murmurService.deleteMurmur(murmur.id);
        onDelete?.();
      } catch (error) {
        console.error('Error deleting murmur:', error);
      }
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <Link to={`/users/${murmur.user.id}`} className="font-bold hover:underline">
              {murmur.user.name || murmur.user.username}
            </Link>
            <span className="text-gray-500 ml-2">@{murmur.user.username}</span>
            <span className="text-gray-500 ml-2">·</span>
            <span className="text-gray-500 ml-2">
              {new Date(murmur.createdAt).toLocaleDateString()}
            </span>
          </div>

          <Link to={`/murmurs/${murmur.id}`}>
            <p className="text-gray-800 mb-3">{murmur.content}</p>
          </Link>

          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              disabled={loading || !isAuthenticated}
              className={`flex items-center gap-1 ${
                isLiked ? 'text-red-500' : 'text-gray-500'
              } hover:text-red-500 disabled:opacity-50`}
            >
              <span>{isLiked ? '❤️' : '🤍'}</span>
              <span>{likesCount}</span>
            </button>

            {showDelete && user?.id === murmur.user.id && (
              <button
                onClick={handleDelete}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MurmurCard;
