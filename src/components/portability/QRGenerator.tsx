import { QRCodeSVG } from 'qrcode.react';
import type { Person } from '../../db/types';

interface QRGeneratorProps {
    person: Person;
    size?: number;
}

export function QRGenerator({ person, size = 256 }: QRGeneratorProps) {
    // We only share essential info to keep QR code density manageable
    const shareData = {
        type: 'pplERP-person',
        data: {
            fullName: person.fullName,
            preferredName: person.preferredName,
            relationshipType: person.relationshipType,
            organization: person.organization,
            profession: person.profession,
            notes: person.notes
        }
    };

    const qrValue = JSON.stringify(shareData);

    return (
        <div className="flex flex-col items-center gap-4 animate-scale-in">
            <div className="p-4 bg-white rounded-2xl shadow-xl shadow-primary-400/10">
                <QRCodeSVG
                    value={qrValue}
                    size={size}
                    includeMargin={true}
                    level="M"
                    fgColor="#0a0a0a"
                    bgColor="#ffffff"
                />
            </div>
            <p className="text-xs text-dark-500 text-center max-w-[200px]">
                Scan this code with another pplERP app to import this contact.
            </p>
        </div>
    );
}
