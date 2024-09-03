import dotenv from 'dotenv';
import logger from './utils/logger';
dotenv.config();


logger.info("Loading envs...");
export const DEBUG = process.env.DEBUG || '';
logger.info("DEBUG: " + DEBUG);

export const BOT_TOKEN = process.env.BOT_TOKEN || '';

export const ADMIN_IDS = process.env.ADMIN_IDS ? process.env.ADMIN_IDS.split(',').map(id => id.trim()) : [];

if (DEBUG.toUpperCase() === 'TRUE') {
    logger.info("Bot token: " + BOT_TOKEN);
    logger.info("Admin ids: " + ADMIN_IDS);
}
