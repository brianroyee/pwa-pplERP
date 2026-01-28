import { create } from 'zustand';
import type { Meeting, Person } from '../db/types';
import {
    createMeeting,
    getMeeting,
    getAllMeetings,
    getUpcomingMeetings,
    getMeetingParticipants,
    deleteMeeting,
    updateMeeting
} from '../db';

interface MeetingWithParticipants extends Meeting {
    participants?: Person[];
}

interface MeetingState {
    // Data
    meetings: Meeting[];
    upcomingMeetings: Meeting[];
    currentMeeting: MeetingWithParticipants | null;

    // UI state
    isLoading: boolean;
    error: string | null;

    // Actions
    loadMeetings: () => Promise<void>;
    loadUpcomingMeetings: () => Promise<void>;
    loadMeeting: (id: string) => Promise<void>;
    addMeeting: (meeting: Omit<Meeting, 'id' | 'createdAt' | 'updatedAt'>, participantIds: string[]) => Promise<string>;
    editMeeting: (id: string, updates: Partial<Meeting>) => Promise<void>;
    removeMeeting: (id: string) => Promise<void>;

    // Utilities
    clearError: () => void;
    clearCurrentMeeting: () => void;
}

export const useMeetingStore = create<MeetingState>((set, get) => ({
    // Initial state
    meetings: [],
    upcomingMeetings: [],
    currentMeeting: null,
    isLoading: false,
    error: null,

    // Load all meetings
    loadMeetings: async () => {
        set({ isLoading: true, error: null });
        try {
            const meetings = await getAllMeetings();
            set({ meetings, isLoading: false });
        } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
        }
    },

    // Load upcoming meetings
    loadUpcomingMeetings: async () => {
        set({ isLoading: true, error: null });
        try {
            const upcomingMeetings = await getUpcomingMeetings();
            set({ upcomingMeetings, isLoading: false });
        } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
        }
    },

    // Load single meeting with participants
    loadMeeting: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            const meeting = await getMeeting(id);
            if (!meeting) {
                set({ error: 'Meeting not found', isLoading: false });
                return;
            }

            const participants = await getMeetingParticipants(id);

            set({
                currentMeeting: { ...meeting, participants },
                isLoading: false
            });
        } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
        }
    },

    // Add new meeting
    addMeeting: async (meetingData, participantIds) => {
        set({ isLoading: true, error: null });
        try {
            const id = await createMeeting(meetingData, participantIds);
            await get().loadMeetings();
            await get().loadUpcomingMeetings();
            set({ isLoading: false });
            return id;
        } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
            throw error;
        }
    },

    // Edit meeting
    editMeeting: async (id, updates) => {
        set({ isLoading: true, error: null });
        try {
            await updateMeeting(id, updates);
            await get().loadMeetings();
            await get().loadUpcomingMeetings();
            if (get().currentMeeting?.id === id) {
                await get().loadMeeting(id);
            }
            set({ isLoading: false });
        } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
            throw error;
        }
    },

    // Remove meeting
    removeMeeting: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await deleteMeeting(id);
            set({ currentMeeting: null });
            await get().loadMeetings();
            await get().loadUpcomingMeetings();
            set({ isLoading: false });
        } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
            throw error;
        }
    },

    // Utilities
    clearError: () => set({ error: null }),
    clearCurrentMeeting: () => set({ currentMeeting: null })
}));
