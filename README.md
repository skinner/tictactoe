Running:

    sudo apt-get install nodejs npm sqlite3

I don't have a fully-stock ubuntu 14.04 machine handy, so this list might not be completely exhaustive.

    npm install --save sqlite3 node-static socket.io

Implementation choices:

[gevent-socketio isn't keeping up with socket.io development](https://github.com/abourget/gevent-socketio/issues/192); it seems unmaintained.  [Same with django-socketio](https://github.com/stephenmcd/django-socketio/issues/19).  Plus, gevent's monkey-patching worries me from a library-compatibility point of view.  The situation with Tornado and socket.io [doesn't seem much better](https://github.com/MrJoes/tornadio2):

> Unfortunately, Socket.IO 0.8 branch is abandoned, there are huge amount of bugs and nothing getting fixed.

So I went with Node.

The homework mentions Node, Tornado, Flask, and Django, and says "Do not use any other languages or frameworks."  Some of the socket.io examples use the Express framework; presumably, using Express would violate that rule.  And really, all I would have used it for was serving static files, anyway.  node-static isn't really a "framework", right?  So I'm using that.

Game data storage: sqlite3.  It's probably not actually the best fit (redis might be better for this sort of async app with low-value data).  I wanted the installation to be simple, though, so I went with sqlite to avoid having to coordinate installation/configuration with multiple services.



