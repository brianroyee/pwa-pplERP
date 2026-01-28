import { forwardRef } from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ label, error, hint, className = '', id, ...props }, ref) => {
        const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

        return (
            <div className="form-group">
                {label && (
                    <label htmlFor={textareaId} className="label">
                        {label}
                        {props.required && <span className="text-primary-400 ml-1">*</span>}
                    </label>
                )}
                <textarea
                    ref={ref}
                    id={textareaId}
                    className={`input min-h-[100px] resize-y ${error ? 'input-error' : ''} ${className}`}
                    {...props}
                />
                {error && <p className="error-text">{error}</p>}
                {hint && !error && <p className="text-xs text-dark-500 mt-1">{hint}</p>}
            </div>
        );
    }
);

Textarea.displayName = 'Textarea';
