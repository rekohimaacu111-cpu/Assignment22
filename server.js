const http = require('http');
const fs = require('fs');
const path = require('path');
const FILE_PATH = path.join(__dirname, 'users.json');

function readUsers() {
  if (!fs.existsSync(FILE_PATH)) fs.writeFileSync(FILE_PATH, '[]');
  return JSON.parse(fs.readFileSync(FILE_PATH, 'utf8'));
}

function saveUsers(users) {
  fs.writeFileSync(FILE_PATH, JSON.stringify(users, null, 2));
}

function getBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (c) => (body += c));
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        resolve({});
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const users = readUsers();
  const parts = req.url.split('/').filter(Boolean);

  if (req.method === 'POST' && req.url === '/user') {
    const body = await getBody(req);
    if (users.some(u => u.email === body.email)) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ message: 'Email already exists.' }));
    }
    const newUser = { id: users.length ? users[users.length - 1].id + 1 : 1, ...body };
    users.push(newUser);
    saveUsers(users);
    return res.end(JSON.stringify({ message: 'User added successfully.' }));
  }

  if (req.method === 'PATCH' && parts[0] === 'user' && parts[1]) {
    const id = Number(parts[1]);
    const body = await getBody(req);
    const user = users.find(u => u.id === id);
    if (!user) {
      res.statusCode = 404;
      return res.end(JSON.stringify({ message: 'User ID not found.' }));
    }
    Object.assign(user, body);
    saveUsers(users);
    return res.end(JSON.stringify({ message: `User ${Object.keys(body)[0]} updated successfully.` }));
  }

  if (req.method === 'DELETE' && parts[0] === 'user' && parts[1]) {
    const id = Number(parts[1]);
    const idx = users.findIndex(u => u.id === id);
    if (idx === -1) {
      res.statusCode = 404;
      return res.end(JSON.stringify({ message: 'User ID not found.' }));
    }
    users.splice(idx, 1);
    saveUsers(users);
    return res.end(JSON.stringify({ message: 'User deleted successfully.' }));
  }

  if (req.method === 'GET' && req.url === '/user') {
    return res.end(JSON.stringify(users));
  }

  if (req.method === 'GET' && parts[0] === 'user' && parts[1]) {
    const user = users.find(u => u.id === Number(parts[1]));
    if (!user) {
      res.statusCode = 404;
      return res.end(JSON.stringify({ message: 'User not found.' }));
    }
    return res.end(JSON.stringify(user));
  }

  res.statusCode = 404;
  res.end(JSON.stringify({ message: 'Route not found.' }));
});

server.listen(3000, () => console.log('Server running on port 3000'));