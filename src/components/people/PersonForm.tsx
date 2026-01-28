import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Select, Textarea } from '../common';
import { usePersonStore, useToast } from '../../store';
import { RelationshipType, RELATIONSHIP_TYPE_LABELS } from '../../db/types';
import type { Person } from '../../db/types';

interface PersonFormProps {
    person?: Person;
    onSuccess?: (id: string) => void;
}

const relationshipOptions = Object.entries(RELATIONSHIP_TYPE_LABELS).map(([value, label]) => ({
    value,
    label
}));

const importanceOptions = [
    { value: '1', label: '1 - Low' },
    { value: '2', label: '2 - Below Average' },
    { value: '3', label: '3 - Average' },
    { value: '4', label: '4 - High' },
    { value: '5', label: '5 - Critical' }
];

export function PersonForm({ person, onSuccess }: PersonFormProps) {
    const navigate = useNavigate();
    const { addPerson, editPerson, isLoading } = usePersonStore();
    const toast = useToast();

    const [formData, setFormData] = useState<{
        fullName: string;
        preferredName: string;
        relationshipType: RelationshipType;
        importance: number;
        profession: string;
        organization: string;
        hometown: string;
        currentCity: string;
        howMet: string;
        firstMetDate: string;
        notes: string;
    }>({
        fullName: person?.fullName || '',
        preferredName: person?.preferredName || '',
        relationshipType: person?.relationshipType || RelationshipType.OTHER,
        importance: person?.importance || 3,
        profession: person?.profession || '',
        organization: person?.organization || '',
        hometown: person?.hometown || '',
        currentCity: person?.currentCity || '',
        howMet: person?.howMet || '',
        firstMetDate: person?.firstMetDate || '',
        notes: person?.notes || ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showOptional, setShowOptional] = useState(false);

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            if (person) {
                await editPerson(person.id, formData);
                toast.success('Person updated successfully');
                navigate(`/people/${person.id}`);
            } else {
                const id = await addPerson(formData);
                toast.success('Person added successfully');
                if (onSuccess) {
                    onSuccess(id);
                } else {
                    navigate(`/people/${id}`);
                }
            }
        } catch {
            toast.error('Failed to save person');
        }
    };

    const handleChange = (field: string, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Required Fields */}
            <div className="space-y-4">
                <Input
                    label="Full Name"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                    error={errors.fullName}
                    required
                    autoFocus
                />

                <Input
                    label="Preferred Name"
                    placeholder="Johnny (optional)"
                    value={formData.preferredName}
                    onChange={(e) => handleChange('preferredName', e.target.value)}
                    hint="How they like to be called"
                />

                <div className="grid grid-cols-2 gap-4">
                    <Select
                        label="Relationship"
                        options={relationshipOptions}
                        value={formData.relationshipType}
                        onChange={(e) => handleChange('relationshipType', e.target.value)}
                        required
                    />

                    <Select
                        label="Importance"
                        options={importanceOptions}
                        value={String(formData.importance)}
                        onChange={(e) => handleChange('importance', parseInt(e.target.value))}
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Profession"
                        placeholder="Software Engineer"
                        value={formData.profession}
                        onChange={(e) => handleChange('profession', e.target.value)}
                    />

                    <Input
                        label="Organization"
                        placeholder="Acme Inc."
                        value={formData.organization}
                        onChange={(e) => handleChange('organization', e.target.value)}
                    />
                </div>
            </div>

            {/* Optional Fields Toggle */}
            <button
                type="button"
                onClick={() => setShowOptional(!showOptional)}
                className="flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300 transition-colors"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={`w-4 h-4 transition-transform ${showOptional ? 'rotate-180' : ''}`}
                >
                    <polyline points="6,9 12,15 18,9" />
                </svg>
                {showOptional ? 'Hide' : 'Show'} additional details
            </button>

            {/* Optional Fields */}
            {showOptional && (
                <div className="space-y-4 animate-slide-up">
                    <div className="divider" />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Hometown"
                            placeholder="New York"
                            value={formData.hometown}
                            onChange={(e) => handleChange('hometown', e.target.value)}
                        />

                        <Input
                            label="Current City"
                            placeholder="San Francisco"
                            value={formData.currentCity}
                            onChange={(e) => handleChange('currentCity', e.target.value)}
                        />
                    </div>

                    <Input
                        label="How You Met"
                        placeholder="Met at a conference"
                        value={formData.howMet}
                        onChange={(e) => handleChange('howMet', e.target.value)}
                    />

                    <Input
                        type="date"
                        label="First Met Date"
                        value={formData.firstMetDate}
                        onChange={(e) => handleChange('firstMetDate', e.target.value)}
                    />

                    <Textarea
                        label="Notes"
                        placeholder="Any additional notes about this person..."
                        value={formData.notes}
                        onChange={(e) => handleChange('notes', e.target.value)}
                        rows={4}
                    />
                </div>
            )}

            {/* Submit buttons */}
            <div className="flex gap-3 pt-4">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="btn btn-secondary flex-1"
                    disabled={isLoading}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="btn btn-primary flex-1"
                    disabled={isLoading}
                >
                    {isLoading ? 'Saving...' : person ? 'Update Person' : 'Add Person'}
                </button>
            </div>
        </form>
    );
}
