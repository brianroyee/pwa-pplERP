import { useState } from 'react';
import { usePersonStore, useToast } from '../../store';
import { ContactType, CONTACT_TYPE_LABELS } from '../../db/types';
import { Input, Select } from '../common';

interface ContactMethodEditorProps {
    personId: string;
}

const contactTypeOptions = Object.entries(CONTACT_TYPE_LABELS).map(([value, label]) => ({
    value,
    label
}));

export function ContactMethodEditor({ personId }: ContactMethodEditorProps) {
    const { currentContactMethods, addContact, removeContact } = usePersonStore();
    const toast = useToast();
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState<{
        type: ContactType;
        label: string;
        value: string;
        isPrimary: boolean;
    }>({
        type: ContactType.PHONE,
        label: '',
        value: '',
        isPrimary: false
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.value.trim()) return;

        try {
            await addContact({
                personId,
                ...formData
            });
            toast.success('Contact method added');
            setFormData({ type: ContactType.PHONE, label: '', value: '', isPrimary: false });
            setIsAdding(false);
        } catch {
            toast.error('Failed to add contact method');
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-dark-400 uppercase tracking-wider">Contact Methods</h4>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="btn btn-ghost btn-sm text-primary-400"
                >
                    {isAdding ? 'Cancel' : 'Add New'}
                </button>
            </div>

            {isAdding && (
                <form onSubmit={handleSubmit} className="card-glass space-y-3 animate-slide-up">
                    <div className="grid grid-cols-2 gap-3">
                        <Select
                            label="Type"
                            options={contactTypeOptions}
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value as ContactType })}
                        />
                        <Input
                            label="Label (e.g. Work)"
                            value={formData.label}
                            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                        />
                    </div>
                    <Input
                        label="Value"
                        placeholder={formData.type === ContactType.EMAIL ? 'email@example.com' : '+1...'}
                        value={formData.value}
                        onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                        required
                    />
                    <button type="submit" className="btn btn-primary btn-sm w-full">
                        Save Contact
                    </button>
                </form>
            )}

            <div className="space-y-2">
                {currentContactMethods.length === 0 && !isAdding && (
                    <p className="text-sm text-dark-500 italic">No contact methods added yet.</p>
                )}
                {currentContactMethods.map((method) => (
                    <div key={method.id} className="card flex items-center justify-between py-3">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-dark-800 flex items-center justify-center text-primary-400">
                                {method.type === ContactType.PHONE && (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                    </svg>
                                )}
                                {method.type === ContactType.EMAIL && (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                        <polyline points="22,6 12,13 2,6" />
                                    </svg>
                                )}
                                {/* Fallback icon */}
                                {!([ContactType.PHONE, ContactType.EMAIL] as string[]).includes(method.type) && (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="12" y1="16" x2="12" y2="12" />
                                        <line x1="12" y1="8" x2="12.01" y2="8" />
                                    </svg>
                                )}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-dark-100">{method.value}</p>
                                <p className="text-xs text-dark-500">
                                    {CONTACT_TYPE_LABELS[method.type]} {method.label ? `• ${method.label}` : ''}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => removeContact(method.id)}
                            className="btn btn-icon btn-ghost text-error/60 hover:text-error"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                                <polyline points="3,6 5,6 21,6" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
