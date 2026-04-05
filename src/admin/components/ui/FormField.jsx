import React from 'react';

/**
 * Campo de formulario wrapper con label, error, helper
 * Soporta: text, number, email, password, textarea, select, toggle, color
 */
export default function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  helper,
  required,
  disabled,
  options,        // Para select: [{ value, label }]
  rows = 3,       // Para textarea
  min, max, step, // Para number
  className = '',
  children,       // Para componentes custom dentro
}) {
  const id = `field-${name}`;
  const hasError = !!error;

  const baseInput = `w-full rounded-xl border px-4 py-2.5 text-sm font-display text-text-main placeholder:text-text-muted/60 transition-all duration-200 outline-none
    ${hasError 
      ? 'border-error focus:ring-2 focus:ring-error/20' 
      : 'border-border-default focus:border-primary focus:ring-2 focus:ring-primary/20'
    }
    ${disabled ? 'opacity-50 cursor-not-allowed bg-background-soft' : 'bg-white'}`;

  const renderInput = () => {
    if (children) return children;

    if (type === 'textarea') {
      return (
        <textarea
          id={id}
          name={name}
          value={value || ''}
          onChange={e => onChange?.(e.target.value, name)}
          placeholder={placeholder}
          rows={rows}
          disabled={disabled}
          className={`${baseInput} resize-y`}
        />
      );
    }

    if (type === 'select') {
      return (
        <select
          id={id}
          name={name}
          value={value || ''}
          onChange={e => onChange?.(e.target.value, name)}
          disabled={disabled}
          className={baseInput}
        >
          <option value="">{placeholder || 'Seleccionar...'}</option>
          {(options || []).map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      );
    }

    if (type === 'toggle') {
      return (
        <button
          type="button"
          role="switch"
          aria-checked={!!value}
          onClick={() => onChange?.(!value, name)}
          disabled={disabled}
          className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
            value ? 'bg-primary' : 'bg-border-strong'
          }`}
        >
          <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-soft transition-transform duration-200 ${
            value ? 'translate-x-5' : ''
          }`} />
        </button>
      );
    }

    if (type === 'color') {
      return (
        <div className="flex items-center gap-3">
          <input
            type="color"
            id={id}
            name={name}
            value={value || '#000000'}
            onChange={e => onChange?.(e.target.value, name)}
            disabled={disabled}
            className="w-10 h-10 rounded-lg cursor-pointer border border-border-default"
          />
          <input
            type="text"
            value={value || ''}
            onChange={e => onChange?.(e.target.value, name)}
            placeholder="#000000"
            disabled={disabled}
            className={`${baseInput} flex-1`}
          />
        </div>
      );
    }

    return (
      <input
        type={type}
        id={id}
        name={name}
        value={value ?? ''}
        onChange={e => onChange?.(type === 'number' ? e.target.value : e.target.value, name)}
        placeholder={placeholder}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        className={baseInput}
      />
    );
  };

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-text-secondary flex items-center gap-1">
          {label}
          {required && <span className="text-error">*</span>}
        </label>
      )}
      {renderInput()}
      {error && (
        <p className="text-xs text-error flex items-center gap-1 animate-fade-in">
          <span className="material-symbols-outlined text-xs">error</span>
          {error}
        </p>
      )}
      {helper && !error && (
        <p className="text-xs text-text-muted">{helper}</p>
      )}
    </div>
  );
}
