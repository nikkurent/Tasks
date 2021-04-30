const express = require('express');
const mongoose = require('./db/mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const path = require('path');
const history = require('connect-history-api-fallback');


const app = express();
const port = process.env.PORT || 8080;


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token, _id");

    res.header(
        'Access-Control-Expose-Headers',
        'x-access-token, x-refresh-token'
    )
    next();
});

const {List} = require('./db/models/list.model');
const {Task} = require('./db/models/task.model');
const {User} = require('./db/models/user.model');



app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));


let verify = ((req, res, next) => {
    const refreshToken = req.header('x-refresh-token');
    const userId = req.header('_id');


    User.findByIdAndToken(userId, refreshToken).then((user) => {
        if (!user) {
            return Promise.reject({
                'error': 'User not found Make sure that the refresh token and user id are valid'
            })
        }

        req.userObject = user;
        req.refreshToken = user.sessions.token;
        req.userId = user._id;


        let sessionValid = false;
        user.sessions.forEach((session => {
            if (session.token == refreshToken) {
                if (User.hasRefreshTokenExpired(session.expiresAt) === false) {
                    sessionValid = true;
                }
            }
        }))

        if (sessionValid) {
            next();
        } else {
            return Promise.reject({
                'error': 'Refresh token has expired or the session is invalid'
            })
        }
    }).catch((err) => {
        res.status(401).send(err);
    })
})


let authenticate = (req, res, next) => {
    const accessToken = req.header('x-access-token');
    
    jwt.verify(accessToken, User.getAccessToken(), (err, decoded) => {
        if (err) {
            res.status(401).send(err);
        } else {
            req.userId = decoded._id
            next();
        }
    })
}

app.use(history({
    verbose: true
}))
app.use(express.static(path.resolve(__dirname, '../Frontend/public/tasks')));

/*
*
    LIST ROUTES*
*
*/

/* GET lists Request  */
app.get('/lists', authenticate, (req, res) => {
    const userId = req.userId;
    List.find({_userId: userId}).then((lists) => {
        res.send(lists);
    });  
})

app.get('/lists/:listId', authenticate, (req, res) => {
    const userId = req.userId;
    const listId = req.params.listId;
    List.find({_id: listId, _userId: userId}).then((list) => {
        res.send(list);
    });  
})

/* POST lists Request  */
app.post('/lists', authenticate, (req, res) => {
    const title = req.body.title;
    const userId = req.userId;
    
    newList = new List({title, _userId: userId});
    newList.save().then((list, err) => {
        if (err) res.send(err);
        res.send(list);
    });
})

/* PATCH lists Request  */
app.patch('/lists/:listId', authenticate, (req, res) => {
    const listId = req.params.listId;
    const userId = req.userId;
    List.updateOne({_id: listId, _userId: userId}, {$set: req.body}).then(() => {
        res.send({'Message': 'Succesfully updated list: ' + listId});
    });
})

/* DELETE lists Request  */
app.delete('/lists/:listId', authenticate, (req, res) => {
    const listId = req.params.listId;
    const userId = req.userId;
    List.findByIdAndDelete({_id: listId, _userId: userId}).then((list, err) => {
        if (err) res.send(err);
        res.send(list);
    });

    deleteTask(listId);
})




/*
*
    TASK ROUTES*
*
*/

/* GET tasks Request  */
app.get('/lists/:listId/tasks', authenticate, (req, res) => {
    const listId = req.params.listId;
    Task.find({ _listId: listId }).then((task) => {
        res.send(task);
    });  
})

/* POST tasks Request  */
app.post('/lists/:listId/tasks', authenticate, (req, res) => {
    const listId =req.params.listId
    const title = req.body.title;
    newTask = new Task({title, _listId: listId});

    newTask.save().then((task, err) => {
        if (err) res.send(err);
        res.send(task);
    });
})

/* PATCH tasks Request  */
app.patch('/lists/:listId/tasks/:taskId', authenticate, (req, res) => {
    const listId = req.params.listId;
    const taskId = req.params.taskId;
    Task.updateOne({_id: taskId, _listId: listId}, {$set: req.body}).then(() => {
        res.send({'Message': 'Succesfully updated task: ' + taskId});
    });
})

/* DELETE tasks Request  */
app.delete('/lists/:listId/tasks/:taskId', authenticate, (req, res) => {
    const listId = req.params.listId;
    const taskId = req.params.taskId;
    Task.findByIdAndDelete({_id: taskId, _listId: listId}).then((task, err) => {
        if (err) res.send(err);
        res.send(task);
    });
})


/*
*
    USER ROUTES*
*
*/

/* GET user access-token */
app.get('/user/access-token', verify, (req, res) => {
    req.userObject.generateAccessToken().then((accessToken) => {
        res
            .header({'x-access-token': accessToken})
            .send(accessToken)
    }).catch((err) => {
        res.status(400).send(err);
    })
})


/* Sign user */
app.post('/user', (req, res) => {
    let body = req.body;
    let newUser = new User(body);

    newUser.save().then(() => {
        return newUser.createSession().then((refreshToken) => {
            return newUser.generateAccessToken().then((accessToken) => {
                return { accessToken, refreshToken };
            });
        }).then((authTokens) => {
            res
                .header({'x-access-token': authTokens.accessToken})
                .header({'x-refresh-token': authTokens.refreshToken})
                .send(newUser)
        }).catch((e) => {
            res.status(400).send(e);
        })
    })
})

/* Login user */
app.post('/user/login', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    User.findByCredentials(email, password).then((user => {
        return user.createSession().then((refreshToken) => {
            return user.generateAccessToken().then((accessToken) => {
                return {accessToken, refreshToken};
            })
        }).then((authTokens) => {
            res
            .header('x-refresh-token', authTokens.refreshToken)
            .header('x-access-token', authTokens.accessToken)
            .send(user);
        }).catch((e) => {
            res.status(400).send(e)
        })
    }))
})

/* HELPER METHODS */
deleteTask = function(listId) {
    Task.deleteMany({'_listId': listId}).then(() => {
        console.log('Tasks from list number ' + listId + ' were deleted');
    });
}

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})