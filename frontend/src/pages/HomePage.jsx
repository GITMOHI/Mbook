import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserPostsAsync, selectUser } from '../services/Auth/AuthSlice';
import SinglePost from './SinglePost';

function HomePage() {

  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(fetchUserPostsAsync(user?._id));
  })

  return (
    <div className="text-center py-20">

      {user?.newsFeed?.length}

      {user?.newsFeed?.every((post) => post.content) &&
              user.newsFeed.map((post, i) => (
                <SinglePost key={i} user={user} post={post} />
              ))}
    </div>
  );
}

export default HomePage;
