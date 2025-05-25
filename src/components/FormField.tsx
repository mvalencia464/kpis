import React from 'react';
import { Info } from 'lucide-react';

interface FormFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  helpText?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  type,
  value,
  onChange,
  placeholder,
  required = false,
  helpText
}) => {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-300">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white placeholder-gray-400"
      />
      {helpText && (
        <div className="flex items-start mt-1">
          <Info className="h-4 w-4 text-gray-400 mr-1 mt-0.5" />
          <span className="text-xs text-gray-400">{helpText}</span>
        </div>
      )}
    </div>
  );
};