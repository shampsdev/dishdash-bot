import dotenv from 'dotenv';
import logger from './utils/logger';
dotenv.config();

logger.info('Loading envs...');
export const DEBUG = process.env.DEBUG ? true : false;
logger.info('DEBUG: ' + DEBUG);

export const BOT_TOKEN = process.env.BOT_TOKEN || '';

export const ADMIN_IDS = process.env.ADMIN_IDS
  ? process.env.ADMIN_IDS.split(',').map((id) => id.trim())
  : [];

export const API_BASE_URL = process.env.API_BASE_URL || '';

if (DEBUG) {
  logger.info('Bot token: ' + BOT_TOKEN);
  logger.info('Admin ids: ' + ADMIN_IDS.join(', '));
}
