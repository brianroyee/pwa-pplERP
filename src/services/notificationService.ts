import {
    getUpcomingMeetings,
    getAllImportantDates,
    getAllPersons,
    logNotification,
    hasNotificationBeenSent
} from '../db';
import { DateType, NotificationType } from '../db/types';
import { addMinutes, isAfter, isBefore, format } from 'date-fns';

export async function evaluateNotifications() {
    const now = new Date();

    // 1. Check Meeting Reminders
    const upcomingMeetings = await getUpcomingMeetings();
    for (const meeting of upcomingMeetings) {
        const meetingTime = new Date(meeting.datetime);

        for (const offset of meeting.reminderOffsets) {
            const triggerTime = addMinutes(meetingTime, -offset);

            // If trigger time is in the past (but not too far, e.g., last 30 mins)
            // and we haven't sent it yet
            if (isBefore(triggerTime, now) && isAfter(triggerTime, addMinutes(now, -30))) {
                const alreadySent = await hasNotificationBeenSent(
                    NotificationType.MEETING,
                    undefined,
                    meeting.id,
                    triggerTime.toISOString()
                );

                if (!alreadySent) {
                    await sendLocalNotification({
                        title: `Meeting Reminder: ${meeting.title}`,
                        body: `Starting at ${format(meetingTime, 'HH:mm')}`,
                        data: { url: `/meetings/${meeting.id}` }
                    });

                    await logNotification({
                        meetingId: meeting.id,
                        type: NotificationType.MEETING,
                        triggerTime: triggerTime.toISOString(),
                        title: meeting.title,
                        body: `Starting soon`
                    });
                }
            }
        }
    }

    // 2. Check Birthdays & Anniversaries
    const importantDates = await getAllImportantDates();
    const todayStr = format(now, 'MM-DD');

    for (const date of importantDates) {
        const eventDate = new Date(date.date);
        const eventMonthDay = format(eventDate, 'MM-DD');

        if (eventMonthDay === todayStr) {
            const triggerTimePrefix = format(now, 'yyyy-MM-dd'); // One per day

            const alreadySent = await hasNotificationBeenSent(
                date.type === DateType.BIRTHDAY ? NotificationType.BIRTHDAY : NotificationType.OCCASION,
                date.personId,
                undefined,
                triggerTimePrefix
            );

            if (!alreadySent) {
                const person = await (await import('../db')).getPerson(date.personId);
                const name = person?.preferredName || person?.fullName || 'Someone';
                const label = date.type === DateType.BIRTHDAY ? 'Birthday' : (date.label || 'Special Occasion');

                await sendLocalNotification({
                    title: `${label} Today!`,
                    body: `It's ${name}'s ${label.toLowerCase()}. Reach out!`,
                    data: { url: `/people/${date.personId}` }
                });

                await logNotification({
                    personId: date.personId,
                    type: date.type === DateType.BIRTHDAY ? NotificationType.BIRTHDAY : NotificationType.OCCASION,
                    triggerTime: triggerTimePrefix,
                    title: `${label} Today`,
                    body: `Message ${name}`
                });
            }
        }
    }

    // 3. Check Follow-up Nudges (30 days)
    const persons = await getAllPersons();
    for (const person of persons) {
        const lastInteraction = person.lastInteractionAt ? new Date(person.lastInteractionAt) : new Date(person.createdAt);
        const thirtyDaysAgo = addMinutes(now, -30 * 24 * 60);

        if (isBefore(lastInteraction, thirtyDaysAgo)) {
            // Only notify once a week for follow-ups
            const weekPrefix = format(now, 'yyyy-ww');

            const alreadySent = await hasNotificationBeenSent(
                NotificationType.FOLLOW_UP,
                person.id,
                undefined,
                weekPrefix
            );

            if (!alreadySent) {
                await sendLocalNotification({
                    title: `Follow up with ${person.preferredName || person.fullName}`,
                    body: `It's been a while since your last interaction.`,
                    data: { url: `/people/${person.id}` }
                });

                await logNotification({
                    personId: person.id,
                    type: NotificationType.FOLLOW_UP,
                    triggerTime: weekPrefix,
                    title: 'Follow up nudge',
                    body: `Check in with ${person.fullName}`
                });
            }
        }
    }
}

async function sendLocalNotification({ title, body, data }: { title: string, body: string, data?: any }) {
    if (!('Notification' in window)) return;

    if (Notification.permission === 'granted') {
        const registration = await navigator.serviceWorker.ready;
        registration.showNotification(title, {
            body,
            icon: '/favicon.svg',
            badge: '/favicon.svg',
            data
        });
    }
}
