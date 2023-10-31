import React, { useEffect, useState } from 'react';
import Circle from 'react-circle';
import { Modal, Box, Typography, Button, Card, CardMedia, CardContent } from '@mui/material';


const DetailsModal = ({ open, handleClose, selectedRow }) => {
    const [percentage, setPercentage] = useState(0)

    useEffect(() => {
        if (selectedRow) {
            setPercentage(selectedRow.rateAverageAmount)
        }
    },)
    const options = {
        size: 150, // Size of the circle
        lineWidth: 15, // Thickness of the circle
        progress: percentage, // Percentage of completion
        bgColor: '#f0f0f0', // Background color
        fgColor: '#7E57C2', // Foreground color (your purple theme color)
    };
    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={{ display: 'flex' }}>
                {selectedRow && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            bgcolor: 'white',
                            boxShadow: 24,
                            p: 3,
                            outline: 'none',
                            minWidth: 400, // Customize the width as needed
                            borderRadius: 4,
                        }}
                    >
                        <Box sx={{ display: 'flex', gap: '10px' }}>
                            <div style={{ width: '200px' }}>
                                <img src={selectedRow.profilePicture} alt='customer profile' width='150' height='auto' />
                                <Typography variant="h6" gutterBottom>
                                    {selectedRow.fullName}
                                </Typography>
                                <Typography variant="h6" gutterBottom>
                                    {selectedRow.address}
                                </Typography>
                                <div style={{ marginTop: '30px' }}>
                                    <Typography variant="body2" gutterBottom>
                                        Average No. of Transactions
                                    </Typography>
                                    <Typography>
                                        {selectedRow.averageOfTransaction}
                                    </Typography>
                                </div>
                            </div>
                            <div className="percentage-display">
                                <Card>
                                    <CardMedia
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',  // Center horizontally
                                            alignItems: 'center',      // Center vertically
                                            height: '200px',          // Set a specific height for CardMedia
                                        }}
                                    >
                                        <Circle
                                            progress={options.progress}
                                            size={options.size}
                                            lineWidth={options.lineWidth}
                                            containerClassName={'circle-container'}
                                            bgColor={options.bgColor}
                                            fgColor={options.fgColor}
                                        />
                                    </CardMedia>
                                    <CardContent>
                                        <Typography gutterBottom variant="subtitle1" component="div">
                                            Average Purchased Amount
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {selectedRow.averageAmount}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </div>
                        </Box>
                        <Box sx={{marginTop:'50px'}}>
                            <Typography> Purchased History </Typography>
                            <div style={{ height: '150px', overflow: 'auto' }}>
                                <table style={{ width: '100%' }}>
                                    <tbody>
                                        {selectedRow.purchase.length > 0 ? selectedRow.purchase.map((data) => (
                                            <tr key={data._id}>
                                                <td style={{ textAlign: 'left', padding: '5px' }}>
                                                    <Typography>{data.item}</Typography>
                                                </td>
                                                <td style={{ textAlign: 'center', padding: '5px' }}>
                                                    <Typography>{data.amount}</Typography>
                                                </td>
                                                <td style={{ textAlign: 'right', padding: '5px' }}>
                                                    {data.item === 'Load' && <Typography>{selectedRow.mobileNumber}</Typography>}
                                                    {data.item === 'Bills Payment' && <Typography>{selectedRow.accountNumber}</Typography>}
                                                    {data.item === 'Egift' && <Typography>{selectedRow.email}</Typography>}
                                                </td>
                                            </tr>
                                        )) : <div 
                                                style={{ 
                                                    display: 'flex', 
                                                    justifyContent: 'center', 
                                                    alignItems: 'center', 
                                                    marginTop: '50px' 
                                                }}
                                            > 
                                                <Typography> No purchase data yet </Typography> 
                                            </div>}
                                    </tbody>
                                </table>
                            </div>


                        </Box>
                        {/* <Typography variant="body1">{selectedRow.description}</Typography> */}
                        <Button variant="outlined" onClick={handleClose} sx={{ mt: 2 }}>
                            Close
                        </Button>
                    </Box>
                )}
            </Box>
        </Modal>
    );
}

export default DetailsModal