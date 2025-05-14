// src/components/InputField.jsx
import React from "react";

const InputField = ({ label, name, value, onChange, type = "text", icon, required = false }) => (
  <div>
    {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}{required && "*"}</label>}
    <div className="relative">
      {icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">{icon}</div>}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md ${icon ? "pl-10" : ""}`}
      />
    </div>
  </div>
);

export default InputField;
