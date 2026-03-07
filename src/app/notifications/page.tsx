'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Notification {
    _id: string;
    type: string;
    message: string;
    read: boolean;
    createdAt: string;
}

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchNotifications() {
            try {
                const res = await fetch('/api/notifications');
                if (res.ok) {
                    const data = await res.json();
                    setNotifications(data.notifications || []);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchNotifications();
    }, []);

    const markAsRead = async (id: string) => {
        try {
            await fetch(`/api/notifications/${id}/read`, { method: 'POST' });
            setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto py-10 px-6">
            <h1 className="text-3xl font-bold mb-8">Notifications</h1>
            <div className="grid gap-4">
                {notifications.length === 0 ? (
                    <Card>
                        <CardContent className="p-10 text-center text-gray-500">
                            No notifications yet.
                        </CardContent>
                    </Card>
                ) : (
                    notifications.map((n) => (
                        <Card key={n._id} className={n.read ? 'opacity-60' : 'border-l-4 border-blue-500'}>
                            <CardContent className="p-6 flex justify-between items-center">
                                <div>
                                    <Badge variant="secondary" className="mb-2">{n.type.replace('_', ' ').toUpperCase()}</Badge>
                                    <p className="text-lg">{n.message}</p>
                                    <p className="text-sm text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                                </div>
                                {!n.read && (
                                    <button
                                        onClick={() => markAsRead(n._id)}
                                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition"
                                    >
                                        Mark as read
                                    </button>
                                )}
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
