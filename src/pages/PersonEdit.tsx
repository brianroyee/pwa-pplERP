import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '../components/layout';
import { PersonForm } from '../components/people/PersonForm';
import { usePersonStore } from '../store';
import { LoadingPage } from '../components/common';

export function PersonEditPage() {
    const { id } = useParams();
    const { currentPerson, loadPerson, isLoading } = usePersonStore();

    useEffect(() => {
        if (id) loadPerson(id);
    }, [id, loadPerson]);

    if (isLoading || !currentPerson) return <LoadingPage />;

    return (
        <div className="min-h-screen">
            <Header title={`Edit ${currentPerson.fullName}`} showBack />

            <div className="px-4 py-6 max-w-lg mx-auto">
                <PersonForm person={currentPerson} />
            </div>
        </div>
    );
}
