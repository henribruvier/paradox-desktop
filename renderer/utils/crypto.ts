import {createCipheriv, createDecipheriv} from 'crypto';
import process from 'process';

export const hash = async (text: string) => {
	const cipher = createCipheriv(
		'aes-256-cbc',
		process.env.NEXT_PUBLIC_ENC_KEY!,
		process.env.NEXT_PUBLIC_IV!,
	);
	let encrypted = cipher.update(text, 'utf8', 'base64');
	encrypted += cipher.final('base64');
	return encrypted;
};

export const unHash = async (hash: string) => {
	const decipher = createDecipheriv(
		'aes-256-cbc',
		process.env.NEXT_PUBLIC_ENC_KEY!,
		process.env.NEXT_PUBLIC_IV!,
	);
	const decrypted = decipher.update(hash, 'base64', 'utf8');
	return decrypted + decipher.final('utf8');
};
