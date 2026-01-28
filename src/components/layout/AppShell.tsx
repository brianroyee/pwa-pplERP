import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { Toast } from '../common/Toast';

export function AppShell() {
    return (
        <div className="min-h-screen bg-dark-950 flex flex-col">
            {/* Main content area */}
            <main className="flex-1 pb-20">
                <Outlet />
            </main>

            {/* Bottom navigation */}
            <BottomNav />

            {/* Toast notifications */}
            <Toast />
        </div>
    );
}
