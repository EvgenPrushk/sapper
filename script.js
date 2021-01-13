const matrix = getMatrix(10, 10);

for (let i = 0; i < 10; i++) {
    setRandomMine(matrix);
}

update();

function update() {
    const gameElement = matrixToHtml(matrix);

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
        forEach(matrix, x => x.poten = false);
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
        cell: getCellById(matrix, cellId),
    };
}

function leftHandler(cell) {
    if (cell.show || cell.flag) {
        return;
    }

    cell.show = true;

    showSpread(matrix, cell.x, cell.y);

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

    const cells = getAroundCells(matrix, cell.x, cell.y);
    // сколько вокруг этой клеточки поднято флагов
    const flags = cells.filter(x => x.flag).length;

    if (flags === cell.number) {
        cells
            .filter(x => !x.flag && !x.show)
            .forEach(cell => {
                cell.show = true;
                showSpread(matrix, cell.x, cell.y);
            });
    } else {
        cells
            .filter(x => !x.flag && !x.show)
            .forEach(cell => cell.poten = true);
    }
}

function forEach(matrix, handler) {
    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix[y].length; x++) {
            //  функция принимает все значения матрицы
            handler(matrix[y][x]);
        }
    }
}

function showSpread(matrix, x, y) {
    const cell = getCell(matrix, x, y);

    if (cell.number || cell.mine || cell.flag) {
        return;
    }

    forEach(matrix, x => x._marked = false);

    cell._marked = true;

    let flag = true;

    while (flag) {
        flag = false;
        // пробегаемся по все элементам матрицы 
        for (let y = 0; y < matrix.length; y++) {
            for (let x = 0; x < matrix.length; x++) {
                const cell = matrix[y][x];
                // проверяем замаркированна ли она, если нет, то выходим из цикла
                if (!cell._marked || cell.number) {
                    continue;
                }
                // пробегаемся по всем ячейкам рядом с промаркированной
                const cells = getAroundCells(matrix, x, y);

                for (const cell of cells) {
                    if (cell._marked ) {
                        continue;
                    }

                    if (!cell.flag && !cell.mine) {
                        cell._marked = true;
                        flag = true;
                    }
                }
            }
        }
    }

    
    forEach(matrix, x => {
        if (x._marked) {
        x.show = true;
        }
        delete x._marked;
    });
}