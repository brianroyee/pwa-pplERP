import { useEffect } from 'react';
import { useMeetingStore } from '../../store';
import { MeetingCard } from './MeetingCard';
import { EmptyState, LoadingSpinner } from '../common';

export function MeetingList() {
    const { meetings, isLoading, loadMeetings } = useMeetingStore();

    useEffect(() => {
        loadMeetings();
    }, [loadMeetings]);

    const sortedMeetings = [...meetings].sort((a, b) =>
        new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
    );

    const upcoming = sortedMeetings.filter(m => new Date(m.datetime).getTime() >= Date.now());
    const past = sortedMeetings.filter(m => new Date(m.datetime).getTime() < Date.now());

    if (isLoading) return (
        <div className="py-20">
            <LoadingSpinner size="lg" />
        </div>
    );

    if (meetings.length === 0) {
        return (
            <EmptyState
                icon={
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                }
                title="No meetings scheduled"
                description="Plan your next catch-up or meeting to keep your relationships warm."
            />
        );
    }

    return (
        <div className="space-y-8">
            {upcoming.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center gap-3 px-1">
                        <div className="w-1 h-3 bg-accent rounded-full" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Upcoming</h3>
                    </div>
                    <div className="space-y-3">
                        {upcoming.map(meeting => (
                            <MeetingCard key={meeting.id} meeting={meeting} />
                        ))}
                    </div>
                </div>
            )}

            {past.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center gap-3 px-1">
                        <div className="w-1 h-3 bg-white/10 rounded-full" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Past Meetings</h3>
                    </div>
                    <div className="space-y-3">
                        {past.map(meeting => (
                            <MeetingCard key={meeting.id} meeting={meeting} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
