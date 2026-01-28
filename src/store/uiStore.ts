import { create } from 'zustand';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
    id: string;
    type: ToastType;
    message: string;
}

interface UIState {
    // Toast notifications
    toasts: Toast[];
    addToast: (type: ToastType, message: string) => void;
    removeToast: (id: string) => void;

    // Modal state
    isModalOpen: boolean;
    modalContent: React.ReactNode | null;
    openModal: (content: React.ReactNode) => void;
    closeModal: () => void;

    // Sidebar/Navigation
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
    closeSidebar: () => void;
}

export const useUIStore = create<UIState>((set, get) => ({
    // Toast state
    toasts: [],

    addToast: (type, message) => {
        const id = crypto.randomUUID();
        set(state => ({
            toasts: [...state.toasts, { id, type, message }]
        }));

        // Auto-remove after 4 seconds
        setTimeout(() => {
            get().removeToast(id);
        }, 4000);
    },

    removeToast: (id) => {
        set(state => ({
            toasts: state.toasts.filter(t => t.id !== id)
        }));
    },

    // Modal state
    isModalOpen: false,
    modalContent: null,

    openModal: (content) => {
        set({ isModalOpen: true, modalContent: content });
    },

    closeModal: () => {
        set({ isModalOpen: false, modalContent: null });
    },

    // Sidebar state
    isSidebarOpen: false,

    toggleSidebar: () => {
        set(state => ({ isSidebarOpen: !state.isSidebarOpen }));
    },

    closeSidebar: () => {
        set({ isSidebarOpen: false });
    }
}));

// Helper hooks for common actions
export const useToast = () => {
    const addToast = useUIStore(state => state.addToast);

    return {
        success: (message: string) => addToast('success', message),
        error: (message: string) => addToast('error', message),
        warning: (message: string) => addToast('warning', message),
        info: (message: string) => addToast('info', message)
    };
};
