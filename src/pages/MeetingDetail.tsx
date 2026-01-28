import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '../components/layout';
import { MeetingDetail } from '../components/meetings/MeetingDetail';
import { useMeetingStore } from '../store';

export function MeetingDetailPage() {
    const { id } = useParams();
    const { currentMeeting, loadMeeting } = useMeetingStore();

    useEffect(() => {
        if (id) loadMeeting(id);
    }, [id, loadMeeting]);

    return (
        <div className="min-h-screen">
            <Header
                title={currentMeeting?.title || 'Meeting Details'}
                showBack
            />

            <div className="px-4 py-6 max-w-lg mx-auto">
                <MeetingDetail />
            </div>
        </div>
    );
}
