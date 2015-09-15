install: npm
	if [ ! -d public/build ]; then mkdir public/build; fi
	node_modules/.bin/browserify -t reactify --standalone TicTacToe \
		client/tictactoe.js -o public/build/tictactoe.js

npm:
	npm install

clean:
	rm -r public/build

cleaner: clean
	rm -r node_modules

run:
	nodejs server/server.js
