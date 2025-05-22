import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { URL } from "../../App";
import axios from "axios";
import { FailedMessage, SuccessMessage } from "../../Components/ToastMessage";

function AddNew() {
  const token = window.localStorage.getItem("token");
  const navigate = useNavigate();
  const [Response, setResponse] = useState({
    status: null,
    message: "",
  });
  const [PasswordVisible, setPasswordVisible] = useState(false);
  const [Data, setData] = useState({
    name: "",
    phone_number: "",
    username: "",
    password: "",
    access_to: [],
  });
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${URL}/api/user/add/new`, Data, {
        headers: {
          Authorization: token,
        },
      });
      setResponse({
        status: "Success",
        message: response.data.message,
      });
      setTimeout(() => {
        navigate("/admin/user-access/list");
      }, 5000);
    } catch (error) {
      console.error(error);
      setResponse({
        status: "Failed",
        message: error.response ? error.response.data.message : error.message,
      });
      if (error.response.status === 401) {
        setTimeout(() => {
          window.localStorage.clear();
          navigate("/");
        }, 5000);
      }
    } finally {
      setTimeout(() => {
        setResponse({
          status: null,
          message: "",
        });
      }, 5000);
    }
  };
  return (
    <React.Fragment>
      <div className="flex flex-col bg-white p-5 space-y-10 rounded-t-lg">
        <h1 className="font-semibold text-lg text-spangles-700">New User</h1>
        <form onSubmit={handleSubmit} className="space-y-36">
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            <div className="w-full">
              <label
                htmlFor="name"
                className="block mb-2 font-medium text-gray-900 dark:text-white"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-spangles-500 focus:border-spangles-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                placeholder=""
                required
                onChange={(ev) => {
                  setData((prev) => {
                    return {
                      ...prev,
                      name: ev.target.value,
                    };
                  });
                }}
                value={Data.name}
              />
            </div>
            <div className="w-full">
              <label
                htmlFor="phone_number"
                className="block mb-2 font-medium text-gray-900 dark:text-white"
              >
                Phone Number
              </label>
              <input
                type="number"
                name="phone_number"
                id="phone_number"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-spangles-500 focus:border-spangles-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                placeholder=""
                required
                min={0}
                onChange={(ev) => {
                  setData((prev) => {
                    return {
                      ...prev,
                      phone_number: ev.target.value,
                    };
                  });
                }}
                value={Data.phone_number}
              />
            </div>
            <div className="w-full">
              <label
                htmlFor="username"
                className="block mb-2 font-medium text-gray-900 dark:text-white"
              >
                Username
              </label>
              <input
                type="text"
                name="username"
                id="username"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-spangles-500 focus:border-spangles-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                placeholder=""
                required
                autoComplete="off"
                onChange={(ev) => {
                  setData((prev) => {
                    return {
                      ...prev,
                      username: ev.target.value,
                    };
                  });
                }}
                value={Data.username}
              />
            </div>
            <div className="w-full relative">
              <label
                htmlFor="password"
                className="block mb-2 font-medium text-gray-900 dark:text-white"
              >
                Set Password
              </label>
              <input
                type={PasswordVisible ? "text" : "password"}
                name="password"
                id="password"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-spangles-500 focus:border-spangles-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                placeholder=""
                autoComplete="off"
                required
                onChange={(ev) => {
                  setData((prev) => {
                    return {
                      ...prev,
                      password: ev.target.value,
                    };
                  });
                }}
                value={Data.password}
              />
              <div className="absolute inset-y-0 top-8 right-0 pr-5 flex items-center text-sm leading-5 hover:cursor-pointer">
                {PasswordVisible ? (
                  <i
                    onClick={() => setPasswordVisible(false)}
                    className="fa-solid fa-eye text-spangles-800"
                  ></i>
                ) : (
                  <i
                    onClick={() => setPasswordVisible(true)}
                    className="fa-solid fa-eye-slash text-spangles-800"
                  ></i>
                )}
              </div>
            </div>
            <div className="sm:col-span-2">
              <div className="flex flex-col space-y-3">
                <h6 className="block font-medium text-gray-900 dark:text-white">
                  Status
                </h6>
                <ul className="w-full inline-flex items-center space-x-20 text-base font-medium text-gray-900 bg-white border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <li className="">
                    <div className="flex items-center">
                      <input
                        id="job_post"
                        type="checkbox"
                        name="job_post"
                        onChange={(ev) => {
                          if (ev.target.checked) {
                            const update = [...Data.access_to];
                            update.splice(0, 0, "Job Post");
                            setData((prev) => {
                              return {
                                ...prev,
                                access_to: update,
                              };
                            });
                          } else {
                            const update = [...Data.access_to];
                            const idx = update.findIndex(
                              (f) => f === "Job Post"
                            );
                            update.splice(idx, 1);
                            setData((prev) => {
                              return {
                                ...prev,
                                access_to: update,
                              };
                            });
                          }
                        }}
                        checked={Data.access_to.includes("Job Post")}
                        className="w-4 h-4 text-spangles-600 bg-gray-100 border-spangles-600 focus:ring-spangles-500 dark:focus:ring-spangles-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                      />
                      <label
                        htmlFor="job_post"
                        className="w-full py-3 ms-2 text-base font-medium text-spangles-600 dark:text-gray-300"
                      >
                        Job Post
                      </label>
                    </div>
                  </li>
                  <li className="">
                    <div className="flex items-center">
                      <input
                        id="blogs"
                        type="checkbox"
                        onChange={(ev) => {
                          if (ev.target.checked) {
                            const update = [...Data.access_to];
                            update.splice(1, 0, "Blogs");
                            setData((prev) => {
                              return {
                                ...prev,
                                access_to: update,
                              };
                            });
                          } else {
                            const update = [...Data.access_to];
                            const idx = update.findIndex((f) => f === "Blogs");
                            update.splice(idx, 1);
                            setData((prev) => {
                              return {
                                ...prev,
                                access_to: update,
                              };
                            });
                          }
                        }}
                        checked={Data.access_to.includes("Blogs")}
                        name="blogs"
                        className="w-4 h-4 text-spangles-600 bg-gray-100 border-spangles-600 focus:ring-spangles-500 dark:focus:ring-spangles-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                      />
                      <label
                        htmlFor="blogs"
                        className="w-full py-3 ms-2 text-base font-medium text-spangles-500 dark:text-gray-300"
                      >
                        Blogs
                      </label>
                    </div>
                  </li>
                  <li className="">
                    <div className="flex items-center">
                      <input
                        id="gallery"
                        type="checkbox"
                        onChange={(ev) => {
                          if (ev.target.checked) {
                            const update = [...Data.access_to];
                            update.splice(2, 0, "Gallery");
                            setData((prev) => {
                              return {
                                ...prev,
                                access_to: update,
                              };
                            });
                          } else {
                            const update = [...Data.access_to];
                            const idx = update.findIndex(
                              (f) => f === "Gallery"
                            );
                            update.splice(idx, 1);
                            setData((prev) => {
                              return {
                                ...prev,
                                access_to: update,
                              };
                            });
                          }
                        }}
                        checked={Data.access_to.includes("Gallery")}
                        name="gallery"
                        className="w-4 h-4 text-spangles-600 bg-gray-100 border-spangles-600 focus:ring-spangles-500 dark:focus:ring-spangles-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                      />
                      <label
                        htmlFor="gallery"
                        className="w-full py-3 ms-2 text-base font-medium text-spangles-600 dark:text-gray-300"
                      >
                        Gallery
                      </label>
                    </div>
                  </li>
                  <li className="">
                    <div className="flex items-center">
                      <input
                        id="applicants"
                        type="checkbox"
                        onChange={(ev) => {
                          if (ev.target.checked) {
                            const update = [...Data.access_to];
                            update.splice(3, 0, "Applicants");
                            setData((prev) => {
                              return {
                                ...prev,
                                access_to: update,
                              };
                            });
                          } else {
                            const update = [...Data.access_to];
                            const idx = update.findIndex(
                              (f) => f === "Applicants"
                            );
                            update.splice(idx, 1);
                            setData((prev) => {
                              return {
                                ...prev,
                                access_to: update,
                              };
                            });
                          }
                        }}
                        checked={Data.access_to.includes("Applicants")}
                        name="applicants"
                        className="w-4 h-4 text-spangles-600 bg-gray-100 border-spangles-600 focus:ring-spangles-500 dark:focus:ring-spangles-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                      />
                      <label
                        htmlFor="applicants"
                        className="w-full py-3 ms-2 text-base font-medium text-spangles-600 dark:text-gray-300"
                      >
                        Applicants
                      </label>
                    </div>
                  </li>
                  <li className="">
                    <div className="flex items-center">
                      <input
                        id="enquiries&messages"
                        type="checkbox"
                        onChange={(ev) => {
                          if (ev.target.checked) {
                            const update = [...Data.access_to];
                            update.splice(4, 0, "Enquiries & Messages");
                            setData((prev) => {
                              return {
                                ...prev,
                                access_to: update,
                              };
                            });
                          } else {
                            const update = [...Data.access_to];
                            const idx = update.findIndex(
                              (f) => f === "Enquiries & Messages"
                            );
                            update.splice(idx, 1);
                            setData((prev) => {
                              return {
                                ...prev,
                                access_to: update,
                              };
                            });
                          }
                        }}
                        checked={Data.access_to.includes(
                          "Enquiries & Messages"
                        )}
                        name="enquiries&messages"
                        className="w-4 h-4 text-spangles-600 bg-gray-100 border-spangles-600 focus:ring-spangles-500 dark:focus:ring-spangles-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                      />
                      <label
                        htmlFor="enquiries&messages"
                        className="w-full py-3 ms-2 text-base font-medium text-spangles-600 dark:text-gray-300"
                      >
                        Enquiries & Messages
                      </label>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="w-full flex items-center justify-end space-x-5">
            <Link
              to="/admin/user-access/list"
              className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-base font-semibold text-center text-red-600 rounded-lg focus:ring-2 hover:text-red-700 focus:ring-red-200"
            >
              Discard
            </Link>
            <button
              disabled={Data && Data.access_to.length === 0}
              type="submit"
              className="inline-flex disabled:bg-spangles-400 items-center px-14 py-2.5 mt-4 sm:mt-6 text-base font-semibold text-center text-white bg-spangles-700 rounded-lg focus:ring-4 hover:bg-spangles-800  focus:ring-spangles-200"
            >
              Set Access
            </button>
          </div>
        </form>
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

export default AddNew;
