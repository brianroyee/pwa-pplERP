import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout';
import { QRScanner } from '../components/portability/QRScanner';
import { usePersonStore, useToast } from '../store';
import { LoadingPage } from '../components/common';

export function ImportPage() {
    const [isScanning, setIsScanning] = useState(true);
    const [importing, setImporting] = useState(false);
    const { addPerson } = usePersonStore();
    const toast = useToast();
    const navigate = useNavigate();

    const handleScan = async (text: string) => {
        try {
            const payload = JSON.parse(text);
            if (payload.type === 'pplERP-person' && payload.data) {
                setIsScanning(false);
                setImporting(true);

                const id = await addPerson(payload.data);
                toast.success(`Imported ${payload.data.fullName}`);
                navigate(`/people/${id}`);
            } else {
                toast.error('Invalid QR code for pplERP');
            }
        } catch {
            // Ignore parse errors from non-JSON QRs
        }
    };

    if (importing) return <LoadingPage />;

    return (
        <div className="min-h-screen">
            <Header title="Scan QR Code" showBack />

            <div className="px-4 py-8 max-w-lg mx-auto space-y-8">
                <div className="text-center space-y-2">
                    <h3 className="text-lg font-bold text-dark-50">Add via QR</h3>
                    <p className="text-sm text-dark-400">
                        Point your camera at the QR code displayed on another person's pplERP app.
                    </p>
                </div>

                {isScanning ? (
                    <QRScanner
                        onScan={handleScan}
                        onError={(err) => console.log(err)}
                    />
                ) : (
                    <div className="card text-center py-12">
                        <p className="text-dark-400">Processing import...</p>
                    </div>
                )}

                <div className="divider" />

                <div className="card bg-dark-900/40 border-primary-400/20">
                    <h4 className="text-sm font-bold text-primary-400 mb-2">Privacy Note</h4>
                    <p className="text-xs text-dark-400 leading-relaxed">
                        Imported data is stored locally on your device. Only name, profession, organization, and notes are shared via QR to keep it light and secure.
                    </p>
                </div>
            </div>
        </div>
    );
}
