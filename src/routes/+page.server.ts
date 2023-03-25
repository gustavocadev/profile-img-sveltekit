import { prisma } from '$lib/server/prisma';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import type { Actions } from './$types';

export const load = async ({ request }) => {
	// i need to load the last image from the database

	const img = await prisma.image.findFirst({
		orderBy: {
			createdAt: 'desc'
		}
	});

	return {
		img: img?.id,
		extension: img?.extension
	};
};

export const actions = {
	uploadImg: async ({ request }) => {
		// i need to convert this to a buffer
		const formData = await request.formData();
		const files = formData.get('files')?.valueOf() as File;

		// i need to convert this to a buffer
		const arrayBuffer = await files.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);
		const extention = files.name.split('.').pop();

		// generate a random id for the image
		const imgId = crypto.randomUUID();
		await fs.writeFile(`./static/${imgId}.${extention}`, buffer);

		await prisma.image.create({
			data: {
				id: imgId,
				extension: extention ?? '',
				user: {
					create: {
						name: `name-${crypto.randomUUID()}`,
						email: `${crypto.randomUUID()}@gmail.com`
					}
				}
			}
		});

		return {
			msg: 'Image uploaded'
		};
	}
} satisfies Actions;
