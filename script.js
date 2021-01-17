new Game({
    el: document.querySelector('#app1'),
    rows: 10,
    columns: 10,
    mines: 10,
});

new Game({
    el: document.querySelector('#app2'),
    rows: 10,
    columns: 10,
    mines: 10,
});

document
    .querySelector('button')
    .addEventListener('click', () =>{
        new Game({
            el: document.querySelector('#app'),
            rows: 10,
            columns: 10,
            mines: 10,
        });
    });