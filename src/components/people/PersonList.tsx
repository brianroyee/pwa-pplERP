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

    return (
        <div className="space-y-4">
            {/* Search bar */}
            <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500">
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                </svg>
                <input
                    type="text"
                    placeholder="Search people..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="input pl-10"
                />
            </div>

            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
                <button
                    onClick={() => setFilterType('all')}
                    className={`btn btn-sm whitespace-nowrap ${filterType === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                >
                    All
                </button>
                {Object.entries(RELATIONSHIP_TYPE_LABELS).map(([value, label]) => (
                    <button
                        key={value}
                        onClick={() => setFilterType(value)}
                        className={`btn btn-sm whitespace-nowrap ${filterType === value ? 'btn-primary' : 'btn-secondary'}`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Sort dropdown */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-dark-400">
                    {filteredPersons.length} {filteredPersons.length === 1 ? 'person' : 'people'}
                </p>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                    className="select text-sm py-1.5 px-3 w-auto"
                >
                    <option value="name">Sort by Name</option>
                    <option value="recent">Sort by Recent</option>
                    <option value="importance">Sort by Importance</option>
                </select>
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
