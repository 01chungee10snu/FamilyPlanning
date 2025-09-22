/**
 * Development Server Configuration
 * Simple static file server with ES6 module support
 *
 * Usage:
 * - Run: node dev-server.config.js
 * - Or via npm: npm run dev
 * - Serves files from current directory on port 8080
 * - Auto-opens browser to presentation
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Server configuration
const PORT = 8080;
const HOST = 'localhost';
const AUTO_OPEN = true;

// MIME type mapping for ES6 modules
const MIME_TYPES = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.mjs': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.pdf': 'application/pdf'
};

// CORS headers for local development
const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '3600'
};

/**
 * Get MIME type for file extension
 */
function getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return MIME_TYPES[ext] || 'application/octet-stream';
}

/**
 * Serve static files with proper headers
 */
function serveStaticFile(filePath, response) {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                response.writeHead(404, { 'Content-Type': 'text/html' });
                response.end(`
                    <html>
                        <head><title>404 - File Not Found</title></head>
                        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
                            <h1>404 - File Not Found</h1>
                            <p>The requested file <code>${filePath}</code> was not found.</p>
                            <a href="/">Return to presentation</a>
                        </body>
                    </html>
                `);
            } else {
                response.writeHead(500, { 'Content-Type': 'text/plain' });
                response.end('Internal Server Error');
            }
            console.error(`Error serving ${filePath}:`, err.message);
            return;
        }

        const mimeType = getMimeType(filePath);
        const headers = {
            'Content-Type': mimeType,
            ...CORS_HEADERS
        };

        // Add cache control for static assets
        if (mimeType.startsWith('image/') || mimeType.startsWith('font/')) {
            headers['Cache-Control'] = 'public, max-age=3600'; // 1 hour
        } else if (mimeType === 'application/javascript' || mimeType === 'text/css') {
            headers['Cache-Control'] = 'no-cache'; // Always check for updates during development
        }

        response.writeHead(200, headers);
        response.end(data);

        console.log(`${new Date().toLocaleTimeString()} - Served: ${filePath} (${mimeType})`);
    });
}

/**
 * Create and configure the development server
 */
const server = http.createServer((request, response) => {
    // Handle preflight OPTIONS requests
    if (request.method === 'OPTIONS') {
        response.writeHead(200, CORS_HEADERS);
        response.end();
        return;
    }

    // Parse URL and determine file path
    let urlPath = request.url;

    // Remove query parameters
    const queryIndex = urlPath.indexOf('?');
    if (queryIndex !== -1) {
        urlPath = urlPath.substring(0, queryIndex);
    }

    // Default to index.html for root requests
    if (urlPath === '/') {
        urlPath = '/index.html';
    }

    // Security: prevent directory traversal
    const safePath = path.normalize(urlPath).replace(/^(\.\.[\/\\])+/, '');
    const filePath = path.join(__dirname, safePath);

    // Ensure file is within project directory
    if (!filePath.startsWith(__dirname)) {
        response.writeHead(403, { 'Content-Type': 'text/plain' });
        response.end('Access Denied');
        return;
    }

    // Check if file exists and serve it
    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            // Try with .html extension for clean URLs
            const htmlPath = filePath + '.html';
            fs.stat(htmlPath, (htmlErr, htmlStats) => {
                if (!htmlErr && htmlStats.isFile()) {
                    serveStaticFile(htmlPath, response);
                } else {
                    serveStaticFile(filePath, response); // Will return 404
                }
            });
        } else {
            serveStaticFile(filePath, response);
        }
    });
});

/**
 * Start the development server
 */
server.listen(PORT, HOST, () => {
    const url = `http://${HOST}:${PORT}`;

    console.log('='.repeat(50));
    console.log('Family Planning Presentation - Development Server');
    console.log('='.repeat(50));
    console.log(`Server running at: ${url}`);
    console.log(`Serving files from: ${__dirname}`);
    console.log(`ES6 modules: Enabled`);
    console.log(`CORS: Enabled`);
    console.log('='.repeat(50));
    console.log('Press Ctrl+C to stop the server');
    console.log('');

    // Auto-open browser
    if (AUTO_OPEN) {
        const openCommand = process.platform === 'win32' ? 'start' :
                          process.platform === 'darwin' ? 'open' : 'xdg-open';

        exec(`${openCommand} ${url}`, (error) => {
            if (error) {
                console.log(`To view the presentation, open: ${url}`);
            } else {
                console.log('Opening presentation in default browser...');
            }
        });
    }
});

/**
 * Graceful shutdown handling
 */
process.on('SIGINT', () => {
    console.log('\nShutting down development server...');
    server.close(() => {
        console.log('Development server stopped.');
        process.exit(0);
    });
});

/**
 * Error handling
 */
server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Try a different port.`);
    } else {
        console.error('Server error:', error);
    }
    process.exit(1);
});

module.exports = { server, PORT, HOST };