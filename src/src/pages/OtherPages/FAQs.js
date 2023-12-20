import React, { useState } from 'react';
import { Box, Typography, Container, Card, CardContent, Collapse, IconButton } from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import faqs from '../../components/agreements/faqData';

const FAQs = () => {
  const [expandedFAQ, setExpandedFAQ] = useState(null);

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
          {faqs.map((section, sectionIndex) => (
            <div key={section.title} style={{ marginBottom: '50px' }}>
              {'  '}
              <Typography variant="h5" style={{ marginBottom: '15px' }}>
                {section.title}
              </Typography>
              {section.items.map((faq, faqIndex) => {
                const uniqueIndex = `${sectionIndex}-${faqIndex}`;
                return (
                  <div
                    key={uniqueIndex}
                    style={{ marginBottom: '10px' }}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleExpandClick(uniqueIndex)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleExpandClick(uniqueIndex);
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
                          <IconButton onClick={() => handleExpandClick(uniqueIndex)} size="small">
                            <ExpandMoreIcon
                              style={{
                                transform: expandedFAQ === uniqueIndex ? 'rotate(180deg)' : 'none',
                                transition: 'transform 0.3s',
                              }}
                            />
                          </IconButton>
                        </div>
                        <Collapse in={expandedFAQ === uniqueIndex} timeout="auto" unmountOnExit>
                          <CardContent style={{ padding: '8px 0px' }}>
                            <Typography paragraph>{faq.answer}</Typography>
                          </CardContent>
                        </Collapse>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          ))}
        </Card>
      </Box>
    </Container>
  );
};

export default FAQs;
