import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Typography, Button, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

const AdminKYCApproval = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const [kycDetails, setKYCDetails] = useState(null);
  const [kycApproved, setKYCApproved] = useState(false);

  useEffect(() => {
    const fetchKYCDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/v1/api/kyc-business/details/${storeId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        if (response.data) {
          setKYCDetails(response.data);
          setKYCApproved(response.data.store.kycApprove);
        } else {
          console.error('KYC details not found');
        }
      } catch (error) {
        console.error('Response:', error.response);
        navigate('/dashboard/admin/kycapproval');
      }
    };

    fetchKYCDetails();
  }, [storeId, navigate]);

  const handleGoBack = () => {
    navigate('/dashboard/admin/kycapproval');
  };

  const handleApprove = async () => {
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/v1/api/kyc/approve/${storeId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setKYCApproved(true);
    } catch (error) {
      console.error('Error approving KYC:', error);
    }
  };

  const handleReject = async () => {
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/v1/api/kyc/reject/${storeId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setKYCApproved(false);
      // You might want to refresh kycDetails or navigate away after rejecting
    } catch (error) {
      console.error('Error rejecting KYC:', error);
    }
  };

  return (
    <div className="flex flex-col mt-4">
      <div className="flex-grow flex flex-col justify-center items-center transition-all duration-500 ease-in-out ml-0">
        {kycDetails ? (
          <div className="mb-4 w-full">
            <Card variant="outlined" style={{ padding: '20px', marginBottom: '20px' }}>
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}
              >
                <Typography variant="h4" gutterBottom>
                  KYC Details
                </Typography>
                <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
                  {!kycApproved && (
                    <>
                      <Button onClick={handleApprove} variant="outlined" color="primary" style={{ marginRight: '5px' }}>
                        Approve
                      </Button>
                      <Button
                        onClick={handleReject}
                        variant="outlined"
                        color="secondary"
                        style={{ marginRight: '5px' }}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  <Button onClick={handleGoBack} variant="outlined" color="primary">
                    Go Back
                  </Button>
                </div>
              </div>
              <div>
                {/* Display KYC details from kycDetails object */}
                <DisplayKYCDetails kycDetails={kycDetails} />
              </div>
            </Card>
          </div>
        ) : (
          <p>Loading KYC details...</p>
        )}
      </div>
    </div>
  );
};

// Extract a separate component to display KYC details
const DisplayKYCDetails = ({ kycDetails }) => {
  return (
    <div>
      <Card style={{ marginBottom: '20px', padding: '15px' }}>
        <Typography variant="h5" style={{ fontWeight: 'bold', marginBottom: '5px' }}>
          Store Name
        </Typography>
        <Typography variant="body1">{kycDetails.store.storeName}</Typography>
      </Card>

      <Card style={{ marginBottom: '20px', padding: '15px' }}>
        <Typography variant="h5" style={{ fontWeight: 'bold', marginBottom: '5px' }}>
          Store Details
        </Typography>

        <Card style={{ marginBottom: '20px', padding: '15px' }}>
          <Typography variant="body2" style={{ marginBottom: '8px' }}>
            Unique Store ID
          </Typography>
          <Typography variant="body1">{kycDetails.store.uniqueIdentifier}</Typography>
        </Card>

        <Card style={{ marginBottom: '20px', padding: '15px' }}>
          <Typography variant="body2" style={{ marginBottom: '8px' }}>
            Business Type
          </Typography>
          <Typography variant="body1">{kycDetails.store.businessType}</Typography>
        </Card>

        <Card style={{ marginBottom: '20px', padding: '15px' }}>
          <Typography variant="body2" style={{ marginBottom: '8px' }}>
            Number of Employee
          </Typography>
          <Typography variant="body1">{kycDetails.store.numberOfEmployee}</Typography>
        </Card>

        <Card style={{ marginBottom: '20px', padding: '15px' }}>
          <Typography variant="body2" style={{ marginBottom: '8px' }}>
            Physical Store
          </Typography>
          <Typography variant="body1">
            {kycDetails.store.physicalStore ? 'Physical Store Present' : 'No Physical Store'}
          </Typography>
        </Card>

        <Card style={{ marginBottom: '20px', padding: '15px' }}>
          <Typography variant="body2" style={{ marginBottom: '8px' }}>
            Customer Service Number
          </Typography>
          <Typography variant="body1">{kycDetails.store.customerServiceNumber}</Typography>
        </Card>
      </Card>

      <Card style={{ marginBottom: '20px', padding: '15px' }}>
        <Typography variant="h5" style={{ fontWeight: 'bold', marginBottom: '5px' }}>
          Store Address
        </Typography>

        {/* Street Address */}
        <Card style={{ marginBottom: '20px', padding: '15px' }}>
          <Typography variant="body2" style={{ marginBottom: '8px' }}>
            Street
          </Typography>
          <Typography variant="body1">{kycDetails.store.streetAddress}</Typography>
        </Card>

        {/* City */}
        <Card style={{ marginBottom: '20px', padding: '15px' }}>
          <Typography variant="body2" style={{ marginBottom: '8px' }}>
            City
          </Typography>
          <Typography variant="body1">{kycDetails.store.cityAddress}</Typography>
        </Card>

        {/* Region */}
        <Card style={{ marginBottom: '20px', padding: '15px' }}>
          <Typography variant="body2" style={{ marginBottom: '8px' }}>
            Region
          </Typography>
          <Typography variant="body1">{kycDetails.store.regionAddress}</Typography>
        </Card>

        {/* Zip Code */}
        <Card style={{ marginBottom: '20px', padding: '15px' }}>
          <Typography variant="body2" style={{ marginBottom: '8px' }}>
            Zip Code
          </Typography>
          <Typography variant="body1">{kycDetails.store.zipCodeAddress}</Typography>
        </Card>
      </Card>

      <Card style={{ marginBottom: '20px', padding: '15px' }}>
        <Typography variant="h5" style={{ fontWeight: 'bold', marginBottom: '5px' }}>
          Store Documents
        </Typography>

        <Card style={{ marginBottom: '20px', padding: '15px' }}>
          <Typography variant="h6">IDs Uploaded</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center" style={{ borderRight: '1px solid #ddd' }}>
                  ID Preview
                </TableCell>
                <TableCell align="center" style={{ width: '400px' }}>
                  View Document
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(kycDetails.store.idUrl) ? (
                kycDetails.store.idUrl.map((url, index) => (
                  <TableRow key={index}>
                    <TableCell
                      align="center"
                      style={{
                        borderRight: '1px solid #ddd',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <img src={url} alt={`ID_${index + 1}`} style={{ maxWidth: '100px', height: 'auto' }} />
                    </TableCell>
                    <TableCell align="center">
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          padding: '8px 12px',
                          border: '1px solid #000',
                          borderRadius: '5px',
                          backgroundColor: '#f0f0f0',
                          textDecoration: 'none',
                          color: 'black',
                        }}
                      >
                        {`ID_${index + 1}`}
                      </a>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell align="center" style={{ borderRight: '1px solid #ddd' }}>
                    <img src={kycDetails.store.idUrl} alt="ID" style={{ maxWidth: '100px', height: 'auto' }} />
                  </TableCell>
                  <TableCell align="center">
                    <a
                      href={kycDetails.store.idUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '8px 12px',
                        border: '1px solid #000',
                        borderRadius: '5px',
                        backgroundColor: '#f0f0f0',
                        textDecoration: 'none',
                        color: 'black',
                      }}
                    >
                      ID_1
                    </a>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>

        <Card style={{ marginBottom: '20px', padding: '15px' }}>
          <Typography variant="h6">Additional Documents</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center" style={{ borderRight: '1px solid #ddd' }}>
                  Document Preview
                </TableCell>
                <TableCell align="center" style={{ width: '400px' }}>
                  View Document
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(kycDetails.store.documentUrl) ? (
                kycDetails.store.documentUrl.map((url, index) => (
                  <TableRow key={index}>
                    <TableCell
                      align="center"
                      style={{
                        borderRight: '1px solid #ddd',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <iframe src={url} style={{ width: '100px', height: '140px' }} title={`Document_${index + 1}`} />
                    </TableCell>
                    <TableCell align="center">
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          padding: '8px 12px',
                          border: '1px solid #000',
                          borderRadius: '5px',
                          backgroundColor: '#f0f0f0',
                          textDecoration: 'none',
                          color: 'black',
                        }}
                      >
                        {`Document_${index + 1}`}
                      </a>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    align="center"
                    style={{
                      borderRight: '1px solid #ddd',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <iframe
                      src={kycDetails.store.documentUrl}
                      style={{ width: '100px', height: '140px' }}
                      title="Document"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <a
                      href={kycDetails.store.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '8px 12px',
                        border: '1px solid #000',
                        borderRadius: '5px',
                        backgroundColor: '#f0f0f0',
                        textDecoration: 'none',
                        color: 'black',
                      }}
                    >
                      Document_1
                    </a>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>

        <Card style={{ marginBottom: '20px', padding: '15px' }}>
          <Typography variant="body2" style={{ marginBottom: '8px' }}>
            Other Store Links
          </Typography>
          <Typography variant="body1">{kycDetails.store.externalLinkAccount}</Typography>
        </Card>
      </Card>
    </div>
  );
};
export default AdminKYCApproval;
