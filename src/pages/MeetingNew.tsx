import { Header } from '../components/layout';
import { MeetingForm } from '../components/meetings/MeetingForm';

export function MeetingNewPage() {
    return (
        <div className="min-h-screen">
            <Header title="Schedule Meeting" showBack />

            <div className="px-4 py-6 max-w-lg mx-auto">
                <MeetingForm />
            </div>
        </div>
    );
}
