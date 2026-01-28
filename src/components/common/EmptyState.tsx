interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
    return (
        <div className="empty-state">
            {icon && (
                <div className="empty-state-icon w-16 h-16 max-w-[64px] max-h-[64px] flex items-center justify-center">
                    {icon}
                </div>
            )}
            <h3 className="empty-state-title">{title}</h3>
            {description && <p className="empty-state-description">{description}</p>}
            {action && <div className="mt-4">{action}</div>}
        </div>
    );
}
