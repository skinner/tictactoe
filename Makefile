install:
	npm install

browserify: install
	node_modules/.bin/browserify -t reactify --standalone TicTacToe \
		tictactoe.js -o public/build/tictactoe.js

clean:
	rm -r public/build/*

cleaner: clean
	rm -r node_modules
