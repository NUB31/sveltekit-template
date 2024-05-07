import type { ApiResponse } from '$lib/types';
import { authorize } from '$lib/util';
import { json, type RequestHandler } from '@sveltejs/kit';
import path from 'path';
import fs from 'fs/promises';

export const POST: RequestHandler = async ({ request }) => {
	const res: ApiResponse = {
		data: null,
		message: null,
		success: false
	};

	return authorize(request, async (err) => {
		if (err) {
			res.message = err;
			return json(res, { status: 403 });
		}

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

		res.data = `/${relativeFilePath}`;
		res.success = true;
		return json(res, { status: 200 });
	});
};
