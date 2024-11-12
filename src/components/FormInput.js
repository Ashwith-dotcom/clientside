import React from 'react';



const FormInput = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  required = false,
  pattern,
  title,
  placeholder,
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        pattern={pattern}
        title={title}
        placeholder={placeholder}
        className="w-full p-3 border rounded-lg input-focus-effect"
      />
    </div>
  );
};

export default FormInput;