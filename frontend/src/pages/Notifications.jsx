import { useSelector, useDispatch } from 'react-redux';

import { useNavigate } from 'react-router-dom';
import { markAsRead } from '../services/Notification/NotificationSlice';

const Notifications = () => {
  const notifications = useSelector((state) => state.notifications) || [];
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = (notification) => {
    dispatch(markAsRead(notification.id));

    // Redirect based on notification type
    switch (notification.type) {
      case 'post':
        navigate(`/post/${notification.targetId}`);
        break;
      case 'friendRequest':
        navigate(`/friend-requests`);
        break;
      case 'requestAccepted':
        navigate(`/profile/${notification.targetId}`);
        break;
      default:
        break;
    }
  };

  return (
    <div className="absolute right-4 top-16 w-80 bg-white shadow-lg rounded-2xl p-4">
      <h3 className="text-lg font-semibold mb-2">Notifications</h3>
      {notifications?.length === 0 ? (
        <p className="text-sm text-gray-500">No new notifications</p>
      ) : (
        notifications?.map((note) => (
          <div
            key={note.id}
            onClick={() => handleClick(note)}
            className={`p-2 rounded-lg cursor-pointer ${
              note.read ? 'bg-gray-100' : 'bg-blue-100'
            } hover:bg-blue-200 transition`}
          >
            <p>{note.message}</p>
            <span className="text-xs text-gray-400">
              {new Date(note.timestamp).toLocaleTimeString()}
            </span>
          </div>
        ))
      )}
    </div>
  );
};

export default Notifications;
