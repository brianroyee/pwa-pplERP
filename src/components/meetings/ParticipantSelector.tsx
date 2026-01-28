import { useEffect, useState } from 'react';
import { usePersonStore } from '../../store';

interface ParticipantSelectorProps {
    selectedIds: string[];
    onChange: (ids: string[]) => void;
}

export function ParticipantSelector({ selectedIds, onChange }: ParticipantSelectorProps) {
    const { persons, loadPersons } = usePersonStore();
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadPersons();
    }, [loadPersons]);

    const filteredPersons = persons.filter(p =>
        p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.preferredName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleParticipant = (id: string) => {
        if (selectedIds.includes(id)) {
            onChange(selectedIds.filter(i => i !== id));
        } else {
            onChange([...selectedIds, id]);
        }
    };

    return (
        <div className="space-y-3">
            <label className="label">Participants</label>

            {/* Search participants */}
            <div className="relative mb-2">
                <input
                    type="text"
                    placeholder="Search contacts..."
                    className="input input-sm pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500">
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                </svg>
            </div>

            <div className="max-h-48 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                {filteredPersons.length === 0 && (
                    <p className="text-xs text-dark-500 py-2 text-center">No contacts found.</p>
                )}
                {filteredPersons.map((person) => {
                    const isSelected = selectedIds.includes(person.id);
                    return (
                        <button
                            key={person.id}
                            type="button"
                            onClick={() => toggleParticipant(person.id)}
                            className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors ${isSelected ? 'bg-primary-400/10 border border-primary-400/30' : 'hover:bg-dark-800 border border-transparent'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <div className="avatar-sm">
                                    {(person.preferredName || person.fullName)[0].toUpperCase()}
                                </div>
                                <span className={`text-sm ${isSelected ? 'text-primary-400 font-medium' : 'text-dark-200'}`}>
                                    {person.preferredName || person.fullName}
                                </span>
                            </div>
                            {isSelected ? (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 text-primary-400">
                                    <polyline points="20,6 9,17 4,12" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-dark-600">
                                    <line x1="12" y1="5" x2="12" y2="19" />
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                            )}
                        </button>
                    );
                })}
            </div>

            {selectedIds.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                    {selectedIds.map(id => {
                        const person = persons.find(p => p.id === id);
                        if (!person) return null;
                        return (
                            <span key={id} className="badge badge-primary text-[10px] pl-1 pr-2 py-0.5 flex items-center gap-1">
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); toggleParticipant(id); }}
                                    className="hover:text-dark-950"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-2.5 h-2.5">
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </button>
                                {person.preferredName || person.fullName}
                            </span>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
