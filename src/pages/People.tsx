import { Header } from '../components/layout';
import { PersonList } from '../components/people/PersonList';

export function PeoplePage() {
    return (
        <div className="min-h-screen">
            <Header
                title="People"
                actions={
                    <a href="/people/new" className="btn btn-primary btn-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 mr-1">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Add
                    </a>
                }
            />

            <div className="px-4 py-6 max-w-lg mx-auto">
                <PersonList />
            </div>
        </div>
    );
}
