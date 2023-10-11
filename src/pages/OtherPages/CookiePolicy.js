import React from 'react';
import PageLayout from '../../components/PageLayout';

function CookiePolicy() {
  return (
    <PageLayout>
      <div>
        <h1>Cookie Policy</h1>
        <p>This is the Cookie Policy for [Your Company Name], accessible from [YourWebsite.com]</p>

        <h2>What Are Cookies</h2>
        <p>As is common practice with almost all professional websites this site uses cookies...</p>

        <h2>How We Use Cookies</h2>
        <p>We use cookies for a variety of reasons detailed below...</p>

        <h2>Disabling Cookies</h2>
        <p>You can prevent the setting of cookies by adjusting the settings on your browser...</p>

        {/* Add more sections as per your requirements */}

        <p>Note: this is a fake "Cookie Policy" text and should be replaced with the actual "Cookie Policy" of your website before going live.</p>
      </div>
    </PageLayout>
  );
}

export default CookiePolicy;
