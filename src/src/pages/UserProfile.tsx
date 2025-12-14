import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { userService, User } from '../services/user.service';
import { Murmur } from '../services/murmur.service';
import MurmurCard from '../components/MurmurCard';
import { useAuth } from '../context/AuthContext';

const UserProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [murmurs, setMurmurs] = useState<Murmur[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  const isOwnProfile = currentUser?.id === parseInt(id || '0');

  useEffect(() => {
    const fetchUserData = async () => {
      if (!id) return;

      setLoading(true);
      setError('');
      try {
        const userId = parseInt(id);
        const [userData, murmursData] = await Promise.all([
          userService.getUserById(userId),
          userService.getUserMurmurs(userId, 1, 10),
        ]);

        setUser(userData);
        setMurmurs(murmursData.data);
        setTotalPages(murmursData.totalPages);

        if (!isOwnProfile && currentUser) {
          const following = await userService.isFollowing(userId);
          setIsFollowing(following);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id, currentUser, isOwnProfile]);

  const handleFollow = async () => {
    if (!id) return;

    setFollowLoading(true);
    try {
      const userId = parseInt(id);
      if (isFollowing) {
        await userService.unfollowUser(userId);
        setIsFollowing(false);
        setUser((prev) => prev ? { ...prev, followersCount: prev.followersCount - 1 } : null);
      } else {
        await userService.followUser(userId);
        setIsFollowing(true);
        setUser((prev) => prev ? { ...prev, followersCount: prev.followersCount + 1 } : null);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    } finally {
      setFollowLoading(false);
    }
  };

  const fetchMurmurs = async (pageNum: number) => {
    if (!id) return;

    try {
      const userId = parseInt(id);
      const murmursData = await userService.getUserMurmurs(userId, pageNum, 10);
      setMurmurs(murmursData.data);
      setTotalPages(murmursData.totalPages);
      setPage(pageNum);
    } catch (error) {
      console.error('Error fetching murmurs:', error);
    }
  };

  const handleMurmurDeleted = () => {
    fetchMurmurs(page);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || 'User not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold">{user.name || user.username}</h1>
            <p className="text-gray-500">@{user.username}</p>
          </div>

          {!isOwnProfile && currentUser && (
            <button
              onClick={handleFollow}
              disabled={followLoading}
              className={`px-4 py-2 rounded-md font-bold ${
                isFollowing
                  ? 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              } disabled:opacity-50`}
            >
              {followLoading ? 'Loading...' : isFollowing ? 'Unfollow' : 'Follow'}
            </button>
          )}
        </div>

        {user.bio && <p className="text-gray-700 mb-4">{user.bio}</p>}

        <div className="flex gap-6 text-sm">
          <div>
            <span className="font-bold">{user.murmursCount}</span>{' '}
            <span className="text-gray-500">Murmurs</span>
          </div>
          <div>
            <span className="font-bold">{user.followingCount}</span>{' '}
            <span className="text-gray-500">Following</span>
          </div>
          <div>
            <span className="font-bold">{user.followersCount}</span>{' '}
            <span className="text-gray-500">Followers</span>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">{isOwnProfile ? 'My Murmurs' : 'Murmurs'}</h2>

      {murmurs.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No murmurs yet.
        </div>
      ) : (
        <>
          {murmurs.map((murmur) => (
            <MurmurCard
              key={murmur.id}
              murmur={murmur}
              onDelete={handleMurmurDeleted}
              showDelete={isOwnProfile}
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

export default UserProfile;
