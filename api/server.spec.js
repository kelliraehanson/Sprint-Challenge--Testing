require('dotenv').config();

const Games = require('../games/gamesModel.js');

const db = require('../data/dbConfig.js');
const request = require("supertest");

const server = require("./server.js");

describe('server.js', () => {
    it('Should set testing environemt', () => {
        expect(process.env.DB_ENV).toBe('development');
    });

// POST 

describe("POST /games tests", () => {
    afterEach(async () => {
            await db('games').truncate();
            })

	it("Should return status 201 when successful", async () => {

        const newgame = 
        { 
            title: "Rayman", 
            genre: "Platform", 
            releaseYear: 1995 };

		const response = await request(server)
			.post("/games")
			.send(newgame)
		expect(response.status).toBe(201);
    });
    
	it("Should return error 422 if required data is missing", async () => {

        const newGame = 
        { 
            title: null, 
            genre: null, 
            releaseYear: 1988 
        };
		const response = await request(server)
			.post("/games")
			.type("JSON")
			.send(newGame)
			.set("Accept", "application/json");

		expect(response.status).toBe(422);
    });
    
	it("Should return the new array", async () => {

		const gameArray = [
			{
				title: "Pacman",
				genre: "Arcade",
				releaseYear: 1980
			},
			{ 
                title: "Mario", 
                genre: "Action", 
                releaseYear: 1983 }
        ];
        
        const newgame = 
        { 
            title: "Mario", 
            genre: "Action", 
            releaseYear: 1983 
        };

		const response = await request(server)
			.post("/games")
			.type("JSON")
			.send(newgame)
			.set("Accept", "application/json");
		expect(response.body).toEqual(gameArray);
    });

});


// GET

describe("GET /games tests", () => {
    afterEach(async () => {
        await db('games').truncate();
    })

  it("Should return status 200 when successful", async () => {
    const response = await request(server).get("/games");
    expect(response.status).toBe(200);
  });

  it('Should return JSON', async () => {
    const response = await request(server).get('/games');
    expect(response.type).toBe('application/json');
});

it('Should return { api: running }', async () => {
    const response = await request(server).get('/');
    expect(response.body).toEqual({ api: 'running' });
});

  it("Should return an array of games even if array is empty", async () => {
    const response = await request(server).get("/games");
    expect(Array.isArray(response.body)).toBe(true);
  });

  
  it("Should return an array of games", async () => {

    const gamesArray = [
      {
        title: "Pacman",
        genre: "Arcade",
        releaseYear: 1980
      }
    ];

    const response = await request(server).get("/games");
    expect(response.body).toEqual(gamesArray);
  });
  
});

});
