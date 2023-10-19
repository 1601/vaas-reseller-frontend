import React from 'react';
import {
  Button,
  Tabs,
  Tab,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Checkbox,
  IconButton,
  Card,
  CardContent,
  Typography,
  Box,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const StatusLabel = ({ status }) => {
  const colorMap = {
    Active: {
      text: 'green',
      background: '#e8f5e9'
    },
    Disabled: {
      text: 'darkorange',
      background: '#fff8e1'
    },
    Deactivated: {
      text: 'red',
      background: '#ffebee'
    }
  };

  const colors = colorMap[status];

  return (
    <Box
      sx={{
        display: 'inline-block',
        backgroundColor: colors.background,
        borderRadius: '8px',
        padding: '2px 8px',
        color: colors.text
      }}
    >
      {status}
    </Box>
  );
};

const ManageReseller = () => {
  return (
    <div style={{ padding: '20px' }}>
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="20px">
            <Typography variant="h5">My Resellers</Typography>
            <Button variant="contained" style={{ backgroundColor: '#000', color: '#fff' }}>
              + Add Reseller
            </Button>
          </Box>

          <Tabs value={0} indicatorColor="primary" textColor="primary">
            <Tab label="All" />
            <Tab label="Active" />
            <Tab label="Disabled" />
            <Tab label="Deactivated" />
          </Tabs>

          <TextField label="Search Roles" variant="outlined" fullWidth style={{ margin: '20px 0' }} />

          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox />
                </TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Phone Number</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Status</TableCell>
                <TableCell /> {/* Corrected this line */}
              </TableRow>
            </TableHead>
            <TableBody>
              {/* This is just sample data for demonstration */}
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox />
                </TableCell>
                <TableCell>John Doe</TableCell>
                <TableCell>123-456-7890</TableCell>
                <TableCell>Company A</TableCell>
                <TableCell>
                  <StatusLabel status="Active" />
                  <IconButton size="small" style={{ marginLeft: '8px' }}>
                    <EditIcon fontSize="inherit" />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <IconButton size="small">
                    <MoreVertIcon fontSize="inherit" />
                  </IconButton>
                </TableCell>
              </TableRow>
              {/* Repeat similar rows for other resellers */}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageReseller;