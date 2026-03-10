const http = require('http');

async function test() {
    try {
        // 1. Login to get token
        const loginRes = await fetch('http://localhost:80/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'test@example.com', password: 'password123' })
        });

        // In case test user doesn't exist, let's register
        let cookie = loginRes.headers.get('set-cookie');

        if (!loginRes.ok) {
            const regRes = await fetch('http://localhost:80/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: 'test_report@example.com', username: 'test_report', password: 'password123' })
            });
            cookie = regRes.headers.get('set-cookie');
            console.log("Register response:", await regRes.text());
        } else {
            console.log("Login response:", await loginRes.text());
        }

        if (!cookie) {
            console.log('No cookie received!');
            return;
        }

        // Extract just the session cookie for the next request
        const sessionToken = cookie.split(';').find(c => c.includes('seven_stream_session'));

        // 2. Submit report
        const reportRes = await fetch('http://localhost:80/api/reports', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': sessionToken
            },
            body: JSON.stringify({
                contentId: '123',
                contentType: 'movie',
                contentTitle: 'Test Movie',
                issueType: 'Server not working',
                details: 'Testing'
            })
        });

        const reportBody = await reportRes.text();
        console.log(`Report Status: ${reportRes.status}`);
        console.log(`Report Body: ${reportBody}`);

    } catch (e) {
        console.error(e);
    }
}

test();
