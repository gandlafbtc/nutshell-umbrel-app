import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { env } from '$env/dynamic/private';

const {CONFIG_PATH} = env

const configPath = path.resolve(CONFIG_PATH);

// POST endpoint to save config file content
export const POST: RequestHandler = async ({ request }) => {
    try {
			const {content} = await request.json() as {content: string};
			
			if (!content) {
				return json({ success: false, error: 'No configuration content provided' });
			}
			
			fs.writeFileSync(configPath, content, 'utf-8');
			return json({ success: true });
		
    } catch (err) {
        console.error('Error writing to config file:', err);
        return new Response(JSON.stringify({ error: 'Failed to save configuration file' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
};

