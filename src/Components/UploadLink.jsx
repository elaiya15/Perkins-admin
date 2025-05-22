import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { URL } from "../App";
import { FailedMessage, SuccessMessage } from "./ToastMessage";

function UploadLink({ setData }) {
  const token = window.localStorage.getItem("token");
  const navigate = useNavigate();
  const [Response, setResponse] = useState({
    status: null,
    message: "",
  });
  const [videoURL, setVideoURL] = useState("");
  const [embedURL, setEmbedURL] = useState("");
  const [videoReady, setVideoReady] = useState(false);

  // Helper function to convert various YouTube URLs to embeddable URLs
  const convertToEmbedURL = (url) => {
    if (url.includes("youtu.be")) {
      // youtu.be link (e.g., https://youtu.be/VIDEO_ID)
      const videoId = url.split("youtu.be/")[1];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes("youtube.com/watch")) {
      // youtube.com/watch?v= link
      const videoId = url.split("v=")[1].split("&")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes("youtube.com/shorts")) {
      // youtube.com/shorts/SHORT_ID link
      const shortId = url.split("shorts/")[1].split("?")[0];
      return `https://www.youtube.com/embed/${shortId}`;
    }
    return null; // If the link is invalid
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const embedLink = convertToEmbedURL(videoURL);
    if (!embedLink) {
      setResponse({
        status: "Failed",
        message: "Invalid YouTube or Shorts link",
      });
      setTimeout(() => {
        setResponse({
          status: null,
          message: "",
        });
      }, 3000);

      return;
    }

    const data = {
      path: embedLink,
    };
    try {
      const close = document.getElementById("link-modal-btn");
      close.click();
      const response = await axios.post(`${URL}/api/gallery/link/add/new`, data, {
        headers: {
          Authorization: token,
        },
      });
      setData(response.data.galleryData);
      setResponse({
        status: "Success",
        message: "Uploaded Successfully.",
      });

      setTimeout(() => {
        setResponse({
          status: null,
          message: "",
        });
        setVideoURL("");
        setEmbedURL("");
        setVideoReady(false);
      }, 3000);
    } catch (error) {
      console.error(error);
      if (error.response.status === 401) {
        setResponse({
          status: "Failed",
          message: error.response.data.message,
        });
        setTimeout(() => {
          window.localStorage.clear();
          navigate("/");
        }, 3000);
      }
      if (error.response.status === 500) {
        setResponse({
          status: "Failed",
          message: error.response.data.message,
        });
        setTimeout(() => {
          setResponse({
            status: null,
            message: "",
          });
        }, 3000);
      }
    }
  };

  return (
    <React.Fragment>
      <div
        id="link-modal"
        data-modal-backdrop="static"
        tabIndex="-1"
        aria-hidden="true"
        className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-40 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
      >
        <div className="relative w-full max-w-2xl max-h-full p-4">
          <form
            onSubmit={handleSubmit}
            className="relative bg-white rounded-lg shadow dark:bg-gray-700"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b rounded-t md:p-5 dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                YouTube or Shorts Link
              </h3>
              <button
                onClick={() => {
                  setVideoURL("");
                  setEmbedURL("");
                  setVideoReady(false);
                }}
                type="button"
                className="inline-flex items-center justify-center w-8 h-8 text-sm text-gray-400 bg-transparent rounded-lg hover:bg-gray-200 hover:text-gray-900 ms-auto dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="link-modal"
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            {/* Modal Body */}
            <div className="w-full p-8 mb-10 space-y-10 md:p-10">
              <div>
                <label
                  htmlFor="youtube_link"
                  className="block mb-2 font-medium text-gray-900 dark:text-white"
                >
                  YouTube or Shorts Link
                </label>
                <input
                  type="url"
                  id="youtube_link"
                  name="youtube_link"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-spangles-500 focus:border-spangles-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  placeholder="Paste YouTube or Shorts link"
                  onChange={(ev) => {
                    setVideoURL(ev.target.value);
                    setEmbedURL(convertToEmbedURL(ev.target.value));
                    setVideoReady(false);
                  }}
                  value={videoURL}
                  required
                />
              </div>
              <div className="flex flex-col items-center w-full">
                {embedURL && !videoReady ? (
                  <button
                    type="button"
                    onClick={() => setVideoReady(true)}
                    className="px-8 py-1 mb-2 text-sm font-medium text-white bg-red-700 rounded-lg focus:outline-none hover:bg-red-800 focus:ring-4 focus:ring-red-300 me-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                  >
                    Play Video
                  </button>
                ) : videoReady && embedURL ? (
                  <iframe
                    src={embedURL}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    className="w-full h-64 rounded-xl"
                  ></iframe>
                ) : videoURL !== "" && !embedURL ? (
                  <div className="font-medium text-red-600">
                    Please provide a valid YouTube or Shorts link
                  </div>
                ) : null}
              </div>
            </div>
            {/* Modal Footer */}
            <div className="flex items-center justify-end p-4 border-t border-gray-200 rounded-b md:p-5 dark:border-gray-600">
              <button
                onClick={() => {
                  setVideoURL("");
                  setEmbedURL("");
                  setVideoReady(false);
                }}
                id="link-modal-btn"
                data-modal-hide="link-modal"
                type="button"
                className="py-2.5 px-5 text-sm font-medium focus:outline-none bg-white rounded-lg text-red-700 focus:z-10 focus:ring-2 focus:ring-red-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              >
                Discard
              </button>
              <button
                type="submit"
                className="text-white ms-3 bg-spangles-700 hover:bg-spangles-800 focus:ring-4 focus:outline-none focus:ring-spangles-300 font-medium rounded-lg text-sm px-10 py-2.5 text-center dark:bg-spangles-600 dark:hover:bg-spangles-700 dark:focus:ring-spangles-800"
              >
                Upload
              </button>
            </div>
          </form>
        </div>
      </div>
      {Response.status !== null ? (
        Response.status === "Success" ? (
          <SuccessMessage Message={Response.message} />
        ) : Response.status === "Failed" ? (
          <FailedMessage Message={Response.message} />
        ) : null
      ) : null}
    </React.Fragment>
  );
}

export default UploadLink;
