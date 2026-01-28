import { useEffect, useState } from 'react';
import { getInteractions } from '../../db';
import type { Interaction } from '../../db/types';
import { INTERACTION_TYPE_LABELS, OUTCOME_TYPE_LABELS } from '../../db/types';
import { LoadingSpinner } from '../common';
import { InteractionForm } from './InteractionForm';

interface InteractionLogProps {
    personId: string;
}

export function InteractionLog({ personId }: InteractionLogProps) {
    const [interactions, setInteractions] = useState<Interaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);

    const loadHistory = async () => {
        setIsLoading(true);
        try {
            const data = await getInteractions(personId);
            setInteractions(data);
        } catch (error) {
            console.error('Failed to load interactions', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadHistory();
    }, [personId]);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-dark-400 uppercase tracking-wider">Activity Log</h4>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="btn btn-ghost btn-sm text-primary-400"
                >
                    {isAdding ? 'Cancel' : 'Log Activity'}
                </button>
            </div>

            {isAdding && (
                <InteractionForm
                    personId={personId}
                    onSuccess={() => {
                        setIsAdding(false);
                        loadHistory();
                    }}
                />
            )}

            {isLoading ? (
                <LoadingSpinner />
            ) : interactions.length === 0 ? (
                <div className="card text-center py-6 text-dark-500 italic text-sm">
                    No activities logged yet.
                </div>
            ) : (
                <div className="relative space-y-4 before:absolute before:inset-0 before:ml-4 before:-z-10 before:h-full before:w-0.5 before:bg-dark-800">
                    {interactions.map((item) => (
                        <div key={item.id} className="relative flex gap-4 animate-fade-in">
                            {/* Timeline marker */}
                            <div className="mt-1.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-dark-900 ring-4 ring-dark-950">
                                <div className={`h-2.5 w-2.5 rounded-full ${item.outcome === 'positive' ? 'bg-success' :
                                        item.outcome === 'neutral' ? 'bg-dark-400' : 'bg-warning'
                                    }`} />
                            </div>

                            <div className="card flex-1 px-4 py-3">
                                <div className="flex items-center justify-between mb-1">
                                    <p className="text-sm font-semibold text-dark-100">
                                        {INTERACTION_TYPE_LABELS[item.type]}
                                    </p>
                                    <span className="text-[10px] text-dark-500">
                                        {new Date(item.timestamp).toLocaleDateString(undefined, {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </span>
                                </div>

                                {item.notes && (
                                    <p className="text-xs text-dark-300 leading-relaxed mb-2">
                                        {item.notes}
                                    </p>
                                )}

                                <div className="flex items-center gap-2">
                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${item.outcome === 'positive' ? 'text-success bg-success/10' :
                                            item.outcome === 'neutral' ? 'text-dark-400 bg-dark-800' : 'text-warning bg-warning/10'
                                        }`}>
                                        {OUTCOME_TYPE_LABELS[item.outcome]}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
