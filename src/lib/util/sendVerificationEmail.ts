import { db } from './database';
import type { User } from '@prisma/client';
import { sendMail } from './mail';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

export async function sendVerificationEmail(
	userId: string
): Promise<SMTPTransport.SentMessageInfo> {
	let user: User;

	try {
		user = await db.user.findUniqueOrThrow({
			where: {
				id: userId
			}
		});
	} catch (error) {
		throw new Error(`Could not fund user with id: ${userId}`);
	}

	if (user.isVerified) throw new Error('You are already verified');

	const codeObject = await db.verificationCode.create({
		data: {
			code: Math.floor(Math.random() * 900000 + 100000),
			userId: user.id
		}
	});

	try {
		return await sendMail(user.email, 'Verify your account', `Code: ${codeObject.code}`);
	} catch (error) {
		throw new Error(`There was an error sending the email`);
	}
}
