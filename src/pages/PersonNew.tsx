import { Header } from '../components/layout';
import { PersonForm } from '../components/people/PersonForm';

export function PersonNewPage() {
    return (
        <div className="min-h-screen">
            <Header title="Add New Person" showBack />

            <div className="px-4 py-6 max-w-lg mx-auto">
                <div className="card-glass mb-6">
                    <p className="text-sm text-dark-400">
                        Fill in at least the full name to create a new person in your relationship management system.
                    </p>
                </div>
                <PersonForm />
            </div>
        </div>
    );
}
