// Database type definitions for pplERP

// ============ ENUMS (as const objects for erasableSyntaxOnly) ============

export const RelationshipType = {
    FRIEND: 'friend',
    MENTOR: 'mentor',
    COLLEAGUE: 'colleague',
    CLIENT: 'client',
    FAMILY: 'family',
    COMMUNITY: 'community',
    OTHER: 'other'
} as const;
export type RelationshipType = typeof RelationshipType[keyof typeof RelationshipType];

export const InteractionType = {
    CALL: 'call',
    MEETING: 'meeting',
    EVENT: 'event',
    CHAT: 'chat',
    FOLLOW_UP: 'follow_up'
} as const;
export type InteractionType = typeof InteractionType[keyof typeof InteractionType];

export const OutcomeType = {
    POSITIVE: 'positive',
    NEUTRAL: 'neutral',
    PENDING: 'pending'
} as const;
export type OutcomeType = typeof OutcomeType[keyof typeof OutcomeType];

export const ContactType = {
    PHONE: 'phone',
    EMAIL: 'email',
    LINKEDIN: 'linkedin',
    INSTAGRAM: 'instagram',
    GITHUB: 'github',
    OTHER: 'other'
} as const;
export type ContactType = typeof ContactType[keyof typeof ContactType];

export const DateType = {
    BIRTHDAY: 'birthday',
    ANNIVERSARY: 'anniversary',
    CUSTOM: 'custom'
} as const;
export type DateType = typeof DateType[keyof typeof DateType];

export const NotificationType = {
    MEETING: 'meeting',
    BIRTHDAY: 'birthday',
    OCCASION: 'occasion',
    FOLLOW_UP: 'follow_up'
} as const;
export type NotificationType = typeof NotificationType[keyof typeof NotificationType];

// ============ INTERFACES ============

export interface Person {
    id: string;
    fullName: string;
    preferredName?: string;
    relationshipType: RelationshipType;
    importance: number; // 1-5
    firstMetDate?: string; // ISO 8601
    howMet?: string;
    profession?: string;
    organization?: string;
    hometown?: string;
    currentCity?: string;
    strengths?: string;
    skills?: string;
    bestAt?: string;
    notes?: string;
    lastInteractionAt?: string; // ISO 8601
    createdAt: string; // ISO 8601
    updatedAt: string; // ISO 8601
}

export interface ContactMethod {
    id: string;
    personId: string;
    type: ContactType;
    label?: string; // e.g., "Work", "Personal"
    value: string;
    isPrimary: boolean;
    createdAt: string;
}

export interface ImportantDate {
    id: string;
    personId: string;
    date: string; // ISO 8601 (YYYY-MM-DD)
    type: DateType;
    label?: string; // For custom dates
    recurring: boolean;
    remindBeforeDays: number;
    createdAt: string;
}

export interface Interaction {
    id: string;
    personId: string;
    type: InteractionType;
    timestamp: string; // ISO 8601
    outcome: OutcomeType;
    notes?: string;
    createdAt: string;
}

export interface Meeting {
    id: string;
    title: string;
    datetime: string; // ISO 8601
    agenda?: string;
    notes?: string;
    reminderOffsets: number[]; // Minutes before meeting (e.g., [1440, 60] for 1 day + 1 hour)
    createdAt: string;
    updatedAt: string;
}

export interface MeetingParticipant {
    id: string;
    meetingId: string;
    personId: string;
    createdAt: string;
}

export interface NotificationRule {
    id: string;
    personId?: string; // Optional - if null, applies globally
    type: NotificationType;
    enabled: boolean;
    offsets: number[]; // Days for birthdays/occasions, minutes for meetings
    quietHoursStart?: string; // HH:mm format (future)
    quietHoursEnd?: string; // HH:mm format (future)
    createdAt: string;
    updatedAt: string;
}

export interface NotificationLog {
    id: string;
    personId?: string;
    meetingId?: string;
    ruleId?: string;
    type: NotificationType;
    triggerTime: string; // ISO 8601
    deliveredAt?: string; // ISO 8601
    title: string;
    body: string;
    createdAt: string;
}

// ============ HELPER TYPES ============

export type PersonInput = Omit<Person, 'id' | 'createdAt' | 'updatedAt' | 'lastInteractionAt'>;
export type PersonUpdate = Partial<PersonInput>;

export type ContactMethodInput = Omit<ContactMethod, 'id' | 'createdAt'>;
export type ImportantDateInput = Omit<ImportantDate, 'id' | 'createdAt'>;
export type InteractionInput = Omit<Interaction, 'id' | 'createdAt'>;
export type MeetingInput = Omit<Meeting, 'id' | 'createdAt' | 'updatedAt'>;

// ============ DISPLAY HELPERS ============

export const RELATIONSHIP_TYPE_LABELS: Record<RelationshipType, string> = {
    [RelationshipType.FRIEND]: 'Friend',
    [RelationshipType.MENTOR]: 'Mentor',
    [RelationshipType.COLLEAGUE]: 'Colleague',
    [RelationshipType.CLIENT]: 'Client',
    [RelationshipType.FAMILY]: 'Family',
    [RelationshipType.COMMUNITY]: 'Community',
    [RelationshipType.OTHER]: 'Other'
};

export const INTERACTION_TYPE_LABELS: Record<InteractionType, string> = {
    [InteractionType.CALL]: 'Call',
    [InteractionType.MEETING]: 'Meeting',
    [InteractionType.EVENT]: 'Event',
    [InteractionType.CHAT]: 'Chat',
    [InteractionType.FOLLOW_UP]: 'Follow-up'
};

export const OUTCOME_TYPE_LABELS: Record<OutcomeType, string> = {
    [OutcomeType.POSITIVE]: 'Positive',
    [OutcomeType.NEUTRAL]: 'Neutral',
    [OutcomeType.PENDING]: 'Pending'
};

export const CONTACT_TYPE_LABELS: Record<ContactType, string> = {
    [ContactType.PHONE]: 'Phone',
    [ContactType.EMAIL]: 'Email',
    [ContactType.LINKEDIN]: 'LinkedIn',
    [ContactType.INSTAGRAM]: 'Instagram',
    [ContactType.GITHUB]: 'GitHub',
    [ContactType.OTHER]: 'Other'
};

export const DATE_TYPE_LABELS: Record<DateType, string> = {
    [DateType.BIRTHDAY]: 'Birthday',
    [DateType.ANNIVERSARY]: 'Anniversary',
    [DateType.CUSTOM]: 'Custom'
};

export const IMPORTANCE_LABELS: Record<number, string> = {
    1: 'Low',
    2: 'Below Average',
    3: 'Average',
    4: 'High',
    5: 'Critical'
};
