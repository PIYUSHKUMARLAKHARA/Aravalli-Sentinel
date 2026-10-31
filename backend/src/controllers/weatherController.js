import { getWeatherData } from '../services/weatherService.js';

export async function getCurrentWeather(req, res) {
  try {
    const { lat, lng } = req.query;
    const weather = await getWeatherData(lat, lng);
    return res.json({
      success: true,
      weather,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export default {
  getCurrentWeather,
};
