import Dexie, { type Table } from 'dexie';
import type {
    Person,
    ContactMethod,
    ImportantDate,
    Interaction,
    Meeting,
    MeetingParticipant,
    NotificationRule,
    NotificationLog
} from './types';

// Database class extending Dexie
export class PplERPDatabase extends Dexie {
    // Declare tables
    persons!: Table<Person, string>;
    contactMethods!: Table<ContactMethod, string>;
    importantDates!: Table<ImportantDate, string>;
    interactions!: Table<Interaction, string>;
    meetings!: Table<Meeting, string>;
    meetingParticipants!: Table<MeetingParticipant, string>;
    notificationRules!: Table<NotificationRule, string>;
    notificationLogs!: Table<NotificationLog, string>;

    constructor() {
        super('pplERP');

        // Schema version 1
        this.version(1).stores({
            // Primary key is 'id', indexed fields follow
            persons: 'id, fullName, relationshipType, importance, lastInteractionAt, createdAt',
            contactMethods: 'id, personId, type, value',
            importantDates: 'id, personId, date, type',
            interactions: 'id, personId, type, timestamp',
            meetings: 'id, datetime, createdAt',
            meetingParticipants: 'id, meetingId, personId, [meetingId+personId]',
            notificationRules: 'id, personId, type, enabled',
            notificationLogs: 'id, personId, meetingId, type, triggerTime, deliveredAt'
        });
    }
}

// Singleton database instance
export const db = new PplERPDatabase();

// ============ PERSON OPERATIONS ============

export async function createPerson(person: Omit<Person, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const now = new Date().toISOString();
    const id = crypto.randomUUID();

    await db.persons.add({
        ...person,
        id,
        createdAt: now,
        updatedAt: now
    });

    return id;
}

export async function updatePerson(id: string, updates: Partial<Person>): Promise<void> {
    await db.persons.update(id, {
        ...updates,
        updatedAt: new Date().toISOString()
    });
}

export async function deletePerson(id: string): Promise<void> {
    await db.transaction('rw', [
        db.persons,
        db.contactMethods,
        db.importantDates,
        db.interactions,
        db.meetingParticipants,
        db.notificationRules,
        db.notificationLogs
    ], async () => {
        // Delete all related data
        await db.contactMethods.where('personId').equals(id).delete();
        await db.importantDates.where('personId').equals(id).delete();
        await db.interactions.where('personId').equals(id).delete();
        await db.meetingParticipants.where('personId').equals(id).delete();
        await db.notificationRules.where('personId').equals(id).delete();
        await db.notificationLogs.where('personId').equals(id).delete();
        // Delete person
        await db.persons.delete(id);
    });
}

export async function getPerson(id: string): Promise<Person | undefined> {
    return db.persons.get(id);
}

export async function getAllPersons(): Promise<Person[]> {
    return db.persons.orderBy('fullName').toArray();
}

export async function searchPersons(query: string): Promise<Person[]> {
    const lowerQuery = query.toLowerCase();
    return db.persons
        .filter(person =>
            person.fullName.toLowerCase().includes(lowerQuery) ||
            (person.preferredName?.toLowerCase().includes(lowerQuery) ?? false) ||
            (person.organization?.toLowerCase().includes(lowerQuery) ?? false)
        )
        .toArray();
}

// ============ CONTACT METHOD OPERATIONS ============

export async function addContactMethod(method: Omit<ContactMethod, 'id' | 'createdAt'>): Promise<string> {
    const id = crypto.randomUUID();
    await db.contactMethods.add({
        ...method,
        id,
        createdAt: new Date().toISOString()
    });
    return id;
}

export async function getContactMethods(personId: string): Promise<ContactMethod[]> {
    return db.contactMethods.where('personId').equals(personId).toArray();
}

export async function deleteContactMethod(id: string): Promise<void> {
    await db.contactMethods.delete(id);
}

// ============ IMPORTANT DATE OPERATIONS ============

export async function addImportantDate(date: Omit<ImportantDate, 'id' | 'createdAt'>): Promise<string> {
    const id = crypto.randomUUID();
    await db.importantDates.add({
        ...date,
        id,
        createdAt: new Date().toISOString()
    });
    return id;
}

export async function getImportantDates(personId: string): Promise<ImportantDate[]> {
    return db.importantDates.where('personId').equals(personId).toArray();
}

export async function getAllImportantDates(): Promise<ImportantDate[]> {
    return db.importantDates.toArray();
}

export async function deleteImportantDate(id: string): Promise<void> {
    await db.importantDates.delete(id);
}

// ============ INTERACTION OPERATIONS ============

export async function addInteraction(interaction: Omit<Interaction, 'id' | 'createdAt'>): Promise<string> {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    await db.transaction('rw', [db.interactions, db.persons], async () => {
        await db.interactions.add({
            ...interaction,
            id,
            createdAt: now
        });

        // Update person's last interaction
        await db.persons.update(interaction.personId, {
            lastInteractionAt: interaction.timestamp,
            updatedAt: now
        });
    });

    return id;
}

export async function getInteractions(personId: string): Promise<Interaction[]> {
    return db.interactions
        .where('personId')
        .equals(personId)
        .reverse()
        .sortBy('timestamp');
}

export async function deleteInteraction(id: string): Promise<void> {
    await db.interactions.delete(id);
}

// ============ MEETING OPERATIONS ============

export async function createMeeting(
    meeting: Omit<Meeting, 'id' | 'createdAt' | 'updatedAt'>,
    participantIds: string[]
): Promise<string> {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    await db.transaction('rw', [db.meetings, db.meetingParticipants], async () => {
        await db.meetings.add({
            ...meeting,
            id,
            createdAt: now,
            updatedAt: now
        });

        // Add participants
        for (const personId of participantIds) {
            await db.meetingParticipants.add({
                id: crypto.randomUUID(),
                meetingId: id,
                personId,
                createdAt: now
            });
        }
    });

    return id;
}

export async function getMeeting(id: string): Promise<Meeting | undefined> {
    return db.meetings.get(id);
}

export async function updateMeeting(id: string, updates: Partial<Meeting>): Promise<void> {
    await db.meetings.update(id, {
        ...updates,
        updatedAt: new Date().toISOString()
    });
}

export async function getAllMeetings(): Promise<Meeting[]> {
    return db.meetings.orderBy('datetime').toArray();
}

export async function getUpcomingMeetings(): Promise<Meeting[]> {
    const now = new Date().toISOString();
    return db.meetings
        .where('datetime')
        .above(now)
        .sortBy('datetime');
}

export async function getMeetingParticipants(meetingId: string): Promise<Person[]> {
    const participants = await db.meetingParticipants
        .where('meetingId')
        .equals(meetingId)
        .toArray();

    const personIds = participants.map(p => p.personId);
    return db.persons.where('id').anyOf(personIds).toArray();
}

export async function deleteMeeting(id: string): Promise<void> {
    await db.transaction('rw', [db.meetings, db.meetingParticipants, db.notificationLogs], async () => {
        await db.meetingParticipants.where('meetingId').equals(id).delete();
        await db.notificationLogs.where('meetingId').equals(id).delete();
        await db.meetings.delete(id);
    });
}

// ============ NOTIFICATION OPERATIONS ============

export async function createNotificationRule(rule: Omit<NotificationRule, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    await db.notificationRules.add({
        ...rule,
        id,
        createdAt: now,
        updatedAt: now
    });

    return id;
}

export async function getNotificationRules(personId?: string): Promise<NotificationRule[]> {
    if (personId) {
        return db.notificationRules.where('personId').equals(personId).toArray();
    }
    return db.notificationRules.toArray();
}

export async function logNotification(log: Omit<NotificationLog, 'id' | 'createdAt'>): Promise<string> {
    const id = crypto.randomUUID();

    await db.notificationLogs.add({
        ...log,
        id,
        createdAt: new Date().toISOString()
    });

    return id;
}

export async function hasNotificationBeenSent(
    type: NotificationLog['type'],
    personId: string | undefined,
    meetingId: string | undefined,
    triggerTime: string
): Promise<boolean> {
    const query = db.notificationLogs
        .where('type').equals(type)
        .and(log => log.triggerTime === triggerTime);

    if (personId) {
        return (await query.and(log => log.personId === personId).count()) > 0;
    }
    if (meetingId) {
        return (await query.and(log => log.meetingId === meetingId).count()) > 0;
    }

    return false;
}

// ============ STATS ============

export async function getStats(): Promise<{
    totalPersons: number;
    totalMeetings: number;
    upcomingMeetings: number;
    totalInteractions: number;
}> {
    const now = new Date().toISOString();

    const [totalPersons, totalMeetings, upcomingMeetings, totalInteractions] = await Promise.all([
        db.persons.count(),
        db.meetings.count(),
        db.meetings.where('datetime').above(now).count(),
        db.interactions.count()
    ]);

    return { totalPersons, totalMeetings, upcomingMeetings, totalInteractions };
}

// Export database instance for direct access if needed
export default db;
