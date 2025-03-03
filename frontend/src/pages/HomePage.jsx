import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNewsFeedAsync, fetchUserPostsAsync, selectNewsFeed, selectUser } from '../services/Auth/AuthSlice';
import SinglePost from './SinglePost';
import EachPost from './EachPost';

function HomePage() {

  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(fetchUserPostsAsync(user?._id));
  },[dispatch,user?._id]);

  useEffect(()=>{
    dispatch(fetchNewsFeedAsync(user?._id))
  },[dispatch,user?._id]);
  
  const newsFeed = useSelector(selectNewsFeed) || [];

  return (
    <div className="text-center py-20">

      {/* {newsFeed?.length} */}

      {newsFeed?.every((post) => post.content) &&
              newsFeed?.map((post, i) => (
                <EachPost key={i} user={user} post={post} />
              ))}
    </div>
  );
}

export default HomePage;
