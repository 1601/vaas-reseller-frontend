import React, { useState, useEffect } from 'react';
import { AddBannerModal } from '../../components/admin/AddBannerModal';
import { allBannersAdmin,submitBanner,bannerStatus } from '../../api/public/banner'

const AdminBanner = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [banners, setBanners] = useState();

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = (data) => {
        setIsModalOpen(data);
    };

    const handleAddBanner = () => {
        openModal()
    }

    const handleActiveDeactive = async (status, idBanner) =>{
        if(!status || !idBanner){
            console.log("Undefined requried data")
        }
        const dataDetails = {status,idBanner}
        const statusResult = await bannerStatus(dataDetails)
        if(statusResult){
            // console.log(statusResult)
        }
    }
    const handleSubmit = async (data) =>{
        const resultBanner = await submitBanner(data)
        if(resultBanner){
            // console.log("Banner Added")
        }
    }

    useEffect(() => {
        const fetchAllBanners = async () => {
            const banners = await allBannersAdmin();
            setBanners(banners.data.body)
        }
        fetchAllBanners()
    }, [])

    return (
        <div className="flex flex-col gap-4 mt-4 max-w-screen-lg mx-auto">
            <p className="font-bold text-xl">Banner Configuration</p>
            <div className='bg-white p-5 rounded-md'>
                <div className='mb-10'>
                    <button
                        className="bg-blue-900 text-white px-2 py-1 rounded hover:bg-blue-700"
                        onClick={handleAddBanner}
                    >Add Banner
                    </button>
                </div>
                <div className="flex justify-start flex-wrap gap-3 overflow-y-auto h-96">
                    {banners && banners.map((data, index) => {
                        return (
                            <div key={index} className="max-w-xs bg-white rounded-md shadow-lg overflow-hidden">
                                <img src={data.url} alt="Placeholder" className="w-full h-48 object-cover" />
                                {data.status === false?<div className='flex justify-center bg-red-300 text-xs text-white rounded-md w-1/5 m-2'>
                                    <p>Inactive</p>
                                </div>:<div className='flex justify-center bg-blue-300 text-xs text-white rounded-md w-1/5 m-2'>
                                    <p>Active</p>
                                </div>}
                                <div className="p-6 pt-2">
                                    <h2 className="text-xl font-semibold text-violet-800 mb-2">{data.title}</h2>
                                    <p className="text-gray-600">Image Description goes here. You can replace this with your content.</p>
                                    <div className="flex gap-2 mt-4">
                                        {data.status === false ? <button 
                                            className="bg-green-800 text-white px-2 py-1 rounded hover:bg-blue-700"
                                            onClick={() =>{handleActiveDeactive(true, data._id)}}
                                        >Activate
                                        </button> :
                                            <button 
                                                className="bg-red-800 text-white px-2 py-1 rounded hover:bg-blue-700"
                                                onClick={() =>{handleActiveDeactive(false, data._id)}}
                                                >Deactivate
                                            </button>}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
            {isModalOpen && (
                <AddBannerModal closeModal={closeModal} handleSubmit={handleSubmit}/>
            )}
        </div>
    );
};

export default AdminBanner;
