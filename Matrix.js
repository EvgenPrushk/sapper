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
        for (let i = 0; i < mines; i++) {
            // находим ячейку
            const cell = this.getRandomFreeCell();
            // берем все ее окружающие ячейки
            const cells = this.getAroundCells(cell.x, cell.y);
            // добавляем мину в ячейку 
            cell.mine = true;
            // увеличиваем счетчик мин у окружних ячеек на 1
            for (const cell of cells) {
                cell.number += 1;
            }
        }
    }

    // используем метод класса
    getRandomFreeCell() {
        const freeCells = [];

        for (let y = 0; y < this.matrix.length; y++) {
            for (let x = 0; x < this.matrix[y].length; x++) {
                const cell = this.matrix[y][x];
                if (!cell.mine) {
                    freeCells.push(cell);
                }
            }
        }
        // возврашаем случайный индекс 
        const index = Math.floor(Math.random() * freeCells.length);
        return freeCells[index];
    }

    getAroundCells(x, y) {
        const cells = [];

        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                if (dx === 0 && dy === 0) {
                    continue;
                }
                // просим клеточку из матрицы с координатами x + dx  и y + dy
                const cell = this.getCell(x + dx, y + dy);
                // если ячейка присутствует, то добавляем ее в массив cells
                if (cell) {
                    cells.push(cell);
                }
            }
        }

        return cells;
    }

    getCell(x, y) {
        if (!this.matrix[y] || !this.matrix[y][x]) {
            return false;
        }

        return this.matrix[y][x];
    }

    getCellById(id) {
        // перебор всех элементов матрицы
        for (let y = 0; y < this.matrix.length; y++) {
            for (let x = 0; x < this.matrix[y].length; x++) {
                const cell = this.matrix[y][x];

                if (cell.id === id) {
                    return cell;
                }
            }

        }

        return false;
    }

    matrixToHtml() {
        const gameElement = document.createElement('div');
        gameElement.classList.add('sapper');

        for (let y = 0; y < this.matrix.length; y++) {
            const rowElement = document.createElement('div');
            rowElement.classList.add('row');

            for (let x = 0; x < this.matrix[y].length; x++) {
                const cell = this.matrix[y][x];
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

    forEach(handler) {
        for (let y = 0; y < this.matrix.length; y++) {
            for (let x = 0; x < this.matrix[y].length; x++) {
                //  функция принимает все значения матрицы
                handler(this.matrix[y][x]);
            }
        }
    }

    showSpread(x, y) {
        const cell = this.getCell(x, y);

        if (cell.number || cell.mine || cell.flag) {
            return;
        }

        this.forEach(x => x._marked = false);

        cell._marked = true;

        let flag = true;

        while (flag) {
            flag = false;
            // пробегаемся по все элементам матрицы 
            for (let y = 0; y < this.matrix.length; y++) {
                for (let x = 0; x < this.matrix.length; x++) {
                    const cell = this.matrix[y][x];
                    // проверяем замаркированна ли она, если нет, то выходим из цикла
                    if (!cell._marked || cell.number) {
                        continue;
                    }
                    // пробегаемся по всем ячейкам рядом с промаркированной
                    const cells = this.getAroundCells(x, y);

                    for (const cell of cells) {
                        if (cell._marked) {
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

        this.forEach(x => {
            if (x._marked) {
                x.show = true;
            }
            delete x._marked;
        });
    }

    get isWin() {
        const flags = [];
        const mines = [];
        // пробегаемся по всем элементам матрицы, если на ней есть флаг или мина добавляем в массив
        this.forEach(cell => {
            if (cell.flag) {
                flags.push(cell);
            }

            if (cell.mine) {
                mines.push(cell);
            }
        });
        if (flags.length !== mines.length) {
            return false;
        }

        for (const cell of mines) {
            if (!cell.flag) {
                return false;
            }
        }

        for (let y = 0; y < this.matrix.length; y++) {
            for (let x = 0; x < this.matrix[y].length; x++) {
                const cell = this.matrix[y][x];

                if (!cell.mine && !cell.show) {
                    return false;
                }
            }
        }

        return true;
    }

    get isLosing() {
        for (let y = 0; y < this.matrix.length; y++) {
            for (let x = 0; x < this.matrix[y].length; x++) {
                const cell = this.matrix[y][x];

                if (cell.mine && cell.show) {
                    return true;
                }
            }
        }

        return false;
    }

}




