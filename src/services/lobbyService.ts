import axios from 'axios';
import { API_BASE_URL } from 'src/config';
import logger from 'src/utils/logger';

interface CreateLobbyProps {
  coords: {
    latitude: number;
    longitude: number;
  };
}

export const createLobby = async ({ coords }: CreateLobbyProps) => {
  try {
    return await axios.post(`${API_BASE_URL}/api/v1/lobbies`, {
      location: {
        lat: coords.latitude,
        lon: coords.longitude,
      },
    });
  } catch (err) {
    logger.error(err);
  }
};
