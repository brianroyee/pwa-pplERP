import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePersonStore } from '../../store';
import { PersonCard } from './PersonCard';
import { EmptyState, LoadingSpinner } from '../common';
import { RELATIONSHIP_TYPE_LABELS } from '../../db/types';

export function PersonList() {
    const { persons, isLoading, loadPersons, search, searchQuery } = usePersonStore();
    const [filterType, setFilterType] = useState<string>('all');
    const [sortBy, setSortBy] = useState<'name' | 'recent' | 'importance'>('name');

    useEffect(() => {
        loadPersons();
    }, [loadPersons]);

    // Filter and sort persons
    const filteredPersons = persons
        .filter(person => filterType === 'all' || person.relationshipType === filterType)
        .sort((a, b) => {
            switch (sortBy) {
                case 'recent':
                    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
                case 'importance':
                    return b.importance - a.importance;
                case 'name':
                default:
                    return a.fullName.localeCompare(b.fullName);
            }
        });

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        search(e.target.value);
    };

    const [isFilterExpanded, setIsFilterExpanded] = useState(false);

    return (
        <div className="space-y-6 px-2">
            {/* Hero Search */}
            <div className="card !p-1 bg-onyx-900 border-white/5 focus-within:border-accent/40 focus-within:bg-white/[0.02] transition-all">
                <div className="flex items-center">
                    <div className="pl-4">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 text-text-muted">
                            <circle cx="11" cy="11" r="8" />
                            <path d="M21 21l-4.35-4.35" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search your network..."
                        value={searchQuery}
                        onChange={handleSearch}
                        className="w-full bg-transparent border-none py-3 px-4 text-white focus:ring-0 placeholder-text-muted/40 text-sm font-medium"
                    />
                </div>
            </div>

            {/* Expandable Filters & Sort */}
            <div className="space-y-4">
                <button
                    onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                    className="card !p-0 w-full flex items-center justify-between bg-onyx-900 overflow-hidden group hover:border-accent/40 active:scale-[0.98]"
                >
                    <div className="flex items-center gap-4 px-5 py-4">
                        <div className="p-2 rounded-xl bg-white/5 group-hover:bg-accent/10 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`w-3.5 h-3.5 text-accent transition-transform duration-300 ${isFilterExpanded ? 'rotate-180' : ''}`}>
                                <polyline points="6 9 12 15 18 9" />
                            </svg>
                        </div>
                        <span className="text-[11px] font-black uppercase tracking-[0.25em] text-white">Filters</span>
                    </div>
                    <div className="flex items-center gap-2 px-5">
                        {filterType !== 'all' && (
                            <span className="text-[9px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full uppercase tracking-widest border border-accent/20">
                                {RELATIONSHIP_TYPE_LABELS[filterType as keyof typeof RELATIONSHIP_TYPE_LABELS]}
                            </span>
                        )}
                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest group-hover:text-white transition-colors">
                            Sort: <span className="text-accent">{sortBy}</span>
                        </span>
                    </div>
                </button>

                {isFilterExpanded && (
                    <div className="card-glass p-6 space-y-8 animate-slide-up shadow-2xl">
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] px-1 flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-accent" />
                                Relationship Type
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setFilterType('all')}
                                    className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${filterType === 'all' ? 'bg-accent text-onyx-950 shadow-[0_5px_15px_rgba(197,160,89,0.3)]' : 'bg-white/5 text-text-muted hover:bg-white/10 border border-white/5'}`}
                                >
                                    All
                                </button>
                                {Object.entries(RELATIONSHIP_TYPE_LABELS).map(([value, label]) => (
                                    <button
                                        key={value}
                                        onClick={() => setFilterType(value)}
                                        className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${filterType === value ? 'bg-accent text-onyx-950 shadow-[0_5px_15px_rgba(197,160,89,0.3)]' : 'bg-white/5 text-text-muted hover:bg-white/10 border border-white/5'}`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] px-1 flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-accent" />
                                Sort Priority
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {(['name', 'recent', 'importance'] as const).map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => setSortBy(option)}
                                        className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${sortBy === option ? 'bg-white/20 text-white border-white/30' : 'bg-white/5 text-text-muted hover:bg-white/10 border border-white/5'}`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Person list */}
            {isLoading ? (
                <div className="py-12">
                    <LoadingSpinner size="lg" />
                </div>
            ) : filteredPersons.length === 0 ? (
                <EmptyState
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                    }
                    title={searchQuery ? 'No results found' : 'No people yet'}
                    description={searchQuery ? `No people match "${searchQuery}"` : 'Add your first contact to get started'}
                    action={
                        !searchQuery && (
                            <Link to="/people/new" className="btn btn-primary">
                                Add Your First Person
                            </Link>
                        )
                    }
                />
            ) : (
                <div className="space-y-2">
                    {filteredPersons.map((person) => (
                        <PersonCard key={person.id} person={person} />
                    ))}
                </div>
            )}
        </div>
    );
}
