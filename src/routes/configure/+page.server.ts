import { error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { env } from '$env/dynamic/private';

const {CONFIG_PATH} = env

const configPath = path.resolve(CONFIG_PATH);

export const load: PageServerLoad = async () => {
	try {
		const configData = fs.readFileSync(configPath, 'utf-8');
		return {
			configData
		};
	} catch (err) {
		console.error('Error loading config:', err);
		throw error(500, 'Failed to load configuration data');
	}
};
