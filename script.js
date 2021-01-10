const matrix = getMatrix(10, 10);

for (let i = 0; i < 10; i++) {
    setRandomMine(matrix);
}

const gameElement = matrixToHtml(matrix);

console.log(gameElement);

const appElement = document.querySelector('#app');
appElement.innerHTML = '';
// добавляем дачерней элемент в appEllment
appElement.append(gameElement);