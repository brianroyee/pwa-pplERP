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
            className={`card border-l-4 ${isPast ? 'border-dark-700 opacity-75' : 'border-primary-400'} flex items-center gap-4 hover:bg-dark-900/40 transition-all`}
        >
            <div className="flex flex-col items-center justify-center min-w-[3.5rem] py-1 border-r border-dark-800 pr-4">
                <span className="text-[10px] uppercase font-bold text-dark-500">
                    {date.toLocaleDateString(undefined, { month: 'short' })}
                </span>
                <span className="text-xl font-bold text-dark-100 leading-none">
                    {date.getDate()}
                </span>
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-dark-50 truncate">
                    {meeting.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 text-dark-500">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12,6 12,12 16,14" />
                    </svg>
                    <span className="text-xs text-dark-400">
                        {date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
            </div>

            {!isPast && (
                <div className="animate-pulse flex items-center justify-center w-2 h-2 rounded-full bg-primary-400" />
            )}
        </Link>
    );
}
