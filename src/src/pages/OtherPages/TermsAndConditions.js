import React from 'react';
import PageLayout from '../../components/PageLayout';
import termsAndAgreement from '../../components/agreements/termsAndAgreement';

function TermsAndConditions() {
  return (
    <PageLayout>
      <div>
        <h1>Terms and Conditions</h1>
        <div style={{ whiteSpace: 'pre-line' }}>{termsAndAgreement}</div>
      </div>
    </PageLayout>
  );
}

export default TermsAndConditions;
