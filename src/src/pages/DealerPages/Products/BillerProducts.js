import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SecureLS from 'secure-ls';
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CircularLoading from '../../../components/preLoader';

const ls = new SecureLS({ encodingType: 'aes' });

const categoryNames = {
  loanToggles: 'Loans',
  phoneinternetToggles: 'Phone and Internet',
  insuranceToggles: 'Insurance and Financial Services',
  paymentToggles: 'Payment Gateway',
  consumerToggles: 'Consumer Finance',
  electricityToggles: 'Electricity',
  realestateToggles: 'Real Estate',
  governmentToggles: 'Government',
  healthcareToggles: 'Healthcare',
  cableinternetToggles: 'Cable TV and Internet',
  banksToggles: 'Banks',
  airlinesToggles: 'Airlines',
  waterToggles: 'Water',
  transportationToggles: 'Transportation',
};

const initialBillerToggles = {
  loanToggles: {},
  phoneinternetToggles: {},
  insuranceToggles: {},
  paymentToggles: {},
  consumerToggles: {},
  electricityToggles: {},
  realestateToggles: {},
  governmentToggles: {},
  healthcareToggles: {},
  cableinternetToggles: {},
  banksToggles: {},
  airlinesToggles: {},
  waterToggles: {},
  transportationToggles: {},
};

const excludedCategories = ['topupToggles', '_id', 'userId', '__v'];

const BillerProducts = () => {
  const [billerToggles, setBillerToggles] = useState(initialBillerToggles);
  const [isLoading, setIsLoading] = useState(true);
  const [dealerConfig, setDealerConfig] = useState({});
  const navigate = useNavigate();

  const user = ls.get('user');
  const token = ls.get('token');
  const userId = user ? user._id : null;
  const isReseller = user && user.role === 'reseller';

  const getCategoryName = (categoryKey) => {
    return categoryNames[categoryKey] || categoryKey;
  };

  useEffect(() => {
    if (!userId || !token) {
      navigate('/login');
      return;
    }

    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/v1/api/dealer/${userId}/billertoggles`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (isReseller && response.data.resellerToggles) {
          setBillerToggles(response.data.resellerToggles);
          setDealerConfig(response.data.dealerConfig);
        } else {
          setBillerToggles(response.data);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching biller toggles:', error);
        setIsLoading(false);
      });
  }, [token, userId, navigate, isReseller]);

  const handleToggleChange = (category, name, checked) => {
    setBillerToggles((prevState) => {
      const updatedCategory = {
        ...prevState[category],
        [name]: checked,
      };

      return {
        ...prevState,
        [category]: updatedCategory,
      };
    });

    const updateData = {
      [category]: {
        ...billerToggles[category],
        [name]: checked,
      },
    };

    axios
      .put(`${process.env.REACT_APP_BACKEND_URL}/v1/api/dealer/${userId}/billertoggles`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((error) => console.error('Error updating biller toggle:', error));
  };

  if (isLoading) {
    return <CircularLoading />;
  }

  return (
    <div style={{ marginTop: '20px' }}>
      <Card>
        <Typography variant="h4" style={{ marginBottom: '20px', marginTop: '20px', textAlign: 'center' }}>
          Biller Products
        </Typography>

        {Object.entries(billerToggles)
          .filter(([category]) => !excludedCategories.includes(category))
          .map(([category, billers]) => (
            <Accordion key={category}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`${category}-content`}
                id={`${category}-header`}
              >
                <Typography>{getCategoryName(category)}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TableContainer component={Paper}>
                  <Table aria-label={`${category} biller toggles`}>
                    <TableBody>
                      {Object.entries(billers).map(([name, enabled]) => {
                        const isDisabledByDealer = dealerConfig[category] && dealerConfig[category][name] === false;

                        return (
                          <TableRow key={`${category}-${name}`}>
                            <TableCell>{name}</TableCell>
                            <TableCell align="right">
                              {isDisabledByDealer ? (
                                <Typography variant="body2" color="textSecondary">
                                  Disabled by Dealer
                                </Typography>
                              ) : (
                                <FormControlLabel
                                  control={
                                    <Switch
                                      checked={enabled}
                                      onChange={(e) => handleToggleChange(category, name, e.target.checked)}
                                    />
                                  }
                                  label={enabled ? 'Enabled' : 'Disabled'}
                                />
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </Accordion>
          ))}
      </Card>
    </div>
  );
};

export default BillerProducts;
