export async function sendNotification(
    title: string,
    message: string,
    type: 'system' | 'new_release' | 'recommendation' | 'update' = 'system',
    link?: string
) {
    try {
        const response = await fetch('/api/notifications', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title,
                message,
                type,
                link,
            }),
        })

        if (!response.ok) {
            throw new Error('Failed to send notification')
        }

        return await response.json()
    } catch (error) {
        console.error('Error sending notification:', error)
        return null
    }
}
