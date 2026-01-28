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
            className="card flex items-center gap-4 hover:border-primary-400/50 transition-all animate-fade-in"
        >
            <div className="avatar">{initials}</div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-dark-100 truncate">
                        {person.preferredName || person.fullName}
                    </p>
                    {person.preferredName && (
                        <span className="text-xs text-dark-500 truncate hidden sm:inline">
                            ({person.fullName})
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-2 mt-0.5">
                    {person.organization && (
                        <p className="text-xs text-dark-400 truncate">{person.organization}</p>
                    )}
                    {person.organization && person.profession && (
                        <span className="text-dark-600">•</span>
                    )}
                    {person.profession && (
                        <p className="text-xs text-dark-500 truncate">{person.profession}</p>
                    )}
                </div>

                <div className="flex items-center gap-2 mt-1">
                    <span className="badge badge-primary text-xs">
                        {RELATIONSHIP_TYPE_LABELS[person.relationshipType]}
                    </span>

                    {/* Importance indicator */}
                    <div className="importance">
                        {[1, 2, 3, 4, 5].map((level) => (
                            <span
                                key={level}
                                className={`importance-dot ${level <= person.importance ? 'active' : ''}`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-dark-500 flex-shrink-0">
                <polyline points="9,18 15,12 9,6" />
            </svg>
        </Link>
    );
}
