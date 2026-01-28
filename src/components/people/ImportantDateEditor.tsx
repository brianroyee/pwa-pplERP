import { useState } from 'react';
import { usePersonStore, useToast } from '../../store';
import { DateType, DATE_TYPE_LABELS } from '../../db/types';
import { Input, Select } from '../common';

interface ImportantDateEditorProps {
    personId: string;
}

const dateTypeOptions = Object.entries(DATE_TYPE_LABELS).map(([value, label]) => ({
    value,
    label
}));

export function ImportantDateEditor({ personId }: ImportantDateEditorProps) {
    const { currentImportantDates, addDate, removeDate } = usePersonStore();
    const toast = useToast();
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState<{
        date: string;
        type: DateType;
        label: string;
        recurring: boolean;
        remindBeforeDays: number;
    }>({
        date: '',
        type: DateType.BIRTHDAY,
        label: '',
        recurring: true,
        remindBeforeDays: 1
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.date) return;

        try {
            await addDate({
                personId,
                ...formData
            });
            toast.success('Important date added');
            setFormData({
                date: '',
                type: DateType.BIRTHDAY,
                label: '',
                recurring: true,
                remindBeforeDays: 1
            });
            setIsAdding(false);
        } catch {
            toast.error('Failed to add date');
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-dark-400 uppercase tracking-wider">Important Dates</h4>
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
                            options={dateTypeOptions}
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value as DateType })}
                        />
                        <Input
                            type="date"
                            label="Date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <Select
                            label="Remind Before"
                            options={[
                                { value: '0', label: 'Same day' },
                                { value: '1', label: '1 day before' },
                                { value: '3', label: '3 days before' },
                                { value: '7', label: '1 week before' },
                            ]}
                            value={String(formData.remindBeforeDays)}
                            onChange={(e) => setFormData({ ...formData, remindBeforeDays: parseInt(e.target.value) })}
                        />
                        <div className="flex items-center gap-2 pt-8">
                            <input
                                type="checkbox"
                                id="recurring"
                                checked={formData.recurring}
                                onChange={(e) => setFormData({ ...formData, recurring: e.target.checked })}
                                className="w-4 h-4 accent-primary-400"
                            />
                            <label htmlFor="recurring" className="text-sm text-dark-200">Yearly recurring</label>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary btn-sm w-full">
                        Save Date
                    </button>
                </form>
            )}

            <div className="space-y-2">
                {currentImportantDates.length === 0 && !isAdding && (
                    <p className="text-sm text-dark-500 italic">No important dates recorded.</p>
                )}
                {currentImportantDates.map((date) => (
                    <div key={date.id} className="card flex items-center justify-between py-3">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-dark-800 flex items-center justify-center text-primary-400">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                    <line x1="16" y1="2" x2="16" y2="6" />
                                    <line x1="8" y1="2" x2="8" y2="6" />
                                    <line x1="3" y1="10" x2="21" y2="10" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-dark-100">
                                    {new Date(date.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                                    {date.recurring && <span className="text-xs text-dark-500 ml-2">Every year</span>}
                                </p>
                                <p className="text-xs text-dark-500">
                                    {DATE_TYPE_LABELS[date.type]} {date.remindBeforeDays > 0 ? `• Reminder ${date.remindBeforeDays}d before` : ''}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => removeDate(date.id)}
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
