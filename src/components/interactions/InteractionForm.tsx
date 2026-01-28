import { useState } from 'react';
import { usePersonStore, useToast } from '../../store';
import { InteractionType, INTERACTION_TYPE_LABELS, OutcomeType, OUTCOME_TYPE_LABELS } from '../../db/types';
import { Select, Textarea } from '../common';
import { addInteraction } from '../../db';

interface InteractionFormProps {
    personId: string;
    onSuccess?: () => void;
}

const interactionOptions = Object.entries(INTERACTION_TYPE_LABELS).map(([value, label]) => ({
    value,
    label
}));

const outcomeOptions = Object.entries(OUTCOME_TYPE_LABELS).map(([value, label]) => ({
    value,
    label
}));

export function InteractionForm({ personId, onSuccess }: InteractionFormProps) {
    const { loadPerson } = usePersonStore();
    const toast = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<{
        type: InteractionType;
        outcome: OutcomeType;
        notes: string;
        timestamp: string;
    }>({
        type: InteractionType.CHAT,
        outcome: OutcomeType.POSITIVE,
        notes: '',
        timestamp: new Date().toISOString().slice(0, 16) // Format for datetime-local
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await addInteraction({
                personId,
                type: formData.type,
                outcome: formData.outcome,
                notes: formData.notes,
                timestamp: new Date(formData.timestamp).toISOString()
            });

            toast.success('Interaction logged');
            setFormData(prev => ({ ...prev, notes: '' }));
            await loadPerson(personId); // Refresh history
            if (onSuccess) onSuccess();
        } catch {
            toast.error('Failed to log interaction');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="card-glass space-y-4 animate-slide-up">
            <div className="grid grid-cols-2 gap-3">
                <Select
                    label="Type"
                    options={interactionOptions}
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as InteractionType })}
                    required
                />
                <Select
                    label="Outcome"
                    options={outcomeOptions}
                    value={formData.outcome}
                    onChange={(e) => setFormData({ ...formData, outcome: e.target.value as OutcomeType })}
                    required
                />
            </div>

            <div className="form-group">
                <label className="label">Date & Time</label>
                <input
                    type="datetime-local"
                    className="input"
                    value={formData.timestamp}
                    onChange={(e) => setFormData({ ...formData, timestamp: e.target.value })}
                    required
                />
            </div>

            <Textarea
                label="Notes / Outcome"
                placeholder="What did you talk about? Any follow-ups?"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
            />

            <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Logging...' : 'Log Interaction'}
            </button>
        </form>
    );
}
