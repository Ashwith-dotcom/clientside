import React from 'react';



const FormSection = ({ title, children }) => {
  return (
    <div className="form-section mb-6">
      {title && <h3 className="text-xl font-semibold text-gray-700 mb-4">{title}</h3>}
      {children}
    </div>
  );
};

export default FormSection;