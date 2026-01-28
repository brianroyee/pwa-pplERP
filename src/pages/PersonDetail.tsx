import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '../components/layout';
import { PersonProfile } from '../components/people/PersonProfile';
import { usePersonStore } from '../store';

export function PersonDetailPage() {
    const { id } = useParams();
    const { loadPerson, currentPerson } = usePersonStore();

    useEffect(() => {
        if (id) loadPerson(id);
    }, [id, loadPerson]);

    return (
        <div className="min-h-screen">
            <Header
                title={currentPerson?.preferredName || currentPerson?.fullName || 'Person Details'}
                showBack
            />

            <div className="px-4 py-6 max-w-lg mx-auto">
                <PersonProfile />
            </div>
        </div>
    );
}
