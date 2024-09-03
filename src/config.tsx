import dotenv from 'dotenv';
import logger from './utils/logger';
dotenv.config();


logger.info("Loading envs...");
export const DEBUG = process.env.DEBUG || '';
logger.info("DEBUG: " + DEBUG);

export const BOT_TOKEN = process.env.BOT_TOKEN || '';

if (DEBUG.toUpperCase() === 'TRUE') {
    logger.info("Bot token: " + BOT_TOKEN);
}