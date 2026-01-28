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
    const { persons, loadPersons } = usePersonStore();
    const { upcomingMeetings, loadUpcomingMeetings } = useMeetingStore();
    const [stats, setStats] = useState<Stats>({
        totalPersons: 0,
        totalMeetings: 0,
        upcomingMeetings: 0,
        totalInteractions: 0
    });

    useEffect(() => {
        loadPersons();
        loadUpcomingMeetings();
        getStats().then(setStats);

        // Start notification evaluation
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
        <div className="min-h-screen pb-20">
            <Header title="pplERP" />

            <div className="px-4 py-6 max-w-lg mx-auto space-y-8">
                {/* Welcome section */}
                <div className="flex items-center gap-4 py-2 border-b border-dark-900 pb-6">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-400 font-black text-dark-950 text-2xl shadow-lg shadow-primary-400/20">
                        P
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-dark-50">Dashboard</h2>
                        <p className="text-dark-500 text-xs">Manage your professional network</p>
                    </div>
                </div>

                {/* Stats Grid */}
                <section>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="card-glass relative overflow-hidden group">
                            <div className="absolute -right-2 -top-2 opacity-5 group-hover:opacity-10 transition-opacity">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-16 h-16">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                </svg>
                            </div>
                            <p className="text-3xl font-black text-primary-400">{stats.totalPersons}</p>
                            <p className="text-xs font-bold uppercase tracking-widest text-dark-500">Contacts</p>
                        </div>

                        <div className="card-glass relative overflow-hidden group">
                            <div className="absolute -right-2 -top-2 opacity-5 group-hover:opacity-10 transition-opacity">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-16 h-16">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                    <line x1="16" y1="2" x2="16" y2="6" />
                                    <line x1="8" y1="2" x2="8" y2="6" />
                                </svg>
                            </div>
                            <p className="text-3xl font-black text-primary-400">{stats.upcomingMeetings}</p>
                            <p className="text-xs font-bold uppercase tracking-widest text-dark-500">Upcoming</p>
                        </div>
                    </div>
                </section>

                {/* Quick Actions */}
                <section>
                    <h3 className="text-[10px] font-bold text-dark-600 uppercase tracking-[0.2em] mb-3">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <Link to="/people/new" className="card-compact hover:bg-primary-400 hover:text-dark-950 transition-all group border-primary-400/20">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-primary-400/10 flex items-center justify-center group-hover:bg-dark-950/20">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 text-primary-400 group-hover:text-dark-950">
                                        <line x1="12" y1="5" x2="12" y2="19" />
                                        <line x1="5" y1="12" x2="19" y2="12" />
                                    </svg>
                                </div>
                                <span className="text-sm font-bold">Add Person</span>
                            </div>
                        </Link>

                        <Link to="/meetings/new" className="card-compact hover:bg-dark-800 transition-all group">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-dark-800 flex items-center justify-center group-hover:bg-dark-700">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 text-primary-400">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                        <line x1="12" y1="14" x2="12" y2="18" />
                                        <line x1="10" y1="16" x2="14" y2="16" />
                                    </svg>
                                </div>
                                <span className="text-sm font-bold text-dark-100">Schedule</span>
                            </div>
                        </Link>

                        <Link to="/import" className="card-compact hover:bg-dark-800 transition-all group">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-dark-800 flex items-center justify-center group-hover:bg-dark-700">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 text-primary-400">
                                        <rect x="3" y="3" width="18" height="18" rx="2" />
                                        <path d="M7 7h.01M7 12h.01M7 17h.01M12 7h.01M12 12h.01M12 17h.01M17 7h.01M17 12h.01M17 17h.01" />
                                    </svg>
                                </div>
                                <span className="text-sm font-bold text-dark-100">Scan QR</span>
                            </div>
                        </Link>

                        <Link to="/people" className="card-compact hover:bg-dark-800 transition-all group">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-dark-800 flex items-center justify-center group-hover:bg-dark-700">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 text-primary-400">
                                        <circle cx="11" cy="11" r="8" />
                                        <path d="M21 21l-4.35-4.35" />
                                    </svg>
                                </div>
                                <span className="text-sm font-bold text-dark-100">Search</span>
                            </div>
                        </Link>
                    </div>
                </section>

                {/* Empty State / Call to Action */}
                {stats.totalPersons === 0 && (
                    <div className="card bg-primary-400/5 border-primary-400/20 py-8 px-6 text-center space-y-4">
                        <div className="mx-auto w-12 h-12 rounded-full bg-primary-400/10 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-primary-400">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <polyline points="16,11 18,13 22,9" />
                            </svg>
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-dark-50 font-bold">Start your network</h4>
                            <p className="text-xs text-dark-500 max-w-[200px] mx-auto">
                                Add your first contact to begin tracking your professional relationships.
                            </p>
                        </div>
                        <Link to="/people/new" className="btn btn-primary btn-sm w-full max-w-[160px] mx-auto">
                            Get Started
                        </Link>
                    </div>
                )}

                {/* Recent People */}
                {persons.length > 0 && (
                    <section>
                        <div className="flex items-center justify-between mb-3 px-1">
                            <h3 className="text-[10px] font-bold text-dark-600 uppercase tracking-[0.2em]">Recent People</h3>
                            <Link to="/people" className="text-[10px] font-bold text-primary-400 hover:text-primary-300 uppercase tracking-widest">View All</Link>
                        </div>
                        <div className="space-y-2">
                            {persons.slice(0, 3).map((person) => (
                                <Link key={person.id} to={`/people/${person.id}`} className="card flex items-center gap-3 py-3">
                                    <div className="avatar-sm">
                                        {(person.preferredName || person.fullName)[0].toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-dark-100 truncate">
                                            {person.preferredName || person.fullName}
                                        </p>
                                        <p className="text-[10px] text-dark-500 truncate uppercase tracking-wider">
                                            {person.organization || person.profession || 'Contact'}
                                        </p>
                                    </div>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3 h-3 text-dark-600">
                                        <polyline points="9,18 15,12 9,6" />
                                    </svg>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* Upcoming Meetings */}
                {upcomingMeetings.length > 0 && (
                    <section>
                        <div className="flex items-center justify-between mb-3 px-1">
                            <h3 className="text-[10px] font-bold text-dark-600 uppercase tracking-[0.2em]">Next Meetings</h3>
                            <Link to="/meetings" className="text-[10px] font-bold text-primary-400 hover:text-primary-300 uppercase tracking-widest">View All</Link>
                        </div>
                        <div className="space-y-2">
                            {upcomingMeetings.slice(0, 3).map((meeting) => (
                                <Link key={meeting.id} to={`/meetings/${meeting.id}`} className="card border-l-4 border-primary-400 flex items-center justify-between py-3">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-dark-100 truncate">{meeting.title}</p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3 text-primary-400">
                                                <circle cx="12" cy="12" r="10" /><polyline points="12,6 12,12 16,14" />
                                            </svg>
                                            <p className="text-[10px] text-dark-500 font-medium">
                                                {new Date(meeting.datetime).toLocaleDateString(undefined, {
                                                    weekday: 'short',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: 'numeric',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3 h-3 text-dark-600">
                                        <polyline points="9,18 15,12 9,6" />
                                    </svg>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
