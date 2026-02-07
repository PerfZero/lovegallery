interface AdminPageHeaderProps {
    title: string;
    description?: string;
    action?: React.ReactNode;
}

export function AdminPageHeader({ title, description, action }: AdminPageHeaderProps) {
    return (
        <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-3xl font-display italic text-foreground">{title}</h1>
                {description && (
                    <p className="text-muted-foreground mt-1 text-sm">{description}</p>
                )}
            </div>
            {action && <div>{action}</div>}
        </div>
    );
}
