import axios from "axios";
import React, { useState, useEffect } from "react";
import { IoPersonCircleOutline } from "react-icons/io5";
import UpoloadAvatar from "../../components/Avatar";
import {  useSession } from 'next-auth/react';
import { API , API_URL } from "../utils/urls"


const getProfileData = async (token) => {
  const options = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    
  };
  try {
    const res  = await fetch(`${API}/users/me`, options);
    const data = await res.json();
    console.log(data);
    return data;
    
  } catch (error) {
    console.log({ error });
  }
};


const Profile = () => {
  const { data: session } = useSession();
  const token = session?.jwt;
  const [user, setUser] = useState({});
  const [isUserUpdated, setisUserUpdated] = useState(false);


  useEffect(() => {
    const fetchUser = async () => {
      const token = session?.jwt;
      if (token) {
      
        try {
          const profiledata = await getProfileData(token);
          setUser(profiledata);
          setisUserUpdated(false)
        } catch (error) {
          console.error('Error fetching user orders:', error);
        }
      }
    };

    fetchUser();
  }, [session ,isUserUpdated]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
    <div className="bg-white p-8 rounded shadow-lg">
      <div className="mb-6 text-center">
        <div className="avatar-wrapper mx-auto mb-4">
          {user.avatarUrl ? (
            <img
              src={`${API_URL}${user.avatarUrl}`}
              alt={`${user.username} avatar`}
              className="w-24 h-24 rounded-full object-cover mx-auto"
            />
          ) : (
            <IoPersonCircleOutline className="w-24 h-24 text-gray-400 mx-auto" />
          )}
          <UpoloadAvatar
            token={token}
            userId={user.id}
            username={user.username}
            avatarUrl={user.avatarUrl}
            setisUserUpdated={setisUserUpdated}
          />
        </div>
        {session ? (
          <p className="text-xl font-bold">{user.username}</p>
        ) : (
          <p className="text-xl font-bold text-gray-800">Guest User</p>
        )}
      </div>
      <p className="text-gray-700">
        Account created at: {new Date(user.createdAt).toLocaleDateString()}
      </p>
    </div>
  </div>
  );
};

export default Profile;