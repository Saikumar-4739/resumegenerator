import React, { useEffect, useState } from 'react';
import { UserDetails } from '../layouts/types';
import { Box, Typography, Paper } from '@mui/material';
import './styles/template-5.css';

const Template5: React.FC<{ userDetails: UserDetails }> = ({ userDetails }) => {
  const [data, setData] = useState<UserDetails | null>(null);

  useEffect(() => {
    if (userDetails) {
      setData(userDetails);
    }
  }, [userDetails]);

  return (
    <Box className="template5" sx={{ padding: 2 }}>
      {data && (
        <>
          <Typography variant="h4" gutterBottom>
            {data.name}
          </Typography>
          <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
            <Typography variant="h6">Contact Information</Typography>
            <Typography>Email: {data.email}</Typography>
            <Typography>Mobile: {data.mobile}</Typography>
            <Typography>
              Address: {data.address?.street}, {data.address?.city}, {data.address?.state}, {data.address?.country} - {data.address?.zipcode}
            </Typography>
          </Paper>

          <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
            <Typography variant="h6">Experience</Typography>
            {data.experience?.map((rec, index) => (
              <Box key={index} sx={{ marginBottom: 1 }}>
                <Typography>Company: {rec.companyName}</Typography>
                <Typography>Role: {rec.role}</Typography>
                <Typography>Duration: {rec.fromYear} - {rec.toYear}</Typography>
                <Typography>Description: {rec.description}</Typography>
              </Box>
            ))}
          </Paper>

          <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
            <Typography variant="h6">Academics</Typography>
            {data.academic?.map((rec, index) => (
              <Box key={index} sx={{ marginBottom: 1 }}>
                <Typography>Institution: {rec.institutionName}</Typography>
                <Typography>Passing Year: {rec.passingYear}</Typography>
                <Typography>Qualification: {rec.qualification}</Typography>
                <Typography>University: {rec.university}</Typography>
                <Typography>Percentage: {rec.percentage}</Typography>
              </Box>
            ))}
          </Paper>

          <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
            <Typography variant="h6">Skills</Typography>
            {data.skills?.map((rec, index) => (
              <Box key={index} sx={{ marginBottom: 1 }}>
                <Typography>Skill: {rec.skillName}</Typography>
                <Typography>Department: {rec.department}</Typography>
              </Box>
            ))}
          </Paper>

          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6">Personal Details</Typography>
            <Typography>Father's Name: {data.personalDetails?.fatherName}</Typography>
            <Typography>Mother's Name: {data.personalDetails?.motherName}</Typography>
            <Typography>Date of Birth: {data.personalDetails?.dateOfBirth}</Typography>
            <Typography>Marital Status: {data.personalDetails?.maritalStatus}</Typography>
            <Typography>Languages Known: {data.personalDetails?.languagesKnown}</Typography>
          </Paper>
        </>
      )}
    </Box>
  );
};

export default Template5;
