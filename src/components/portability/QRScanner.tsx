import { useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface QRScannerProps {
    onScan: (decodedText: string) => void;
    onError?: (errorMessage: string) => void;
}

export function QRScanner({ onScan, onError }: QRScannerProps) {
    useEffect(() => {
        const scanner = new Html5QrcodeScanner(
            "qr-reader",
            { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
        );

        scanner.render(onScan, onError);

        return () => {
            scanner.clear().catch(error => {
                console.error("Failed to clear html5QrcodeScanner. ", error);
            });
        };
    }, [onScan, onError]);

    return (
        <div className="w-full max-w-sm mx-auto overflow-hidden rounded-2xl bg-dark-900 border border-dark-800">
            <div id="qr-reader" className="w-full"></div>
            <div className="p-4 text-center">
                <p className="text-xs text-dark-400">Position the QR code within the frame to scan</p>
            </div>
        </div>
    );
}
