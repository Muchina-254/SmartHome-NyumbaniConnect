import React from 'react';

const Footer = () => {
  return (
    <footer style={{ padding: '20px', textAlign: 'center', backgroundColor: '#f2f2f2' }}>
      <p>&copy; {new Date().getFullYear()} NyumbaniConnect. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
