const http = require('http');
const path = require('path');
const DB_FILE = path.join(__dirname, 'users.json');

const loadDataset = (fileLocation) => {
  if (!fs.existsSync(fileLocation)) {
    fs.writeFileSync(fileLocation, JSON.stringify([]));
    return [];
  }
  const rawContent = fs.readFileSync(fileLocation, 'utf-8');
  return rawContent ? JSON.parse(rawContent) : [];
};


const persistDataset = (fileLocation, content) => {
  fs.writeFileSync(fileLocation, JSON.stringify(content, null, 2));
};


const parseRequestBody = async (request) => {
  const chunks = [];
  for await (const chunk of request) {
    chunks.push(chunk);
  }
  const rawString = Buffer.concat(chunks).toString();
  try {
    return rawString ? JSON.parse(rawString) : {};
  } catch {
    return {};
  }
};


const appServer = http.createServer(async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  const fullUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = fullUrl.pathname;
  const pathSegments = pathname.split('/').filter(Boolean);
  
  const currentUsers = loadDataset(DB_FILE);

  // 1) POST 
  if (req.method === 'POST' && pathname === '/user') {
    const payload = await parseRequestBody(req);
    
    const isEmailTaken = currentUsers.some((item) => item.email === payload.email);
    if (isEmailTaken) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ message: 'Email already exists.' }));
    }

    const nextId = currentUsers.length > 0 ? Math.max(...currentUsers.map(u => u.id || 0)) + 1 : 1;
    const userRecord = { id: nextId, ...payload };
    
    currentUsers.push(userRecord);
    persistDataset(DB_FILE, currentUsers);
    
    return res.end(JSON.stringify({ message: 'User added successfully.' }));
  }

  // 2) PATCH 
  if (req.method === 'PATCH' && pathSegments[0] === 'user' && pathSegments[1]) {
    const targetId = parseInt(pathSegments[1], 10);
    const payload = await parseRequestBody(req);

    const userIndex = currentUsers.findIndex((u) => u.id === targetId);
    if (userIndex === -1) {
      res.statusCode = 404;
      return res.end(JSON.stringify({ message: 'User ID not found.' }));
    }

    currentUsers[userIndex] = { ...currentUsers[userIndex], ...payload };
    persistDataset(DB_FILE, currentUsers);

    const modifiedProp = Object.keys(payload)[0] || 'details';
    return res.end(JSON.stringify({ message: `User ${modifiedProp} updated successfully.` }));
  }

  // 3) DELETE 
  if (req.method === 'DELETE' && pathSegments[0] === 'user' && pathSegments[1]) {
    const targetId = parseInt(pathSegments[1], 10);
    const exists = currentUsers.some((u) => u.id === targetId);

    if (!exists) {
      res.statusCode = 404;
      return res.end(JSON.stringify({ message: 'User ID not found.' }));
    }

    const filteredUsers = currentUsers.filter((u) => u.id !== targetId);
    persistDataset(DB_FILE, filteredUsers);

    return res.end(JSON.stringify({ message: 'User deleted successfully.' }));
  }

  // 4) GET
  if (req.method === 'GET' && pathname === '/user') {
    return res.end(JSON.stringify(currentUsers));
  }

  // 5) GET 
  if (req.method === 'GET' && pathSegments[0] === 'user' && pathSegments[1]) {
    const targetId = parseInt(pathSegments[1], 10);
    const matchedUser = currentUsers.find((u) => u.id === targetId);

    if (!matchedUser) {
      res.statusCode = 404;
      return res.end(JSON.stringify({ message: 'User not found.' }));
    }

    return res.end(JSON.stringify(matchedUser));
  }

  //  Not Found
  res.statusCode = 404;
  return res.end(JSON.stringify({ message: 'Route not found.' }));
});

const PORT = 8080;
appServer.listen(PORT, () => {
  console.log(`Server is running smoothly on port ${PORT}`);
});