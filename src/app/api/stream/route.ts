import { NextRequest, NextResponse } from 'next/server';

// Proxy video streams from the IPTV server through Next.js
// This avoids CORS, mixed-content, and connection issues in the browser

const BASE_URL = process.env.XTREAM_BASE_URL || 'http://plus.kurdcinema.krd:25461';
const USERNAME = process.env.XTREAM_USERNAME || 'test';
const PASSWORD = process.env.XTREAM_PASSWORD || 'test1234';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'movie' or 'series'
    const id = searchParams.get('id');
    const ext = searchParams.get('ext') || 'mp4';

    if (!type || !id) {
        return NextResponse.json({ error: 'Missing type or id parameter' }, { status: 400 });
    }

    const streamUrl = `${BASE_URL}/${type}/${USERNAME}/${PASSWORD}/${id}.${ext}`;

    try {
        // Get range header from the client request for seeking support
        const rangeHeader = request.headers.get('range');

        const headers: Record<string, string> = {};
        if (rangeHeader) {
            headers['Range'] = rangeHeader;
        }

        const response = await fetch(streamUrl, { headers });

        // Build response headers
        const responseHeaders = new Headers();
        responseHeaders.set('Content-Type', response.headers.get('Content-Type') || 'video/mp4');
        responseHeaders.set('Accept-Ranges', 'bytes');

        if (response.headers.get('Content-Length')) {
            responseHeaders.set('Content-Length', response.headers.get('Content-Length')!);
        }
        if (response.headers.get('Content-Range')) {
            responseHeaders.set('Content-Range', response.headers.get('Content-Range')!);
        }

        // Stream the response body
        return new NextResponse(response.body, {
            status: response.status,
            headers: responseHeaders,
        });
    } catch (error) {
        console.error('Stream proxy error:', error);
        return NextResponse.json({ error: 'Failed to proxy stream' }, { status: 500 });
    }
}
