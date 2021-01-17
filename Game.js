class Game {
    constructor(args) {
        this.el = args.el;
        this.running = true;
        this.matrix = new Matrix(args.columns, args.rows, args.mines);
        this.update();

    }

    update() {
        if (!this.running) {
            return;
        }
        const gameElement = this.matrix.matrixToHtml();

        this.el.innerHTML = "";
        // добавляем дачерней элемент в el
        this.el.append(gameElement);

        this.el
            .querySelectorAll('img')
            .forEach(imgElement => { // привязываем через bind()
                imgElement.addEventListener('mousedown', mousedownHandler.bind(this));
                imgElement.addEventListener('mouseup', mouseupHandler.bind(this));
                imgElement.addEventListener('mouseleave', mouseleaveHandler.bind(this));
            });
        if (this.matrix.isLosing) {
            alert("Увы! Вы проиграли!");
            this.running = false;
        } else if (this.matrix.isWin) {
            alert("Ура! Вы выиграли!");
            this.running = false;
        }
    }

    leftHandler(cell) {
        if (cell.show || cell.flag) {
            return;
        }

        cell.show = true;

        this.matrix.showSpread(cell.x, cell.y);

    }

    rightHandler(cell) {
        if (!cell.show) {
            cell.flag = !cell.flag;
        }
    }

    bothHandler(cell) {
        if (!cell.show || !cell.number) {
            return
        }

        const cells = this.matrix.getAroundCells(cell.x, cell.y);
        // сколько вокруг этой клеточки поднято флагов
        const flags = cells.filter(x => x.flag).length;

        if (flags === cell.number) {
            cells
                .filter(x => !x.flag && !x.show)
                .forEach(cell => {
                    cell.show = true;
                    this.matrix.showSpread(cell.x, cell.y);
                });
        } else {
            cells
                .filter(x => !x.flag && !x.show)
                .forEach(cell => cell.poten = true);
        }
    }
}


function init(columns, rows, mines) {

    running = true;
    matrix = new Matrix(columns, rows, mines)

    update();
}

function mousedownHandler(event) {
    // диконструкция - сразу вытаскиваем те значения из объекта,
    // которые нам интересны
    const {
        cell,
        left,
        right
    } = getInfo.call(this, event);

    if (left) {
        cell.left = true;
    }

    if (right) {
        cell.right = true;
    }

    if (cell.left && cell.right) {
        this.bothHandler(cell);
    }

    this.update();
}

function mouseupHandler(event) {
    const {
        left,
        right,
        cell
    } = getInfo.call(this, event);
    // если на клеточке есть левый и правый флаги  и отпустили левую и правую клавишу мыши
    const both = cell.right && cell.left && (left || right);
    // проверяем есть ли левый флаг на клеточке и отжата ли левая клавиша мыши + !boht
    const leftMouse = !both && cell.left && left;
    // проверяем есть ли  правый флаг на клеточке и отжата ли правая клавиша мыши + !boht
    const rightMouse = !both && cell.right && right;

    if (both) {
        // первым аргументом передаем матрицу, а вторым функциию x.poten = false
        this.matrix.forEach(x => x.poten = false);
    }

    if (left) {
        cell.left = false;
    }

    if (right) {
        cell.right = false;
    }

    if (leftMouse) {
        this.leftHandler(cell);
    } else if (rightMouse) {
        this.rightHandler(cell);
    }

    this.update();
}

function mouseleaveHandler(event) {
    const info = getInfo.call(this, event);

    info.cell.left = false;
    info.cell.right = false;

    this.update();
}

function getInfo(event) {
    const element = event.target;
    // getAttribute() возвращает строку, а не число
    const cellId = parseInt(element.getAttribute('data-cell-id'));

    return {
        left: event.which === 1,
        right: event.which === 3,
        cell: this.matrix.getCellById(cellId),
    };
}