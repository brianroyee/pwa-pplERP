import { useNavigate } from 'react-router-dom';

interface HeaderProps {
    title: string;
    showBack?: boolean;
    actions?: React.ReactNode;
}

export function Header({ title, showBack = false, actions }: HeaderProps) {
    const navigate = useNavigate();

    return (
        <header className="sticky top-0 z-30 bg-dark-950/95 backdrop-blur-lg border-b border-dark-800 safe-top">
            <div className="flex items-center justify-between h-14 px-4 max-w-lg mx-auto">
                <div className="flex items-center gap-3">
                    {showBack && (
                        <button
                            onClick={() => navigate(-1)}
                            className="btn-icon btn-ghost -ml-2"
                            aria-label="Go back"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                                <polyline points="15,18 9,12 15,6" />
                            </svg>
                        </button>
                    )}
                    <h1 className="text-lg font-semibold text-dark-50 truncate">{title}</h1>
                </div>

                {actions && (
                    <div className="flex items-center gap-2">
                        {actions}
                    </div>
                )}
            </div>
        </header>
    );
}
