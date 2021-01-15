class Game {
    constructor (args) {
        this.el = args.el;
    }
}

let matrix = null;
let running = null;

init(10, 10, 10);

document.querySelector('button').addEventListener('click', () => init(10, 10, 10));

function init(columns, rows, mines) {
    
    running = true;
    matrix = new Matrix(columns, rows, mines)

    update();
}

function update() {
    if (!running) {
        return;
    }

    const gameElement = matrix.matrixToHtml();

    const appElement = document.querySelector("#app");
    appElement.innerHTML = "";
    // добавляем дачерней элемент в appEllment
    appElement.append(gameElement);

    appElement
        .querySelectorAll('img')
        .forEach(imgElement => {
            imgElement.addEventListener('mousedown', mousedownHandler);
            imgElement.addEventListener('mouseup', mouseupHandler);
            imgElement.addEventListener('mouseleave', mouseleaveHandler);
        });
    if (matrix.isLosing) {
        alert("Увы! Вы проиграли!");
        running = false;
    } else if (matrix.isWin) {
        alert("Ура! Вы выиграли!");
        running = false;
    }

}

function mousedownHandler(event) {
    // диконструкция - сразу вытаскиваем те значения из объекта,
    // которые нам интересны
    const {
        cell,
        left,
        right
    } = getInfo(event);

    if (left) {
        cell.left = true;
    }

    if (right) {
        cell.right = true;
    }

    if (cell.left && cell.right) {
        bothHandler(cell);
    }

    update();
}

function mouseupHandler(event) {
    const {
        left,
        right,
        cell
    } = getInfo(event);
    // если на клеточке есть левый и правый флаги  и отпустили левую и правую клавишу мыши
    const both = cell.right && cell.left && (left || right);
    // проверяем есть ли левый флаг на клеточке и отжата ли левая клавиша мыши + !boht
    const leftMouse = !both && cell.left && left;
    // проверяем есть ли  правый флаг на клеточке и отжата ли правая клавиша мыши + !boht
    const rightMouse = !both && cell.right && right;

    if (both) {
        // первым аргументом передаем матрицу, а вторым функциию x.poten = false
        matrix.forEach(x => x.poten = false);
    }

    if (left) {
        cell.left = false;
    }

    if (right) {
        cell.right = false;
    }

    if (leftMouse) {
        leftHandler(cell);
    } else if (rightMouse) {
        rightHandler(cell);
    }

    update();
}

function mouseleaveHandler(event) {
    const info = getInfo(event);

    info.cell.left = false;
    info.cell.right = false;

    update();
}

function getInfo(event) {
    const element = event.target;
    // getAttribute() возвращает строку, а не число
    const cellId = parseInt(element.getAttribute('data-cell-id'));

    return {
        left: event.which === 1,
        right: event.which === 3,
        cell: matrix.getCellById(cellId),
    };
}

function leftHandler(cell) {
    if (cell.show || cell.flag) {
        return;
    }

    cell.show = true;

    matrix.showSpread(cell.x, cell.y);

}

function rightHandler(cell) {
    if (!cell.show) {
        cell.flag = !cell.flag;
    }
}

function bothHandler(cell) {
    if (!cell.show || !cell.number) {
        return
    }

    const cells = matrix.getAroundCells(cell.x, cell.y);
    // сколько вокруг этой клеточки поднято флагов
    const flags = cells.filter(x => x.flag).length;

    if (flags === cell.number) {
        cells
            .filter(x => !x.flag && !x.show)
            .forEach(cell => {
                cell.show = true;
                matrix.showSpread(cell.x, cell.y);
            });
    } else {
        cells
            .filter(x => !x.flag && !x.show)
            .forEach(cell => cell.poten = true);
    }
}