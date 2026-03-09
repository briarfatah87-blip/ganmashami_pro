const http = require('http');

async function testLogin() {
    try {
        console.log("Attempting to log in as bryar...");
        const res = await fetch('http://localhost:3009/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'bryar.fata7@gmail.com', password: 'password123' }) // We don't know the exact password, but we can see the server response.
        });

        const body = await res.text();
        console.log(`Status: ${res.status}`);
        console.log(`Body: ${body}`);
    } catch (e) {
        console.error("Fetch error:", e);
    }
}

testLogin();
