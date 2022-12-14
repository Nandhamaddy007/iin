const config = {
    "amqp": "amqp://localhost",
    "queue": "nodemailer-amqp",
  
    "server": {
      "port": 5672,
      "host": "127.0.0.1"
    }
  }
const SMTPServer = require('smtp-server').SMTPServer;


const server = new SMTPServer({

   
    logger: false,

  
    banner: 'Welcome to SMTP Server',

    disabledCommands: ['STARTTLS'],

 
    size: 10 * 1024 * 1024,


    onAuth(auth, session, callback) {
        return callback(null, {
            user: {
                username: auth.username
            }
        });
    },


    onData(stream, session, callback) {
        console.log('Streaming message from user %s', session.user.username);
        console.log('------------------');
        stream.pipe(process.stdout);
        stream.on('end', () => {
            console.log('');
            callback(null, 'Message queued as ' + Date.now()); 
        });
    }
});

server.on('error', err => {
    console.log('Error occurred');
    console.log(err);
});


server.listen(config.server.port, config.server.host);