import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMeetingStore, useToast } from '../../store';
import { Input, Textarea } from '../common';
import { ParticipantSelector } from './ParticipantSelector';
import type { Meeting } from '../../db/types';

interface MeetingFormProps {
    meeting?: Meeting;
}

export function MeetingForm({ meeting }: MeetingFormProps) {
    const navigate = useNavigate();
    const { addMeeting, editMeeting, isLoading } = useMeetingStore();
    const toast = useToast();

    const [formData, setFormData] = useState({
        title: meeting?.title || '',
        datetime: meeting?.datetime ? new Date(meeting.datetime).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
        agenda: meeting?.agenda || '',
        notes: meeting?.notes || '',
        reminderOffsets: meeting?.reminderOffsets || [15, 60] // Defaults: 15min, 1hr
    });

    const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]); // Need to fetch existing for edit

    const validate = () => {
        if (!formData.title.trim()) {
            toast.error('Meeting title is required');
            return false;
        }
        if (!formData.datetime) {
            toast.error('Date and time are required');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            const meetingData = {
                ...formData,
                datetime: new Date(formData.datetime).toISOString()
            };

            if (meeting) {
                await editMeeting(meeting.id, meetingData);
                toast.success('Meeting updated');
            } else {
                await addMeeting(meetingData, selectedParticipants);
                toast.success('Meeting scheduled');
            }
            navigate('/meetings');
        } catch {
            toast.error('Failed to save meeting');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 pb-12">
            <div className="space-y-4">
                <Input
                    label="Meeting Title"
                    placeholder="Sync with team"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                />

                <div className="form-group">
                    <label className="label">Date & Time</label>
                    <input
                        type="datetime-local"
                        className="input"
                        value={formData.datetime}
                        onChange={(e) => setFormData({ ...formData, datetime: e.target.value })}
                        required
                    />
                </div>

                <ParticipantSelector
                    selectedIds={selectedParticipants}
                    onChange={setSelectedParticipants}
                />

                <Textarea
                    label="Agenda"
                    placeholder="What's the plan?"
                    value={formData.agenda}
                    onChange={(e) => setFormData({ ...formData, agenda: e.target.value })}
                    rows={3}
                />

                <div className="form-group">
                    <label className="label">Reminders (minutes before)</label>
                    <div className="flex flex-wrap gap-2">
                        {[15, 30, 60, 1440].map(offset => (
                            <button
                                key={offset}
                                type="button"
                                onClick={() => {
                                    const offsets = formData.reminderOffsets.includes(offset)
                                        ? formData.reminderOffsets.filter(o => o !== offset)
                                        : [...formData.reminderOffsets, offset];
                                    setFormData({ ...formData, reminderOffsets: offsets });
                                }}
                                className={`btn btn-xs ${formData.reminderOffsets.includes(offset) ? 'btn-primary' : 'btn-secondary'}`}
                            >
                                {offset >= 1440 ? '1 day' : offset >= 60 ? `${offset / 60}h` : `${offset}m`}
                            </button>
                        ))}
                    </div>
                </div>

                <Textarea
                    label="Post-meeting Notes"
                    placeholder="Summary, decisions, next steps..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={4}
                />
            </div>

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
                    {meeting ? 'Update Meeting' : 'Schedule Meeting'}
                </button>
            </div>
        </form>
    );
}
