const express = require("express");

const Games = require('../games/gamesModel.js');

const server = express();

server.use(express.json());

const games = [
  {
    title: "Pacman",
    genre: "Arcade",
    releaseYear: 1980
  }
];

server.use(express.json());

server.get('/', async (req, res) => {
    res.status(200).json({ api: 'running' });
});

server.get("/games", (req, res) => {
  res.status(200).json(games);
});

server.get('/games/:id', async (req, res) => {
    try {
        const game = await Games.getGame(req.params.id)
        if (game) {
            res.status(200).json(game)
        } else {
            res.status(404).json({ message: `The game with id ${req.params.id} was not found` });
        }
    } catch (error) {
        res.status(500).json({ message: 'Could not find game' });
    }
});

server.post("/games", (req, res) => {

	const { title, genre, releaseYear } = req.body;
	const game = { title, genre, releaseYear };
	const newGames = [...games, game];

	if (!title || !genre) {
		res
			.status(422)
			.json({ error: "Title and genre are required!" });
	} else {
		res.status(201).json(newGames);
	}
});

module.exports = server;