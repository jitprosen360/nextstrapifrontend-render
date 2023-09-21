import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { API } from "../src/utils/urls"

const UpoloadAvatar = ({
  userId,
  token,
  username,
  avatarUrl,
  setisUserUpdated,
}) => {
  const [modal, setModal] = useState(false);
  const [file, setFile] = useState(null);

  const toggle = () => {
    setModal(!modal);
  };

  const handleFileChange = ({ target: { files } }) => {
    if (files?.length) {
      const { type } = files[0];
      if (type === "image/png" || type === "image/jpeg") {
        setFile(files[0]);
      } else {
        toast.error("Accept only png and jpeg image types are allowed*", {
          hideProgressBar: true,
        });
      }
    }
  };

  const upateUserAvatarId = async (avatarId, avatarUrl) => {
    try {
      await axios.put(
        `${API}/users/${userId}`,
        { avatarId, avatarUrl },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${token}`,
          },
        }
      );
      setisUserUpdated(true);
    } catch (error) {
      console.log({ error });
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.error("File is required*", {
        hideProgressBar: true,
      });
      return;
    }

    try {
      const files = new FormData();
      files.append("files", file);
      files.append("name", `${username} avatar`);

      const {
        data: [{ id, url }],
      } = await axios.post(`${API}/upload`, files, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `bearer ${token}`,
        },
      });
      upateUserAvatarId(id, url);
      setFile(null);
      setModal(false);
    } catch (error) {
      console.log({ error });
    }
  };

  return (
  <div className="text-center">
  <button
    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    onClick={toggle}
  >
    {`${avatarUrl ? "Change" : "Upload"} Picture`}
  </button>

  {modal && (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded shadow-lg">
        <div className="mb-4">
          <h2 className="text-2xl font-bold">
            {`${avatarUrl ? "Change" : "Upload"} Your Avatar`}
          </h2>
        </div>
        <form>
          <div className="mb-4">
            <label htmlFor="exampleFile" className="block font-bold mb-1">
              File
            </label>
            <input
              type="file"
              name="file"
              id="exampleFile"
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="flex justify-end">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
              onClick={handleSubmit}
            >
              Upload
            </button>
            <button
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              onClick={toggle}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )}
</div>
  );
};

export default UpoloadAvatar;
