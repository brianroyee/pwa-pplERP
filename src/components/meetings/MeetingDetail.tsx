import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useMeetingStore, useToast } from '../../store';
import { LoadingPage } from '../common';

export function MeetingDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentMeeting, loadMeeting, removeMeeting, isLoading } = useMeetingStore();
    const toast = useToast();

    useEffect(() => {
        if (id) loadMeeting(id);
    }, [id, loadMeeting]);

    if (isLoading) return <LoadingPage />;
    if (!currentMeeting) return <div className="p-8 text-center text-dark-500">Meeting not found.</div>;

    const date = new Date(currentMeeting.datetime);

    const handleDelete = async () => {
        if (window.confirm('Delete this meeting?')) {
            try {
                await removeMeeting(currentMeeting.id);
                toast.success('Meeting deleted');
                navigate('/meetings');
            } catch {
                toast.error('Failed to delete meeting');
            }
        }
    };

    return (
        <div className="animate-fade-in space-y-6 pb-12">
            {/* Header Info */}
            <div className="card-glass space-y-4">
                <h2 className="text-2xl font-bold text-dark-50">{currentMeeting.title}</h2>

                <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2 text-dark-300">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-primary-400">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        {date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-2 text-dark-300">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-primary-400">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12,6 12,12 16,14" />
                        </svg>
                        {date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                    </div>
                </div>

                <div className="flex gap-2">
                    <button onClick={handleDelete} className="btn btn-ghost btn-sm text-error/80 hover:text-error ml-auto">
                        Delete Meeting
                    </button>
                </div>
            </div>

            {/* Participants */}
            <div className="space-y-2">
                <h4 className="text-sm font-semibold text-dark-400 uppercase tracking-wider">Participants</h4>
                <div className="flex flex-wrap gap-2">
                    {!currentMeeting.participants || currentMeeting.participants.length === 0 ? (
                        <p className="text-sm text-dark-500 italic">No participants listed.</p>
                    ) : (
                        currentMeeting.participants.map(person => (
                            <Link
                                key={person.id}
                                to={`/people/${person.id}`}
                                className="card-compact flex items-center gap-2 hover:border-primary-400/50"
                            >
                                <div className="avatar-sm">
                                    {(person.preferredName || person.fullName)[0].toUpperCase()}
                                </div>
                                <span className="text-xs font-medium text-dark-200">
                                    {person.preferredName || person.fullName}
                                </span>
                            </Link>
                        ))
                    )}
                </div>
            </div>

            {/* Agenda */}
            {currentMeeting.agenda && (
                <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-dark-400 uppercase tracking-wider">Agenda</h4>
                    <div className="card text-sm text-dark-200 whitespace-pre-wrap">
                        {currentMeeting.agenda}
                    </div>
                </div>
            )}

            {/* Meeting Notes */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-dark-400 uppercase tracking-wider">Notes / Summary</h4>
                </div>
                <div className="card text-sm text-dark-300 min-h-[8rem] whitespace-pre-wrap">
                    {currentMeeting.notes || <span className="text-dark-600 italic">No notes recorded yet.</span>}
                </div>
            </div>

            {/* Reminders Info */}
            <div className="space-y-2">
                <h4 className="text-sm font-semibold text-dark-400 uppercase tracking-wider">Scheduled Notifications</h4>
                <div className="flex flex-wrap gap-2">
                    {currentMeeting.reminderOffsets.map((offset: number) => (
                        <span key={offset} className="badge badge-secondary text-[10px]">
                            {offset >= 1440 ? '1 day' : offset >= 60 ? `${offset / 60}h` : `${offset}m`} before
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
