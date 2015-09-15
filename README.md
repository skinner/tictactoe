Running:
--------

    sudo apt-get install nodejs npm

I don't have a fully-stock ubuntu 14.04 machine handy, so this list might not be completely exhaustive.

    make install

    make run

Implementation choices:
-----------------------

[gevent-socketio isn't keeping up with socket.io development](https://github.com/abourget/gevent-socketio/issues/192); it seems unmaintained.  [Same with django-socketio](https://github.com/stephenmcd/django-socketio/issues/19).  Plus, gevent's monkey-patching worries me from a library-compatibility point of view.  The situation with Tornado and socket.io [doesn't seem much better](https://github.com/MrJoes/tornadio2):

> Unfortunately, Socket.IO 0.8 branch is abandoned, there are huge amount of bugs and nothing getting fixed.

So I went with Node.  I'm not using any "frameworks" other than node and socket.io, really, although I am using node-static for static file serving.

Issues:
-------
* If one player refreshes, they should both refresh.
* No tests
* Only one game at a time
