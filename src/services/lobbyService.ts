import axios from 'axios';
import { API_BASE_URL } from 'src/config';
import logger from 'src/utils/logger';

interface LobbyLocationProps {
  location: {
    lat: number;
    lon: number;
  };
}

interface LobbyData {
  distance: number;
  lobby: {
    id: string;
    location: {
      lon: number;
      lat: number;
    };
  };
}

export const createLobby = async ({ location }: LobbyLocationProps) => {
  try {
    return await axios.post<LobbyData>(`${API_BASE_URL}/api/v1/lobbies`, {
      location,
    });
  } catch (err) {
    logger.error(err);
  }
};

export const findLobby = async ({ location }: LobbyLocationProps) => {
  try {
    return await axios.post<LobbyData>(
      `${API_BASE_URL}/api/v1/lobbies/nearest`,
      {
        location,
      }
    );
  } catch (err) {
    logger.error(err);
  }
};
