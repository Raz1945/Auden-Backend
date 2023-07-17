const musicModel = require('../models/musicServices');

exports.getAll = async (_req, res) => {
  try {
    const allMusic = await musicModel.getAll();
    res.json(allMusic);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los datos solicitados.'});
  }
};
