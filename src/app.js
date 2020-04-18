const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];
let like = 0;

function validUuid(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: 'id is not a valid uuid'})
  }

  return next(); 
} 

app.use('/repositories/:id', validUuid);

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  
  const repository = {
    id: uuid(),
    title: title,
    url: url,
    techs: [ techs ],
    likes: like
  };

  repositories.push(repository);
  return response.status(200).json(repository);

});

app.put("/repositories/:id", (request, response) => {
  const { id  } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repositories => repositories.id === id)

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' }) 
  }

  const repository = {
    id: uuid(),
    title: title,
    url: url,
    techs: [ techs ]
  };

  repositories[repositoryIndex] = repository;

  return response.status(200).json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id  } = request.params;

  const repositoryIndex = repositories.findIndex(repositories => repositories.id === id)
  
  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' }) 
  }

  repositories.splice(repositoryIndex, 1)
  
  return response.status(204).send();
});

app.post("/repositories/:id/like", validUuid, (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repositories => repositories.id === id)

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' }) 
  }

  repositories[repositoryIndex].likes = like++;

  return response.status(200).json(repositories[repositoryIndex]);
});

module.exports = app;
