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
        strengths: string;
        skills: string;
        bestAt: string;
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
        notes: person?.notes || '',
        strengths: person?.strengths || '',
        skills: person?.skills || '',
        bestAt: person?.bestAt || ''
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
        <form onSubmit={handleSubmit} className="space-y-10">
            {/* 1. Identity Section */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 px-1">
                    <div className="w-1 h-4 bg-accent rounded-full" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Identity</h3>
                </div>

                <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="label">Full Name</label>
                        <input
                            type="text"
                            placeholder="e.g. Alexander Hamilton"
                            value={formData.fullName}
                            onChange={(e) => handleChange('fullName', e.target.value)}
                            className="w-full bg-transparent border-b border-white/10 py-3 text-2xl font-bold text-white focus:outline-none focus:border-accent transition-colors placeholder-white/5"
                            required
                            autoFocus
                        />
                        {errors.fullName && <p className="text-red-400 text-[10px] font-bold mt-1 uppercase tracking-widest">{errors.fullName}</p>}
                    </div>

                    <Input
                        label="Nick / Preferred Name"
                        placeholder="Alex"
                        value={formData.preferredName}
                        onChange={(e) => handleChange('preferredName', e.target.value)}
                    />
                </div>
            </section>

            {/* 2. Relationship Section */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 px-1">
                    <div className="w-1 h-4 bg-accent rounded-full" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Relationship</h3>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <Select
                        label="Type"
                        options={relationshipOptions}
                        value={formData.relationshipType}
                        onChange={(e) => handleChange('relationshipType', e.target.value)}
                        required
                    />

                    <Select
                        label="Priority"
                        options={importanceOptions}
                        value={String(formData.importance)}
                        onChange={(e) => handleChange('importance', parseInt(e.target.value))}
                        required
                    />
                </div>
            </section>

            {/* 3. Professional Section */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 px-1">
                    <div className="w-1 h-4 bg-accent rounded-full" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Professional</h3>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <Input
                        label="Profession"
                        placeholder="Founder / CEO"
                        value={formData.profession}
                        onChange={(e) => handleChange('profession', e.target.value)}
                    />

                    <Input
                        label="Organization"
                        placeholder="Cenit Labs"
                        value={formData.organization}
                        onChange={(e) => handleChange('organization', e.target.value)}
                    />
                </div>
            </section>

            {/* 4. Intelligence Section */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 px-1">
                    <div className="w-1 h-4 bg-accent rounded-full" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Intelligence</h3>
                </div>

                <div className="space-y-6">
                    <Input
                        label="Strengths"
                        placeholder="Analytical thinking, empathy..."
                        value={formData.strengths}
                        onChange={(e) => handleChange('strengths', e.target.value)}
                    />

                    <Input
                        label="Skills"
                        placeholder="Node.js, UI Design, Negotiation..."
                        value={formData.skills}
                        onChange={(e) => handleChange('skills', e.target.value)}
                    />

                    <Input
                        label="Best At"
                        placeholder="What is their 'superpower'?"
                        value={formData.bestAt}
                        onChange={(e) => handleChange('bestAt', e.target.value)}
                        hint="The one thing they do better than anyone else."
                    />
                </div>
            </section>

            {/* 5. Background Section Toggle */}
            <div className="pt-6 pb-2 text-center">
                <button
                    type="button"
                    onClick={() => setShowOptional(!showOptional)}
                    className="btn-glass px-10 border-white/10 hover:border-accent/50 group"
                >
                    <span className="group-hover:text-white transition-colors">
                        {showOptional ? '− Hide Personal Context' : '+ Add Personal Context'}
                    </span>
                </button>
            </div>

            {showOptional && (
                <section className="space-y-6 animate-slide-up">
                    <div className="grid grid-cols-2 gap-6">
                        <Input
                            label="Hometown"
                            placeholder="London"
                            value={formData.hometown}
                            onChange={(e) => handleChange('hometown', e.target.value)}
                        />

                        <Input
                            label="Current City"
                            placeholder="Dubai"
                            value={formData.currentCity}
                            onChange={(e) => handleChange('currentCity', e.target.value)}
                        />
                    </div>

                    <Input
                        label="How You Met"
                        placeholder="At the 2025 Summit"
                        value={formData.howMet}
                        onChange={(e) => handleChange('howMet', e.target.value)}
                    />

                    <Textarea
                        label="Personal Context"
                        placeholder="Interests, family, mutual friends..."
                        value={formData.notes}
                        onChange={(e) => handleChange('notes', e.target.value)}
                        rows={4}
                    />
                </section>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-4 pt-10">
                <button
                    type="submit"
                    className="btn btn-primary py-5 rounded-2xl shadow-[0_15px_30px_rgba(197,160,89,0.2)]"
                    disabled={isLoading}
                >
                    {isLoading ? 'Processing...' : person ? 'Update Context' : 'Establish Connection'}
                </button>
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="btn-glass self-center border-none opacity-40 hover:opacity-100 hover:text-accent transition-all mt-2"
                >
                    Cancel & Return
                </button>
            </div>
        </form>
    );
}
