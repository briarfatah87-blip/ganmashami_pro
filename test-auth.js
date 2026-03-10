async function testAuth() {
    try {
        const ts = Date.now();
        const email = `testuser_${ts}@example.com`;
        const username = `testuser_${ts}`;
        const password = 'password123';

        console.log(`Registering ${email}...`);
        const regRes = await fetch('http://localhost:80/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, username, password })
        });
        console.log(`Register Status: ${regRes.status}`);
        console.log(`Register Body: ${await regRes.text()}`);

        console.log(`\nLogging in ${email}...`);
        const loginRes = await fetch('http://localhost:80/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        console.log(`Login Status: ${loginRes.status}`);
        console.log(`Login Body: ${await loginRes.text()}`);

    } catch (e) {
        console.error("Fetch error:", e);
    }
}

testAuth();
