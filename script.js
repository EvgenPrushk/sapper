const matrix = getMatrix(10, 10);

for (let i = 0; i < 10; i++) {
    setRandomMine(matrix);
}

update();

function update () {
    const gameElement = matrixToHtml(matrix);

    console.log(gameElement);

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

function mousedownHandler (event) {
    // диконструкция - сразу вытаскиваем те значения из объекта,
    // которые нам интересны
    const {cell, left, right} = getInfo(event);

    if (left) {
        cell.left = true;
    }

    if (right) {
        cell.right = true;
    }


    if (cell.left && cell.right) {
        bothHandler(cell);
    } 
}

function mouseupHandler (event) {
    const { left, right, cell } = getInfo(event);

    if () {
        
    }

    if (left) {
        cell.left = false;
    }

    if (right) {
        cell.right = false;
    }
    console.log(info);
}

function mouseleaveHandler(event) {
    const info = getInfo(event);

    info.cell.left = false;
    info.cell.right = false;
}

function getInfo (event) {
    const element = event.target;
    // getAttribute() возвращает строку, а не число
    const cellId = parseInt(element.getAttribute('data-cell-id'));

    return {
        left: event.which === 1,
        right:event.which === 3,
        cell: getCellById(matrix, cellId),
    };
}

function leftHandler(event) {
    console.log('leftHandler');
}

function rightHandler(event) {
    console.log('rightHandler');
}

function bothHandler(event) {
    console.log('bothHandler');
}