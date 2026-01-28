import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/layout';
import { usePersonStore, useMeetingStore } from '../store';
import { getStats } from '../db';
import { useState } from 'react';
import { evaluateNotifications } from '../services/notificationService';

interface Stats {
    totalPersons: number;
    totalMeetings: number;
    upcomingMeetings: number;
    totalInteractions: number;
}

export function HomePage() {
    const { loadPersons } = usePersonStore();
    const { upcomingMeetings, loadUpcomingMeetings } = useMeetingStore();
    const [dashboardStats, setDashboardStats] = useState<Stats>({
        totalPersons: 0,
        totalMeetings: 0,
        upcomingMeetings: 0,
        totalInteractions: 0
    });

    useEffect(() => {
        loadPersons();
        loadUpcomingMeetings();
        getStats().then(setDashboardStats);

        const startNotifications = async () => {
            if ('Notification' in window && Notification.permission === 'default') {
                await Notification.requestPermission();
            }
            await evaluateNotifications();
        };

        startNotifications();
        const interval = setInterval(evaluateNotifications, 1000 * 60 * 5); // Every 5 mins
        return () => clearInterval(interval);
    }, [loadPersons, loadUpcomingMeetings]);

    return (
        <div className="min-h-screen pb-24">
            <Header title="pplERP" />

            <div className="px-6 py-10 max-w-lg mx-auto space-y-10">
                {/* Simplified Greeting */}
                <header className="space-y-1">
                    <h2 className="text-4xl font-light tracking-tight text-white leading-tight">
                        Focus on <br />
                        <span className="font-bold text-accent italic">connection.</span>
                    </h2>
                </header>

                {/* Quick Action Button */}
                <div className="flex justify-start">
                    <Link
                        to="/people/new"
                        className="btn btn-primary w-full py-5 rounded-2xl shadow-[0_15px_30px_rgba(197,160,89,0.3)] active:scale-95"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4 mr-1">
                            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Add New Contact
                    </Link>
                </div>

                {/* Focus Intent Hero / Reminders */}
                <section>
                    <div className="card-glass p-8 relative overflow-hidden bg-gradient-to-br from-onyx-900 to-onyx-950 border-gold-400/20">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-24 h-24 text-accent">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
                            </svg>
                        </div>

                        <div className="relative z-10 space-y-4">
                            <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-accent">Upcoming Reminders</h3>
                            {upcomingMeetings.length > 0 ? (
                                <div className="space-y-3">
                                    {upcomingMeetings.slice(0, 2).map(meeting => (
                                        <div key={meeting.id} className="border-l-2 border-accent/30 pl-4 py-1">
                                            <p className="text-lg font-medium text-white">{meeting.title}</p>
                                            <p className="text-xs text-text-secondary">
                                                {new Date(meeting.datetime).toLocaleDateString(undefined, {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: 'numeric',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    ))}
                                    <Link to="/meetings" className="text-[10px] font-black uppercase tracking-widest text-accent/60 hover:text-accent transition-colors pt-2 block">
                                        View Full Agenda →
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <p className="text-xl font-medium leading-snug">
                                        No <span className="text-white">pending alerts.</span>
                                    </p>
                                    <p className="text-sm text-text-secondary">
                                        Your network is fresh and up to date.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Minimalist Action Grid */}
                <section className="grid grid-cols-2 gap-4">
                    <Link to="/people" className="card flex flex-col items-start group">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted group-hover:text-accent transition-colors">Directory</span>
                        <span className="text-sm font-bold text-white mt-1">{dashboardStats.totalPersons} Contacts</span>
                    </Link>
                    <Link to="/meetings" className="card flex flex-col items-start group">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted group-hover:text-accent transition-colors">Agenda</span>
                        <span className="text-sm font-bold text-white mt-1">{dashboardStats.upcomingMeetings} Upcoming</span>
                    </Link>
                </section>
            </div>
        </div>
    );
}
