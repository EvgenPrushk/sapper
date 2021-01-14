class Matrix {
    constructor(columns, rows, mines) {
        // зис контекст, который ссылается на новый экземпляр класса
        this.columns = columns;
        this.rows = rows;
        this.mines = mines;

        this.matrix = [];

        let idCounter = 1;

        for (let y = 0; y < rows; y++) {
            const row = [];

            for (let x = 0; x < columns; x++) {
                row.push({
                    left: false,
                    right: false,
                    id: idCounter++,
                    flag: false,
                    poten: false,
                    show: false,
                    mine: false,
                    number: 0,
                    x,
                    y,
                });
            }
            this.matrix.push(row);
        }
    }
    // используем метод класса
    getRandomFreeCell() {
        const FreeCells = [];
    
        for (let y = 0; y < this.matrix.length; y++) {
            for (let x = 0; x < this.matrix[y].length; x++) {
                const cell = this.matrix[y][x];
                if (!cell.mine) {
                    FreeCells.push(cell);
                }
            }
        }
        // возврашаем случайный индекс 
        const index = Math.floor(Math.random() * FreeCells.length);
        return FreeCells[index];
    }
}




function setRandomMine(matrix) {
    // находим ячейку
    const cell = getRandomFreeCell(matrix);
    // берем все ее окружающие ячейки
    const cells = getAroundCells(matrix, cell.x, cell.y);
    // добавляем мину в ячейку 
    cell.mine = true;
    // увеличиваем счетчик мин у окружних ячеек на 1
    for (const cell of cells) {
        cell.number += 1;
    }
}

function getCell(matrix, x, y) {
    if (!matrix[y] || !matrix[y][x]) {
        return false;
    }

    return matrix[y][x];
}

function getAroundCells(matrix, x, y) {
    const cells = [];
    for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
            if (dx === 0 && dy === 0) {
                continue;
            }
            // просим клеточку из матрицы с координатами x + dx  и y + dy
            const cell = getCell(matrix, x + dx, y + dy);
            // если ячейка присутствует, то добавляем ее в массив cells
            if (cell) {
                cells.push(cell);
            }
        }
    }

    return cells;
}

// функция для нахождения id 
function getCellById(matrix, id) {
    // перебор всех элементов матрицы
    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix[y].length; x++) {
            const cell = matrix[y][x];

            if (cell.id === id) {
                return cell;
            }
        }

    }

    return false;
}

function matrixToHtml(matrix) {
    const gameElement = document.createElement('div');
    gameElement.classList.add('sapper');

    for (let y = 0; y < matrix.length; y++) {
        const rowElement = document.createElement('div');
        rowElement.classList.add('row');

        for (let x = 0; x < matrix[y].length; x++) {
            const cell = matrix[y][x];
            const imgElement = document.createElement('img');

            // остановка перетаскивания картинки
            imgElement.draggable = false;
            // остановка контекст меню
            imgElement.oncontextmenu = () => false;
            imgElement.setAttribute('data-cell-id', cell.id);
            rowElement.append(imgElement);
            if (cell.flag) {
                imgElement.src = 'assets/flag.png';
                continue;
            }

            if (cell.poten) {
                imgElement.src = 'assets/poten.png';
                continue;
            }

            if (!cell.show) {
                imgElement.src = 'assets/none.png';
                continue;
            }

            if (cell.mine) {
                imgElement.src = 'assets/mine.png';
                continue;
            }

            if (cell.number) {
                imgElement.src = 'assets/number' + cell.number + '.png';
                continue;
            }

            imgElement.src = 'assets/free.png';
        }

        gameElement.append(rowElement);
    }

    return gameElement;
}

07-00-00