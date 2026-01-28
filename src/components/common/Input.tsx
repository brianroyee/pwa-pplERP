import { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, hint, className = '', id, ...props }, ref) => {
        const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

        return (
            <div className="form-group">
                {label && (
                    <label htmlFor={inputId} className="label">
                        {label}
                        {props.required && <span className="text-primary-400 ml-1">*</span>}
                    </label>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    className={`input ${error ? 'input-error' : ''} ${className}`}
                    {...props}
                />
                {error && <p className="error-text">{error}</p>}
                {hint && !error && <p className="text-xs text-dark-500 mt-1">{hint}</p>}
            </div>
        );
    }
);

Input.displayName = 'Input';
