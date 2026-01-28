import { useNavigate } from 'react-router-dom';
import { usePersonStore, useToast } from '../../store';
import { RELATIONSHIP_TYPE_LABELS, IMPORTANCE_LABELS } from '../../db/types';
import { ContactMethodEditor } from './ContactMethodEditor';
import { ImportantDateEditor } from './ImportantDateEditor';
import { InteractionLog } from '../interactions/InteractionLog';
import { QRGenerator } from '../portability/QRGenerator';
import { LoadingPage, Modal } from '../common';
import { useState } from 'react';

export function PersonProfile() {
    const navigate = useNavigate();
    const { currentPerson, isLoading, removePerson } = usePersonStore();
    const toast = useToast();
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    if (isLoading) return <LoadingPage />;
    if (!currentPerson) return (
        <div className="p-8 text-center text-dark-400">
            Person not found.
        </div>
    );

    const handleDelete = async () => {
        if (window.confirm(`Are you sure you want to delete ${currentPerson.fullName}? This cannot be undone.`)) {
            try {
                await removePerson(currentPerson.id);
                toast.success('Person deleted');
                navigate('/people');
            } catch {
                toast.error('Failed to delete person');
            }
        }
    };

    const initials = (currentPerson.preferredName || currentPerson.fullName)
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    return (
        <div className="animate-fade-in pb-12">
            {/* Profile Header Card */}
            <div className="card-glass flex flex-col items-center text-center space-y-4 mb-6">
                <div className="avatar-xl">{initials}</div>
                <div>
                    <h2 className="text-2xl font-bold text-dark-50">
                        {currentPerson.fullName}
                    </h2>
                    {currentPerson.preferredName && (
                        <p className="text-primary-400 font-medium italic">
                            "{currentPerson.preferredName}"
                        </p>
                    )}
                </div>

                <div className="flex flex-wrap justify-center gap-2">
                    <span className="badge badge-primary">
                        {RELATIONSHIP_TYPE_LABELS[currentPerson.relationshipType]}
                    </span>
                    <span className="badge">
                        Importance: {IMPORTANCE_LABELS[currentPerson.importance as keyof typeof IMPORTANCE_LABELS]}
                    </span>
                </div>

                <div className="grid grid-cols-3 gap-3 w-full pt-2">
                    <button
                        onClick={() => navigate(`/people/${currentPerson.id}/edit`)}
                        className="btn btn-secondary btn-sm"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 mr-2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        Edit
                    </button>
                    <button
                        onClick={() => setIsShareModalOpen(true)}
                        className="btn btn-secondary btn-sm"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 mr-2">
                            <circle cx="18" cy="5" r="3" />
                            <circle cx="6" cy="12" r="3" />
                            <circle cx="18" cy="19" r="3" />
                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                        </svg>
                        Share
                    </button>
                    <button
                        onClick={handleDelete}
                        className="btn btn-ghost btn-sm text-error/80 hover:text-error"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 mr-2">
                            <polyline points="3,6 5,6 21,6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                        Delete
                    </button>
                </div>
            </div>

            <Modal
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
                title="Share Contact"
            >
                <div className="py-4">
                    <QRGenerator person={currentPerson} />
                </div>
                <div className="mt-4 flex gap-2">
                    <button
                        onClick={() => setIsShareModalOpen(false)}
                        className="btn btn-primary w-full"
                    >
                        Done
                    </button>
                </div>
            </Modal>

            {/* Info Sections */}
            <div className="space-y-6 px-1">
                {/* Professional Info */}
                {(currentPerson.profession || currentPerson.organization) && (
                    <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-dark-400 uppercase tracking-wider">Professional</h4>
                        <div className="card space-y-3">
                            {currentPerson.profession && (
                                <div className="flex gap-3">
                                    <div className="text-dark-500 w-5"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg></div>
                                    <p className="text-sm text-dark-200">{currentPerson.profession}</p>
                                </div>
                            )}
                            {currentPerson.organization && (
                                <div className="flex gap-3">
                                    <div className="text-dark-500 w-5"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M3 21h18" /><path d="M3 7v1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7H3l2-4h14l2 4" /></svg></div>
                                    <p className="text-sm text-dark-200">{currentPerson.organization}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Locations & Context */}
                <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-dark-400 uppercase tracking-wider">Context</h4>
                    <div className="card space-y-3">
                        {(currentPerson.hometown || currentPerson.currentCity) && (
                            <div className="flex gap-3">
                                <div className="text-dark-500 w-5"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg></div>
                                <div className="text-sm">
                                    {currentPerson.currentCity && <p className="text-dark-100">{currentPerson.currentCity} (Current)</p>}
                                    {currentPerson.hometown && <p className="text-dark-400">From {currentPerson.hometown}</p>}
                                </div>
                            </div>
                        )}
                        {currentPerson.howMet && (
                            <div className="flex gap-3">
                                <div className="text-dark-500 w-5"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><polyline points="16,11 18,13 22,9" /></svg></div>
                                <div className="text-sm">
                                    <p className="text-dark-400 text-xs italic">How you met:</p>
                                    <p className="text-dark-200">{currentPerson.howMet}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Contact Methods Section */}
                <ContactMethodEditor personId={currentPerson.id} />

                {/* Important Dates Section */}
                <ImportantDateEditor personId={currentPerson.id} />

                {/* Interaction Log Section */}
                <div className="divider" />
                <InteractionLog personId={currentPerson.id} />

                {/* Notes */}
                {currentPerson.notes && (
                    <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-dark-400 uppercase tracking-wider">Notes</h4>
                        <div className="card text-sm text-dark-300 whitespace-pre-wrap">
                            {currentPerson.notes}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
