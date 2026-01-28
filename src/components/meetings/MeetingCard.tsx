import { Link } from 'react-router-dom';
import type { Meeting } from '../../db/types';

interface MeetingCardProps {
    meeting: Meeting;
}

export function MeetingCard({ meeting }: MeetingCardProps) {
    const date = new Date(meeting.datetime);
    const isPast = date.getTime() < Date.now();

    return (
        <Link
            to={`/meetings/${meeting.id}`}
            className={`card flex items-center gap-5 hover:border-accent/40 group transition-all ${isPast ? 'opacity-60' : ''}`}
        >
            <div className="flex flex-col items-center justify-center min-w-[3.5rem] py-1 border-r border-white/5 pr-4">
                <span className="text-[10px] uppercase font-black tracking-widest text-text-muted">
                    {date.toLocaleDateString(undefined, { month: 'short' })}
                </span>
                <span className="text-xl font-bold text-white leading-none mt-1">
                    {date.getDate()}
                </span>
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white tracking-tight truncate">
                    {meeting.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5 text-accent/60">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12,6 12,12 16,14" />
                    </svg>
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                        {date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
            </div>

            <div className="flex flex-col items-end gap-2 text-text-muted">
                {!isPast ? (
                    <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shadow-[0_0_8px_rgba(197,160,89,0.5)]" />
                ) : (
                    <span className="text-[8px] font-black uppercase tracking-widest">Past</span>
                )}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3 h-3 group-hover:text-accent transition-colors">
                    <polyline points="9 18 15 12 9 6" />
                </svg>
            </div>
        </Link>
    );
}
