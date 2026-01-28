import { Link } from 'react-router-dom';
import type { Person } from '../../db/types';
import { RELATIONSHIP_TYPE_LABELS } from '../../db/types';

interface PersonCardProps {
    person: Person;
}

export function PersonCard({ person }: PersonCardProps) {
    const initials = (person.preferredName || person.fullName)
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    return (
        <Link
            to={`/people/${person.id}`}
            className="card flex items-center gap-5 hover:border-accent/40 transition-all group"
        >
            <div className="avatar bg-onyx-800 text-accent border-white/5 group-hover:bg-accent group-hover:text-onyx-950 transition-colors">
                {initials}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <p className="text-base font-bold text-white tracking-tight truncate">
                        {person.preferredName || person.fullName}
                    </p>
                    {person.importance >= 4 && (
                        <div className="w-1 h-1 rounded-full bg-accent animate-pulse shadow-[0_0_8px_var(--accent)]" />
                    )}
                </div>

                <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-xs text-text-secondary font-medium truncate">
                        {person.organization || person.profession || 'Connection'}
                    </p>
                    {(person.bestAt || person.skills) && (
                        <>
                            <span className="w-1 h-1 rounded-full bg-white/5" />
                            <p className="text-xs text-accent italic truncate">
                                {person.bestAt || person.skills}
                            </p>
                        </>
                    )}
                </div>

                <div className="flex items-center gap-3 mt-2">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-text-muted group-hover:text-accent/70 transition-colors">
                        {RELATIONSHIP_TYPE_LABELS[person.relationshipType]}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-white/10" />
                    <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest">
                        {person.currentCity || 'Unknown Location'}
                    </span>
                </div>
            </div>

            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5 text-text-muted group-hover:text-white transition-colors">
                <polyline points="9,18 15,12 9,6" />
            </svg>
        </Link>
    );
}
