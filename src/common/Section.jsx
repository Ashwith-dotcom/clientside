import React from 'react';

export const Section = ({ children, className = '', ...props }) => (
  <section 
    className={`py-16 md:py-24 ${className}`}
    {...props}
  >
    {children}
  </section>
);