import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Dialog, DialogContent, Typography } from '@mui/material';
import { AddBannerModal } from '../../components/admin/AddBannerModal';
import { allBannersAdmin, submitBanner, bannerStatus, updateEditBanner } from '../../api/public/banner';
import ApprovalLoadingStates from '../../components/loading/ApprovalLoadingStates';

const AdminBanner = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [banners, setBanners] = useState([]);
  const [bannerToEdit, setBannerToEdit] = useState(null);
  const [isLoadingProcess, setIsLoadingProcess] = useState(false);
  const [loading, setLoading] = useState({ isLoading: false, loadingText: '' });

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = (data) => {
    setIsModalOpen(false);
    if (data) {
      fetchAllBanners();
    }
  };

  const handleAddBanner = () => {
    setBannerToEdit(null);
    openModal();
  };

  const handleEditBanner = (banner) => {
    setBannerToEdit(banner);
    openModal();
  };

  const fetchAllBanners = async () => {
    try {
      const response = await allBannersAdmin();
      if (response && response.data) {
        setBanners(response.data.body);
      } else {
        console.error('Error fetching banners: No data returned');
      }
    } catch (error) {
      console.error('Error fetching banners:', error);
    }
  };

  useEffect(() => {
    fetchAllBanners();
  }, []);

  const handleActiveDeactive = async (status, idBanner) => {
    if (idBanner === undefined || idBanner === null) {
      console.log('Undefined required data');
      return;
    }
    const dataDetails = { status, idBanner };
    try {
      await bannerStatus(dataDetails, setLoading);
      fetchAllBanners();
    } catch (error) {
      console.error('Error updating banner status:', error);
    }
  };

  const handleSubmit = async (data) => {
    setIsLoadingProcess(true);
    try {
      if (bannerToEdit) {
        await updateEditBanner(data, bannerToEdit._id, setLoading);
      } else {
        await submitBanner(data, setLoading);
      }
      fetchAllBanners();
    } catch (error) {
      console.error('Error submitting banner:', error);
    }
    setIsLoadingProcess(false);
  };

  return (
    <>
      <div className="flex flex-col gap-4 mt-4 max-w-screen-lg mx-auto">
        <p className="font-bold text-xl ml-4">Banner Configuration</p>
        <div className="bg-white p-5 rounded-md">
          <div className="mb-10">
            <button className="bg-blue-900 text-white px-2 py-1 rounded hover:bg-blue-700" onClick={handleAddBanner}>
              Add Banner
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto h-96">
            {banners &&
              banners.map((data, index) => {
                return (
                  <div
                    key={index}
                    className="bg-white rounded-md shadow-lg overflow-hidden flex flex-col"
                    style={{ height: '400px' }}
                  >
                    <img src={data.url} alt="Placeholder" className="w-full h-48 object-cover" />
                    <div
                      className={`flex justify-center text-xs text-white rounded-md w-1/5 m-2 ${
                        data.status ? 'bg-blue-300' : 'bg-red-300'
                      }`}
                    >
                      <p>{data.status ? 'Active' : 'Inactive'}</p>
                    </div>
                    <div className="p-6 pt-2 flex-1 flex flex-col">
                      <h2 className="text-xl font-semibold text-violet-800 mb-2">{data.title}</h2>
                      <p className="text-gray-600 flex-grow">{data.description}</p>
                      <div className="flex gap-2 mt-4">
                        {data.status === false ? (
                          <ApprovalLoadingStates
                            isLoading={loading.isLoading && loading.loadingText.includes('Activating')}
                            loadingText={loading.loadingText}
                            onClick={() => handleActiveDeactive(true, data._id)}
                            variant="contained"
                            style={{
                              backgroundColor: 'green',
                              color: 'white',
                              marginRight: '8px',
                            }}
                            sx={{
                              '&:hover': {
                                backgroundColor: 'lightgreen',
                              },
                            }}
                          >
                            Activate
                          </ApprovalLoadingStates>
                        ) : (
                          <ApprovalLoadingStates
                            isLoading={loading.isLoading && loading.loadingText.includes('Deactivating')}
                            loadingText={loading.loadingText}
                            onClick={() => handleActiveDeactive(false, data._id)}
                            variant="contained"
                            style={{
                              backgroundColor: 'red',
                              color: 'white',
                              marginRight: '8px',
                            }}
                            sx={{
                              '&:hover': {
                                backgroundColor: 'lightcoral',
                              },
                            }}
                          >
                            Deactivate
                          </ApprovalLoadingStates>
                        )}
                        <button
                          className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-400"
                          onClick={() => {
                            handleEditBanner(data);
                          }}
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
        {isModalOpen && <AddBannerModal closeModal={closeModal} handleSubmit={handleSubmit} banner={bannerToEdit} />}
      </div>
      <Dialog open={isLoadingProcess} PaperProps={{ style: { pointerEvents: 'none' } }}>
        <DialogContent>
          <Box display="flex" alignItems="center">
            <CircularProgress />
            <Typography variant="body1" sx={{ ml: 2 }}>
              Processing banner...
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminBanner;
