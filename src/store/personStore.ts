import { create } from 'zustand';
import type { Person, ContactMethod, ImportantDate } from '../db/types';
import {
    createPerson,
    updatePerson,
    deletePerson,
    getPerson,
    getAllPersons,
    searchPersons,
    addContactMethod,
    getContactMethods,
    deleteContactMethod,
    addImportantDate,
    getImportantDates,
    deleteImportantDate
} from '../db';

interface PersonState {
    // Data
    persons: Person[];
    currentPerson: Person | null;
    currentContactMethods: ContactMethod[];
    currentImportantDates: ImportantDate[];

    // UI state
    isLoading: boolean;
    error: string | null;
    searchQuery: string;

    // Actions
    loadPersons: () => Promise<void>;
    loadPerson: (id: string) => Promise<void>;
    addPerson: (person: Omit<Person, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
    editPerson: (id: string, updates: Partial<Person>) => Promise<void>;
    removePerson: (id: string) => Promise<void>;
    search: (query: string) => Promise<void>;

    // Contact methods
    loadContactMethods: (personId: string) => Promise<void>;
    addContact: (method: Omit<ContactMethod, 'id' | 'createdAt'>) => Promise<void>;
    removeContact: (id: string) => Promise<void>;

    // Important dates
    loadImportantDates: (personId: string) => Promise<void>;
    addDate: (date: Omit<ImportantDate, 'id' | 'createdAt'>) => Promise<void>;
    removeDate: (id: string) => Promise<void>;

    // Utilities
    clearError: () => void;
    clearCurrentPerson: () => void;
}

export const usePersonStore = create<PersonState>((set, get) => ({
    // Initial state
    persons: [],
    currentPerson: null,
    currentContactMethods: [],
    currentImportantDates: [],
    isLoading: false,
    error: null,
    searchQuery: '',

    // Load all persons
    loadPersons: async () => {
        set({ isLoading: true, error: null });
        try {
            const persons = await getAllPersons();
            set({ persons, isLoading: false });
        } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
        }
    },

    // Load single person with related data
    loadPerson: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            const person = await getPerson(id);
            if (!person) {
                set({ error: 'Person not found', isLoading: false });
                return;
            }

            const [contactMethods, importantDates] = await Promise.all([
                getContactMethods(id),
                getImportantDates(id)
            ]);

            set({
                currentPerson: person,
                currentContactMethods: contactMethods,
                currentImportantDates: importantDates,
                isLoading: false
            });
        } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
        }
    },

    // Add new person
    addPerson: async (personData) => {
        set({ isLoading: true, error: null });
        try {
            const id = await createPerson(personData);
            await get().loadPersons();
            set({ isLoading: false });
            return id;
        } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
            throw error;
        }
    },

    // Edit person
    editPerson: async (id, updates) => {
        set({ isLoading: true, error: null });
        try {
            await updatePerson(id, updates);

            // Reload current person if it's the one being edited
            if (get().currentPerson?.id === id) {
                await get().loadPerson(id);
            }

            await get().loadPersons();
            set({ isLoading: false });
        } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
            throw error;
        }
    },

    // Remove person
    removePerson: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await deletePerson(id);
            set({ currentPerson: null, currentContactMethods: [], currentImportantDates: [] });
            await get().loadPersons();
            set({ isLoading: false });
        } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
            throw error;
        }
    },

    // Search persons
    search: async (query: string) => {
        set({ searchQuery: query, isLoading: true });
        try {
            const persons = query ? await searchPersons(query) : await getAllPersons();
            set({ persons, isLoading: false });
        } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
        }
    },

    // Contact methods
    loadContactMethods: async (personId: string) => {
        try {
            const contactMethods = await getContactMethods(personId);
            set({ currentContactMethods: contactMethods });
        } catch (error) {
            set({ error: (error as Error).message });
        }
    },

    addContact: async (method) => {
        try {
            await addContactMethod(method);
            await get().loadContactMethods(method.personId);
        } catch (error) {
            set({ error: (error as Error).message });
            throw error;
        }
    },

    removeContact: async (id: string) => {
        try {
            const method = get().currentContactMethods.find(m => m.id === id);
            await deleteContactMethod(id);
            if (method) {
                await get().loadContactMethods(method.personId);
            }
        } catch (error) {
            set({ error: (error as Error).message });
            throw error;
        }
    },

    // Important dates
    loadImportantDates: async (personId: string) => {
        try {
            const importantDates = await getImportantDates(personId);
            set({ currentImportantDates: importantDates });
        } catch (error) {
            set({ error: (error as Error).message });
        }
    },

    addDate: async (date) => {
        try {
            await addImportantDate(date);
            await get().loadImportantDates(date.personId);
        } catch (error) {
            set({ error: (error as Error).message });
            throw error;
        }
    },

    removeDate: async (id: string) => {
        try {
            const date = get().currentImportantDates.find(d => d.id === id);
            await deleteImportantDate(id);
            if (date) {
                await get().loadImportantDates(date.personId);
            }
        } catch (error) {
            set({ error: (error as Error).message });
            throw error;
        }
    },

    // Utilities
    clearError: () => set({ error: null }),
    clearCurrentPerson: () => set({
        currentPerson: null,
        currentContactMethods: [],
        currentImportantDates: []
    })
}));
