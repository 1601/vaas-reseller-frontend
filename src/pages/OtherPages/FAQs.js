import React, { useState } from 'react';
import { Box, Typography, Container, Card, CardContent, Collapse, IconButton } from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';

const FAQs = () => {
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const faqs = [
    {
      question: 'What do we do here?',
      answer: 'We provide solutions, services, and a community for developers and tech enthusiasts!',
    },
    // ... add more FAQ items here
  ];

  const handleExpandClick = (index) => {
    if (expandedFAQ === index) {
      setExpandedFAQ(null);
    } else {
      setExpandedFAQ(index);
    }
  };

  return (
    <Container>
      <Box mt={4} mb={4}>
        <Card variant="outlined" style={{ padding: '20px', marginBottom: '20px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px',
            }}
          >
            <Typography variant="h4">Frequently Asked Questions</Typography>
          </div>
          {faqs.map((faq, index) => (
            <div
              key={index}
              style={{ marginBottom: '10px' }}
              role="button"
              tabIndex={0}
              onClick={() => handleExpandClick(index)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleExpandClick(index);
                }
              }}
            >
              <Card
                style={{
                  padding: '8px 15px',
                  transition: 'background-color 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f5f5f5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '';
                }}
              >
                <CardContent style={{ padding: '8px 0px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">{faq.question}</Typography>
                    <IconButton onClick={() => handleExpandClick(index)} size="small">
                      <ExpandMoreIcon
                        style={{
                          transform: expandedFAQ === index ? 'rotate(180deg)' : 'none',
                          transition: 'transform 0.3s',
                        }}
                      />
                    </IconButton>
                  </div>
                  <Collapse in={expandedFAQ === index} timeout="auto" unmountOnExit>
                    <CardContent style={{ padding: '8px 0px' }}>
                      <Typography paragraph>{faq.answer}</Typography>
                    </CardContent>
                  </Collapse>
                </CardContent>
              </Card>
            </div>
          ))}
        </Card>
      </Box>
    </Container>
  );
};

export default FAQs;