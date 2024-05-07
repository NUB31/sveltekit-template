import {
	SECRET_EMAIL_PASSWORD,
	SECRET_EMAIL_SERVICE,
	SECRET_EMAIL_USERNAME
} from '$env/static/private';
import nodemailer from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

export async function sendMail(
	to: string,
	subject: string,
	message: string
): Promise<SMTPTransport.SentMessageInfo> {
	return new Promise((resolve, reject) => {
		const transporter = nodemailer.createTransport({
			service: SECRET_EMAIL_SERVICE,
			auth: {
				user: SECRET_EMAIL_USERNAME,
				pass: SECRET_EMAIL_PASSWORD
			}
		});

		const options = {
			from: process.env.EMAIL_SENDER,
			to,
			subject,
			text: message
		};

		transporter.sendMail(options, (error, info) => {
			if (error) reject(error);
			else resolve(info);
		});
	});
}
