import path from 'path';
import fs from 'fs/promises';
import type { RequestHandler } from '@sveltejs/kit';
import { authorize } from '$lib/util/authorize';
import { response } from '$lib/util/response';

export const POST: RequestHandler = async ({ request, cookies }) =>
	authorize(cookies, async () => {
		const data = Object.fromEntries(await request.formData());
		const relativeFilePath = path.join(
			'upload',
			`${crypto.randomUUID()}.${(data.file as File).type.split('/')[1]}`
		);

		try {
			await fs.access(path.join(process.cwd(), 'static', 'upload'));
		} catch (error) {
			await fs.mkdir(path.join(process.cwd(), 'static', 'upload'));
		}

		await fs.writeFile(
			path.join(process.cwd(), 'static', relativeFilePath),
			Buffer.from(await (data.file as Blob).arrayBuffer())
		);

		return response({
			data: `/${relativeFilePath}`,
			error: null
		});
	});
