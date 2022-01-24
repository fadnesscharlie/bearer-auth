'use strict';

const express = require('express');
const authRouter = express.Router();

const { users } = require('./models/index.js');
const { list } = require('./models/index.js');

// Auth
// const User = require('./auth/models/users.js');
const basicAuth = require('./middleware/basic.js');
const bearerAuth = require('./middleware/bearer.js');
const acl = require('./middleware/acl.js')

authRouter.post('/register', async (req, res, next) => {
  try {
    let userRecord = await users.create(req.body);
    const output = {
      user: userRecord,
      userToken: userRecord.token,
    };
    res.status(201).json(output);
  } catch (err) {
    next(err.message);
  }
});

authRouter.post('/createTodos', async (req, res, next) => {
  try {
    let todos = await list.create(req.body);
    const output = {
      todo: todos,
    };
    res.status(201).json(output)
  } catch (err) {
    next(err.message)
  }
})

authRouter.get('/todos', async (req, res, next) => {
  const allTodos = await list.findAll({});
  console.log('allUsers:', allTodos);

  res.status(200).json(allTodos);


  // res.status(200).send('Does this thing even work?')
})



authRouter.post('/signin', basicAuth(users), (req, res) => {
  try {
    const user = {
      user: req.user,
      // token: req.token
      token: req.user.token,
    };
    console.log('req token',req.user.token)
    // if not token or user, create error code
    res.status(200).json(user);
  } catch (err) {
    res.status(404).send(err);
  }
});

authRouter.get('/users', bearerAuth(users), async (req, res, next) => {
  const allUsers = await users.findAll({});
  // if !users, create a error code
  const list = allUsers.map((user) => user.username);
  res.status(200).json(list);
});

authRouter.get('/secret', bearerAuth(users), async (req, res, next) => {
  res.status(200).send("Welcome to the super special STUFF!");
});


// ### ACL END POINTS ###
authRouter.get('/test1', bearerAuth(users), acl('read'), async (req, res, next) => {
  const allUsers = await users.findAll({});
  // if !users, create a error code
  const list = allUsers.map((user) => user.username);
  res.status(200).json(list);
});

authRouter.get('/create', bearerAuth(users), acl('create'), async (req, res, next) => {
});

authRouter.get('/update', bearerAuth(users), acl('update'), async (req, res, next) => {
});

authRouter.get('/delete', bearerAuth(users), acl('delete'), async (req, res, next) => {
});

/* 
User1 -> { "username":"Krissy", "password": "BestGurl", "role": "admin"}
  - Basic a3Jpc3N5OkJlc3RHdXJs
  - Bearer

  {
    "username": "Billy",
    "password": "Bob"
}

*/


module.exports = authRouter;
