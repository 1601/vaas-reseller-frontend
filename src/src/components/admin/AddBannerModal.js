import React, { useEffect, useState } from 'react';

export const AddBannerModal = ({ closeModal, handleSubmit, banner }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
  });
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (banner) {
      setFormData({
        title: banner.title,
        description: banner.description,
        image: banner.url,
      });
      setSelectedFile(null); 
    }
  }, [banner]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileType = file.type;
      const fileSize = file.size;
      if ((fileType === 'image/png' || fileType === 'image/jpeg') && fileSize <= 5242880) {
        setSelectedFile(file);
        setFormData({
          ...formData,
          image: file,
        });
        setErrorMessage('');
      } else {
        setErrorMessage('Please upload a PNG or JPEG file that is less than 5MB.');
        setSelectedFile(null);
        setFormData({
          ...formData,
          image: '',
        });
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!errorMessage) {
      handleSubmit(formData);
      closeModal(true);
    }
  };

  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
              <h3 className="text-3xl font-semibold">{banner ? 'Edit Banner' : 'Add Banner'}</h3>
            </div>
            <div className="relative p-6 flex-auto">
              <form onSubmit={handleFormSubmit}>
                <div className="flex items-center justify-left w-full">
                  <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                    style={{ width: '400px', height: '200px' }}
                  >
                    {selectedFile ? (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Selected file:</span> {selectedFile.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {`File type: ${selectedFile.type}, Size: ${selectedFile.size} bytes`}
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                          className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 16"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                          />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG (MAX. 3744 × 5616 px)</p>
                      </div>
                    )}
                    <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} />
                  </label>
                </div>
                {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
                <div className="mt-5">
                  <label htmlFor="title" className="block text-gray-600" style={{ width: '400px' }}>
                    Title:
                    <input
                      id="title"
                      type="text"
                      name="title"
                      className="w-full px-4 py-2 border rounded-md text-gray-700"
                      placeholder="Enter title"
                      value={formData.title}
                      onChange={handleInputChange}
                    />
                  </label>
                </div>
                <div className="mt-2">
                  <label
                    htmlFor="description"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    style={{ width: '400px' }}
                  >
                    Description:
                    <textarea
                      id="description"
                      rows="4"
                      name="description"
                      className="block p-2.5 w-full text-sm text-black opacity-90 rounded-lg border border-gray-300"
                      placeholder="Write banner description here..."
                      value={formData.description}
                      onChange={handleInputChange}
                    />
                  </label>
                </div>
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => closeModal(false)}
                  >
                    Close
                  </button>
                  <button
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="submit"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black" />
    </>
  );
};