import { useRef } from 'react';
import { Header } from '../components/layout';
import { useToast } from '../store';
import db from '../db';
import { LoadingSpinner } from '../components/common';
import { useState } from 'react';

export function SettingsPage() {
    const toast = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isExporting, setIsExporting] = useState(false);
    const [isImporting, setIsImporting] = useState(false);

    const handleExport = async () => {
        setIsExporting(true);
        try {
            // Collect all data from Dexie tables
            const tables = ['persons', 'contactMethods', 'importantDates', 'interactions', 'meetings', 'meetingParticipants'];
            const exportData: Record<string, any[]> = {};

            for (const table of tables) {
                exportData[table] = await (db as any)[table].toArray();
            }

            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `pplERP-backup-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);

            toast.success('Backup exported successfully');
        } catch (error) {
            console.error(error);
            toast.error('Export failed');
        } finally {
            setIsExporting(false);
        }
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!window.confirm('This will merge the backup data with your current data. Continue?')) {
            e.target.value = '';
            return;
        }

        setIsImporting(true);
        const reader = new FileReader();

        reader.onload = async (event) => {
            try {
                const content = event.target?.result as string;
                const data = JSON.parse(content);

                // Basic validation
                if (!data.persons) throw new Error('Invalid backup file');

                // Simple import - using bulkPut to handle potential collisions
                for (const [tableName, rows] of Object.entries(data)) {
                    if (Array.isArray(rows) && (db as any)[tableName]) {
                        await (db as any)[tableName].bulkPut(rows);
                    }
                }

                toast.success('Backup imported successfully');
                window.location.reload(); // Reload to refresh all stores
            } catch (error) {
                console.error(error);
                toast.error('Import failed - invalid file format');
            } finally {
                setIsImporting(false);
            }
        };

        reader.readAsText(file);
        e.target.value = ''; // Reset input
    };

    return (
        <div className="min-h-screen">
            <Header title="Settings" />

            <div className="px-4 py-6 max-w-lg mx-auto space-y-6 pb-24">
                {/* App Info */}
                <section className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-dark-500 px-1">App Info</h3>
                    <div className="card space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-dark-100">pplERP</p>
                                <p className="text-xs text-dark-500">v0.1.0-alpha</p>
                            </div>
                            <div className="w-10 h-10 bg-primary-400 rounded-xl flex items-center justify-center text-dark-950 font-bold">
                                P
                            </div>
                        </div>
                        <p className="text-xs text-dark-400 leading-relaxed italic">
                            "Building better relationships, one interaction at a time."
                        </p>
                    </div>
                </section>

                {/* Data Management */}
                <section className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-dark-500 px-1">Data Management</h3>
                    <div className="space-y-2">
                        <button
                            onClick={handleExport}
                            disabled={isExporting}
                            className="card flex items-center justify-between w-full hover:border-primary-400/30 text-left"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-primary-400/10 flex items-center justify-center text-primary-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4a2 2 0 0 1 2-2" />
                                        <polyline points="7 10 12 15 17 10" />
                                        <line x1="12" y1="15" x2="12" y2="3" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-dark-100">Export Backup</p>
                                    <p className="text-[10px] text-dark-500">Download all data as JSON</p>
                                </div>
                            </div>
                            {isExporting ? <LoadingSpinner size="sm" /> : (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-dark-600">
                                    <polyline points="9 18 15 12 9 6" />
                                </svg>
                            )}
                        </button>

                        <button
                            onClick={handleImportClick}
                            disabled={isImporting}
                            className="card flex items-center justify-between w-full hover:border-primary-400/30 text-left"
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept=".json"
                            />
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-primary-400/10 flex items-center justify-center text-primary-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="17 8 12 3 7 8" />
                                        <line x1="12" y1="3" x2="12" y2="15" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-dark-100">Import Backup</p>
                                    <p className="text-[10px] text-dark-500">Restore or merge data from file</p>
                                </div>
                            </div>
                            {isImporting ? <LoadingSpinner size="sm" /> : (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-dark-600">
                                    <polyline points="9 18 15 12 9 6" />
                                </svg>
                            )}
                        </button>
                    </div>
                </section>

                {/* Preferences */}
                <section className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-dark-500 px-1">Preferences</h3>
                    <div className="card space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-dark-800 flex items-center justify-center text-dark-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-dark-100">Push Notifications</p>
                                </div>
                            </div>
                            <input type="checkbox" className="w-5 h-5 accent-primary-400" defaultChecked />
                        </div>
                    </div>
                </section>

                {/* Danger Zone */}
                <section className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-error/80 px-1">Danger Zone</h3>
                    <div className="card border-error/20 bg-error/5">
                        <button
                            onClick={async () => {
                                if (window.confirm('CRITICAL: Delete all application data? This cannot be undone.')) {
                                    await db.delete();
                                    window.location.reload();
                                }
                            }}
                            className="flex items-center gap-3 w-full text-left"
                        >
                            <div className="w-8 h-8 rounded-lg bg-error/10 flex items-center justify-center text-error">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                                    <path d="M3 6h18" />
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                    <line x1="10" y1="11" x2="10" y2="17" />
                                    <line x1="14" y1="11" x2="14" y2="17" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-error">Purge All Data</p>
                                <p className="text-[10px] text-error/60">Factory reset the application</p>
                            </div>
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
}
