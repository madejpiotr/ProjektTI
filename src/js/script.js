import * as THREE from 'three';
/**
 * Klasa Size
 * Przyjmuje wysokość i szerokość
 * 
 * @class
 */
class Size {
    /**
     * Konstruktor klasy
     * @param {number} width 
     * @param {number} height 
     * 
     * @constructor
     */
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }
}

/**
 * Klasa Point
 * Przyjmuje współrzędne x i y 
 * 
 * @class
 */
class Point {
    static Undefinied = new Point(-Infinity, -Infinity);
    /**
     * Konstruktor klasy
     * @param {number} x 
     * @param {number} y 
     * 
     * @constructor
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    /**
     * Funkcja do dodawania punktu
     * @param {number} a 
     * @param {number} b 
     * @returns 
     */
    static add(a, b) {
        return new Point(a.x + b.x, a.y + b.y);
    }
    /**
     * Funkcja sprawdzająca czy punkty są równe
     * @param {point} point 
     * @returns boolean
     * 
     * @function
     */
    equals(point) {
        return this.x == point.x && this.y == point.y;
    }
}
/**
 * Klasa Direction
 * Odpowiada za kierunek, w który idzie wąż
 * 
 * @class
 */
class Direction {
    //alternatywa dla enuma, js go nie udostepnia, ale dzieki temu moglismy zawrzec dodatkowe informacje
    static Up = new Direction('Up', new Point(0, 1));
    static Down = new Direction('Down', new Point(0, -1));
    static Left = new Direction('Left', new Point(-1, 0));
    static Right = new Direction('Right', new Point(1, 0));
    /**
     * Konstruktor klasy
     * @param {string} name 
     * @param {number} offset 
     * 
     * @constructor
     */
    constructor(name, offset) {
        this.name = name;
        this.offset = offset;
    }
    /**
     * Funkcja sprawdzajaca czy dwa kierunki sa przeciwne sobie
     * @param {string} direction 
     * @returns boolean
     * 
     * @function
     */
    isOpposite(direction) {
        const a = this.offset;
        const b = direction.offset;
        const res = Point.add(a, b);
        return res.equals(new Point(0, 0));
    }

    /**
     * Funkcja toString
     * Wypisuje nam direction
     * @returns string
     */
    toString() {
        return `Direction.${this.name}`;
    }
}


/**
 * Klasa Snake
 * Odpowiada za węża w grze
 * 
 * @class
 */
class Snake {
    /**
     * Konstruktor klasy
     * @param {string} head 
     * @param {string} direction 
     * 
     * @constructor
     */
    constructor(head, direction) {
        this.direction = direction;
        this.head = head;
        this.body = [];
        this.changedDirection = false;
        this.isAlive = false; 
    }


    /**
     * Funkcja, która sprawdza czy wąż wszedł w siebie
     * 
     * @param {Point} point 
     * @returns boolean
     * 
     * @function
     */
    bodyCollides(point) {
        for (const part of this.body) {
            if (part.equals(point)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Funkcja od jedzenia
     * Zwiększa długość węża, jeśli zje
     * @param {Point} point 
     * 
     * @function
     */
    eat(point) {
        this.body.push(new Point(this.head.x, this.head.y));
        this.head = point;
    }
    
    /**
     * Funkcja ustawiająca kierunek węża
     * @param {string} direction 
     * 
     * @function
     */
    setDirection(direction) {
        if (!this.direction.isOpposite(direction) && !this.changedDirection) {
            this.changedDirection = true;
            this.direction = direction;
        }
    }
    /**
     * Funkcja ożywiająca węża
     * 
     * @function
     */
    setAlive() {
        this.isAlive = true;
    }
    /**
     * Funkcja uśmiercająca węża
     * 
     * @function
     */
    die() {
        this.isAlive = false;
    }
    /**
     * Funkcja poruszania się węża
     * 
     * @function
     */
    move() {
        if (this.isAlive = true) {
            this.body.shift();
            this.body.push(new Point(this.head.x, this.head.y));

            this.head.x += this.direction.offset.x;
            this.head.y += this.direction.offset.y;
            this.changedDirection = false;
            this.isAlive = !this.bodyCollides(this.head);
        }
    }
}

/**
 * Klasa losująca punkt
 * 
 * @class
 */
class PointRandomizer {
    /**
     * Funkcja od losowania
     * @param {number} limit 
     * @returns Point
     * 
     * @function
     */
    static random(limit) {
        return new Point(
            Math.floor((limit.x - 1) * Math.random()),
            Math.floor((limit.y - 1) * Math.random()));
    }
}

/**
 * Klasa od losowania kierunku węża
 * 
 * @class
 */
class DirectionRandomizer {
    static directions = [Direction.Up, Direction.Down, Direction.Left, Direction.Right];
    /**
     * Funkcja losująca kierunek
     * @returns Direction
     * 
     * @function
     */
    static random() {
        const directionIndex = Math.floor(3.9 * Math.random());
        return DirectionRandomizer.directions[directionIndex];
    }
}

/**
 * Klasa Board
 * Odpowiada za planszę, jej wymiary, punkt do zdobycia i tworzenie węża
 * 
 * @class
 */
class Board {
    /**
     * Konstruktor klasy
     * @param {number} size 
     * 
     * @constructor
     */
    constructor(size) {
        this.point = Point.Undefinied;
        this.size = size;
        this.size.x += 1;
        this.size.y += 1;
        let snakeSize = 3;
        let randomPoint = this.randomPointInBoardForSnake(snakeSize);
        this.snake = new Snake(randomPoint, DirectionRandomizer.random());
        this.createSnakeBody(snakeSize);
        this.putPoint();
    }

    /**
     * Funkcja aktualizująca wydarzenia na planszy
     * Wąż się porusza, jeżeli jest na planszy lub nie wszedł w siebie, i wywołuje eat() jezeli wąż zjadł punkt
     * @returns 
     * 
     * @function
     */
    update() {
        if (this.isOnBoard(this.snake.head)) {
            const futureSnakePosition = new Point(this.snake.head.x + this.snake.direction.offset.x,
                this.snake.head.y + this.snake.direction.offset.y);
            if (futureSnakePosition.x == this.point.x && futureSnakePosition.y == this.point.y) {
                this.snake.eat(this.point);
                this.point = Point.Undefinied;
                this.putPoint();
                return;
            }
            this.snake.move();
        } else {
            this.snake.die();
        }
    }
    
    /**
     * Funkcja tworząca węża
     * @param {number} lenght 
     * 
     * @function
     */
    createSnakeBody(lenght) {
        const opposite = new Point(
            -1 * this.snake.direction.offset.x,
            -1 * this.snake.direction.offset.y);

        let part = new Point(this.snake.head.x, this.snake.head.y);
        for (let i = 0; i < lenght - 1;) {
            part.x += opposite.x;
            part.y += opposite.y;

            let isOn = this.isOnBoard(part);
            if (!isOn) {
                break;
            }

            this.snake.body.unshift(new Point(part.x, part.y));
            i++
        }
    }
    /**
     * Funkcja generująca punkt do zjedzenia
     * 
     * @function
     */
    putPoint() {
        while (true) {
            const point = this.randomPointInBoard();
            if (!this.snake.bodyCollides(point) && !this.snake.head.equals(point)) {
                this.point = point;
                break;
            }
        }
    }
    /**
     * Funkcja sprawdzająca czy element jest na planszy
     * @param {Point} point 
     * @returns boolean
     * 
     * @function
     */
    isOnBoard(point) {
        let xa = 0 <= point.x;
        let xb = point.x < this.size.x;
        let ya = 0 <= point.y;
        let yb = point.y < this.size.y;

        return xa && xb && ya && yb;
    }
    /**
     * Funkcja pomocnicza do funkcji putPoint()
     * @returns Point
     * 
     * @function
     */
    randomPointInBoard() {
        return PointRandomizer.random(this.size);
    }
    /**
     * Funkcja pomocnicza do generowania węża
     * @param {number} snakeSize 
     * @returns Point
     * 
     * @function
     */
    randomPointInBoardForSnake(snakeSize) {
        let size = new Point(this.size.x - 2 * snakeSize, this.size.y - 2 * snakeSize);
        let point = PointRandomizer.random(size);
        return new Point(point.x + snakeSize, point.y + snakeSize);
    }
    /**
     * Funkcja startująca grę (ożywienie węża)
     * 
     * @function
     */
    start() {
        this.snake.setAlive();
    }
    /**
     * Funkcja kończąca grę (zabicie węża)
     * 
     * @function
     */
    stop() {
        this.snake.die();
    }

}

/**
 * Klasa SizeBalancer
 * Pomaga odpowiednio narysować canvas
 * 
 * @class
 */
class SizeBalancer {
    /**
     * Funkcja wybierająca wartość między minimun a maksimum
     * @param {number} num 
     * @param {number} min 
     * @param {number} max 
     * @returns number
     * 
     * @function
     */
    static clamp(num, min, max){
        return Math.min(Math.max(num, min), max);
    }

    /**
     * Funkcja wybierająca odpowiednią wielkość dla canvasa
     * @param {number} size 
     * @param {number} maxSize 
     * @returns Size
     * 
     * @function
     */
    static balanceSize(size, maxSize) {
        const max = Math.min(maxSize.width, maxSize.height);
        console.log(max);

        if (size.width < size.height && size.width < max) {
            return new Size(size.width, size.width);
        }   
        else if (size.height < max) {
            return new Size(size.height, size.height);
        }
        return new Size(max, max);
    }
    /**
     * Funkcja wyliczająca odpowiednią wielkość
     * @param {div} canvas 
     * @returns Size
     * 
     * @function
     */
    static calculateSize(canvas) {
        const canvasSize = new Size(canvas.clientWidth, canvas.clientHeight);
        const balance = 0.85;
        const maxSize = new Size(Math.floor(balance * window.innerWidth), Math.floor(balance * window.innerHeight));
        let size = SizeBalancer.balanceSize(canvasSize, maxSize);
        return size;
    }
}

/**
 * Klasa SnakeRendererElement
 * Jest to element do rysowania węża
 * 
 * @class
 */
class SnakeRendererElement {
    /**
     * Konstruktor klasy
     * @param {Cube} cube 
     * @param {Point} snakePart 
     * 
     * @constructor
     */
    constructor(cube, snakePart) {
        this.cube = cube;
        this.snakePart = snakePart;
    }
}
/**
 * Klasa SnakeRenderer
 * Jest odpowiedzialna za rysowanie węża
 * 
 * @class
 */
class SnakeRenderer {
    /**
     * Konstruktor klasy
     * @param {Snake} snake 
     * @param {Scene} scene 
     * 
     * @constructor
     */
    constructor(snake, scene) {
        this.snake = snake;
        this.scene = scene;
        this.isRunning = false;
        this.clock = new THREE.Clock();
        this.parts = [];

        this.add();
    }
    /**
     * Funkcja od dodawania elementów węża
     * 
     * @function
     */
    add() {
        this.addPart(this.snake.head, this.scene, 0x072534, 0xDC143C);
        for (const part of this.snake.body) {
            this.addPart(part, this.scene, 0x072534, 0x156289);
        }
    }
    /**
     * Funckja pomocnicza do add()
     * @param {Point} part 
     * @param {Scene} scene 
     * @param {color} color 
     * @param {color} emissive 
     * 
     * @function
     */
    addPart(part, scene, color, emissive) {
        const cube = SnakeRenderer.createEmptyCube(color, emissive);
        let x = new SnakeRendererElement(cube, part);
        this.parts.push(x);
        scene.add(cube);
        cube.position.x = part.x;
        cube.position.y = part.y;
        cube.position.z = 0;
        cube.scale.set(0.85, 0.85, 0.3);
    }

    /**
     * Funkcja aktualizująca stan węża
     * @returns 
     * 
     * @function
     */
    update() {
        if (!this.snake.isAlive && !this.isRunning)
            return;
        if (!this.snake.isAlive && this.isRunning) {
            startAnimation();
            return;
        }
        this.addPartIfNeeded();
        this.moveSnakeMesh();
    }
    
    /**
     * Funkcja dodająca element węża, jeśli wąż się wydłuża
     * @returns 
     * 
     * @function
     */
    addPartIfNeeded() {
        if (this.parts.length >= this.snake.body.length + 1) {
            return;
        }
        if (this.parts.find((x, i) => x.cube.position.x == this.snake.head.x && x.cube.position.y == this.snake.head.y) == null) {
            this.addPart(this.snake.head, this.scene, 0x072534, 0x156289);
        }
    }

    /**
     * Funkcja startująca rysowania
     * 
     * @function
     */
    startAnimation() {
        isRunning = true;
    }
    /**
     * Funkcja stopująca rysowania
     * 
     * @function
     */
    stopAnimation() {
        isRunning = false;
    }

    /**
     * Funkcja ruszająca wężem
     * 
     * @function
     */
    moveSnakeMesh() {
        const delta = 2 * this.clock.getDelta();
        this.moveSnakeHeadMesh(delta);
        for (let i = 1; i < this.parts.length; i++) {
            this.moveSnakeBodyPartMesh(this.parts[i], this.snake.body[i - 1], delta);
        }
    }
    /**
     * Funkcja ruszająca głową węża
     * @param {number} delta 
     * 
     * @function
     */
    moveSnakeHeadMesh(delta) {
        this.parts[0].cube.position.x = this.snake.head.x;
        this.parts[0].cube.position.y = this.snake.head.y;
    }
    /**
     * Funkcja ruszająca częścią ciała węża
     * @param {Point} part 
     * @param {Point} destination 
     * @param {number} delta 
     * 
     * @function
     */
    moveSnakeBodyPartMesh(part, destination, delta) {
    
        part.cube.position.x = destination.x;
        part.cube.position.y = destination.y;
    }

    /**
     * Funkcja rysująca sześcian
     * @param {color} vcolor 
     * @param {color} vemissive 
     * @returns Cube
     * 
     * @function
     */
    static createEmptyCube(vcolor, vemissive) {
        const cube = new THREE.Group();
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshPhongMaterial({ color: vcolor, emissive: vemissive, side: THREE.DoubleSide, flatShading: true });
        const cubeMesh = new THREE.Mesh(geometry, material);
        cube.add(cubeMesh);
        return cube;
    }
}

/**
 * Klasa BoardRenderer
 * Odpowiada za rysowanie planszy
 * 
 * @class
 */
class BoardRenderer {
    /**
     * Konstruktor klasy
     * @param {Board} board 
     * @param {Scene} scene 
     * 
     * @constructor
     */
    constructor(board, scene) {
        this.board = board;
        this.scene = scene;
        this.add();
        this.addPoint(this.board.point, this.scene);
        this.snakeRenderer = new SnakeRenderer(this.board.snake, this.scene);
    }

    /**
     * Funkcja tworząca planszę
     * 
     * @function
     */
    add() {
        const geometry = new THREE.PlaneGeometry(this.board.size.x, this.board.size.y);
        const material = new THREE.MeshPhongMaterial({ color: 0xf5f5f5, emissive: 0xf5f5f5, side: THREE.DoubleSide, flatShading: true });
        const plane = new THREE.Mesh(geometry, material);
        plane.position.set(Math.floor(this.board.size.x / 2), Math.floor(this.board.size.y / 2), 0);
        this.scene.add(plane);
        for (let i = 0; i < this.board.size.x; i++) {
            for (let j = 0; j < this.board.size.y; j++) {
                this.addField(i, j);
            }
        }
    }

    /**
     * Funckja dodająca pojedyńcze pole na planszy
     * @param {number} x 
     * @param {number} y 
     * 
     * @function
     */
    addField(x, y) {
        const geometry = new THREE.PlaneGeometry(1, 1);
        const material = new THREE.MeshPhongMaterial({ color: 0xa3a3a3, emissive: 0xa3a3a3, side: THREE.DoubleSide, flatShading: true });
        const plane = new THREE.Mesh(geometry, material);
        plane.position.set(x, y, 0.1);
        plane.scale.set(0.85, 0.85, 0.85);
        this.scene.add(plane);
    }

    /**
     * Funckja aktualizująca stan planszy
     * 
     * @function
     */
    update() {
        this.snakeRenderer.update();
        this.point.position.set(this.board.point.x, this.board.point.y);
    }

    /**
     * Funkcja dodająca punkt na planszy
     * @param {Point} point 
     * @param {Scene} scene 
     * 
     * @function
     */
    addPoint(point, scene) {
        this.point = BoardRenderer.createEmptyCube();
        scene.add(this.point);
        this.point.position.x = point.x;
        this.point.position.y = point.y;
        this.point.position.z = 0;
        this.point.scale.set(0.7, 0.7, 0.3);
    }

    /**
     * Funkcja rysująca sześcian
     * @returns Cube
     * 
     * @function
     */
    static createEmptyCube() {
        const cube = new THREE.Group();
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshPhongMaterial({ color: 0x534072, emissive: 0x289156, side: THREE.DoubleSide, flatShading: true });
        const cubeMesh = new THREE.Mesh(geometry, material);
        cube.add(cubeMesh);
        return cube;
    }
}

/**
 * Klasa Game
 * Klasa agregująca całą funkcjonalność, manipuluje rozgrywką
 * 
 * @class
 */
class Game {
    /**
     * Konstruktor klasy
     * 
     * @constructor
     */
    constructor() { 
        this.canvas = document.querySelector('.game-canvas');
        this.menu = document.querySelector('.snake-menu');
        this.border = document.querySelector('.border');
        this.scene = null;
        const angle = 75;
        this.tan = Math.tan(this.degrees_to_radians(angle / 2));
        this.camera = new THREE.PerspectiveCamera(angle, 1, 0.1, 1000);
        this.renderer = null;
        this.touchStart = null;
        this.fontsize = 78;

        this.scoreLabel = null;
        this.button = null;
        //sposob przekazywania metody klasy do listenera
        this.menu.addEventListener('click', this.onStartButtonClick.bind(this));
        window.addEventListener('resize', this.onResize.bind(this), false);
        window.addEventListener('keydown', this.onKeyDown.bind(this), false);
        window.addEventListener('touchstart', this.onTouchStart.bind(this), false);
        window.addEventListener('touchstop', this.onTouchStop.bind(this), false);
        window.addEventListener('touchmove', this.onTouchMove.bind(this), false);
    }

    /**
     * Funkcja do obliczania odpowiedniej czcionki zależnie od wymiarów ekranu
     * @param {number} x 
     * 
     * @function
     */
    calculateFontSize(x){
        const a = 0.04;
        this.fontsize = Math.floor(a * x);
        console.log(this.fontsize);
    }

    /**
     * Funkcja do startu, chowa menu startu i zaczyna gre
     * 
     * @function
     */
    onStartButtonClick() {
        this.menu.style.visibility = 'hidden';
        this.menu.style.display = 'none';
        this.border.style.display = 'none';
        this.start();
    }

    /**
     * Funkcja startująca gre, tworzy planszę, która tworzy węża, ustala czas w jaki się porusza wąż
     * 
     * @function
     */
    start() {
        this.create();
        this.board.start();
        this.processId = setInterval(this.update.bind(this), 500);
        this.renderer.setAnimationLoop(this.render.bind(this));
    }

    /**
     * Funkcja tworząca planszę
     * 
     * @function
     */
    create() {
        this.scene = new THREE.Scene();
        this.addLight();
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.canvas.appendChild(this.renderer.domElement);
        const size = 10;
        this.board = new Board(new Point(size, size));
        this.boardRenderer = new BoardRenderer(this.board, this.scene);
        this.onResize();
    }

    /**
     * Funkcja do przycisku try again, chowa ekran końcowy i od razu startuje grę
     * 
     * @function
     */
    retry() {
        this.hideScore();
        this.start();
    }

    /**
     * Funkcja zatrzymująca grę, niszczy planszę i pokazuje ekran końcowy
     * 
     * @function
     */
    stop() {
        this.board.stop();
        clearInterval(this.processId);
        this.showScore();
        this.board = null;
        this.renderer = null;
    }

    /**
     * Funkcja od pokazywania ekranu końcowego, dynamicznie tworzy ją w pliku html i css
     * 
     * @function
     */
    showScore() {
        let width = this.renderer.domElement.clientWidth;
        let height = this.renderer.domElement.clientHeight;
        this.canvas.removeChild(this.renderer.domElement);
        this.scoreLabel = document.createElement("div");
        this.scoreLabel.setAttribute("class", "game-over");
        this.scoreLabel.setAttribute("style", "width: " + width + "px;");
        this.scoreLabel.setAttribute("style", "height: " + height + "px;");
        this.scoreLabel.setAttribute("style", "font-size: "+ this.fontsize+"px; border: #f5f5f5 solid 15px;");
        this.scoreLabel.innerHTML = "<div class=\"game-over-text\"><p> Game Over</p> <p class=\"game-over-score\">Score: " + (this.board.snake.body.length - 2) + "</p></div>";
        this.button = document.createElement("div");
        this.button.setAttribute("class", "game-over-button");
        this.button.addEventListener("click", this.retry.bind(this));
        this.button.innerHTML = "Try again";
        this.scoreLabel.appendChild(this.button);
        this.canvas.appendChild(this.scoreLabel);
    }

    /**
     * Funkcja wyłączająca ekran końcowy
     * 
     * @function
     */
    hideScore() {
        this.scoreLabel.removeChild(this.button);
        this.button = null;
        this.canvas.removeChild(this.scoreLabel);
        this.scoreLabel = null;
    }

    /**
     * Funkcja aktualizująca stan gry, czy wąż dalej żyje czy nie
     * 
     * @function
     */
    update() {
        if (!this.board.snake.isAlive) {
            this.stop();
        }
        this.board.update();
        this.render();
    }

    /**
     * Funkcja, która startuje rysowanie planszy
     * 
     * @function
     */
    render() {
        this.boardRenderer.update();
        this.renderer.render(this.scene, this.camera);
    }

    /**
     * Funkcja, która ustawia wygląd planszy i kamery wraz ze zmienianiem się ekranu
     * 
     * @function
     */
    onResize() {
        const calculatedSize = SizeBalancer.calculateSize(this.canvas.parentNode.parentNode);
        this.renderer.setSize(calculatedSize.width, calculatedSize.height);
        this.camera.aspect = calculatedSize.width / calculatedSize.height;
        this.camera.updateProjectionMatrix();
        this.calculateFontSize(calculatedSize.width);

        const marginSize = Math.floor((this.canvas.clientWidth - calculatedSize.width) / 2);
        this.renderer.domElement.style.marginLeft = marginSize + "px";
        if (this.board != null) {
            this.camera.position.set(
                Math.floor(this.board.size.x / 2),
                Math.floor(this.board.size.y / 2),
                (((this.board.size.x + 1) / 2) * this.tan) + 3);
        }
    }

    /**
     * Funkcja dodająca źrodła swiatła
     * 
     * @function
     */
    addLight() {
        const lights = [];
        lights[0] = new THREE.DirectionalLight(0xffffff, 3);
        lights[1] = new THREE.DirectionalLight(0xffffff, 3);
        lights[2] = new THREE.DirectionalLight(0xffffff, 3);

        lights[0].position.set(0, 200, 0);
        lights[1].position.set(100, 200, 100);
        lights[2].position.set(- 100, - 200, - 100);

        this.scene.add(lights[0]);
        this.scene.add(lights[1]);
        this.scene.add(lights[2]);
    }

    /**
     * Funkcja konwertująca stopnie na radiany
     * @param {number} degrees 
     * @returns number
     * 
     * @function
     */
    degrees_to_radians(degrees) {
        const pi = Math.PI;
        return degrees * (pi / 180);
    }

    /**
     * Funkcja dająca nam punkt w którym zaczął się dotyk ekranu
     * @param {Object} event 
     * 
     * @function
     */
    onTouchStart(event) {
        event.preventDefault();
        let touchPosition = event.touches[0];
        this.touchStart = new Point(touchPosition.clientX, touchPosition.clientY);
    }

    /**
     * Funkcja obliczająca kąt między początkiem a końcem dotyku, tym przypisując kierunek, w który ma się poruszać wąż
     * @param {Object} event 
     * @returns 
     * 
     * @function
     */
    onTouchMove(event) {
        if (this.touchStart == null) {
            return;
        }
        let touchPoint = new Point(event.touches[0].clientX, event.touches[0].clientY);
        let difference = new Point(0, 0);
        difference.x = touchPoint.x - this.touchStart.x;
        difference.y = touchPoint.y - this.touchStart.y;
        let lenght = Math.sqrt(Math.pow(difference.x, 2) + Math.pow(difference.y, 2));
        let limit = 25;
        if (lenght > limit) {
            let angle = Math.atan2(touchPoint.y - this.touchStart.y, touchPoint.x - this.touchStart.x) * (180 / Math.PI);
            if (angle > -135 && angle <= -45) {
                this.board.snake.setDirection(Direction.Up);
            } else if (angle > -45 && angle <= 45) {
                this.board.snake.setDirection(Direction.Right);
            } else if (angle > 45 && angle <= 135) {
                this.board.snake.setDirection(Direction.Down);
            } else {
                this.board.snake.setDirection(Direction.Left);
            }
        }
        this.touchStart = touchPoint;
    }

    /**
     * Funkcja dająca nam punkt w którym skończył się dotyk ekranu
     * @param {Object} event 
     * 
     * @function
     */
    onTouchStop(event) {
        this.touchStart = null;
    }

    /**
     * Funkcja ustawiająca odpowiedni kierunek węża, zależnie od przyciniętego przycisku
     * @param {Object} event 
     * @returns 
     * 
     * @function
     */
    onKeyDown(event) {
        if (this.board.snake.isAlive) {
            switch (event.key) {
                case 'w':
                case 'ArrowUp':
                    this.board.snake.setDirection(Direction.Up);
                    return;
                case 's':
                case 'ArrowDown':
                    this.board.snake.setDirection(Direction.Down);
                    return;
                case 'a':
                case 'ArrowLeft':
                    this.board.snake.setDirection(Direction.Left);
                    return;
                case 'd':
                case 'ArrowRight':
                    this.board.snake.setDirection(Direction.Right);
                    return;
            }
        }
    }
}
/**
 * Startowanie gry
 */
const game = new Game();
onGameStart()
{
    game.start();
}
