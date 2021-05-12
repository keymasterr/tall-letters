let inp = document.querySelector('.input');
let disp = document.querySelector('.display');

inp.addEventListener('input', function() {
    render(this.value);
});

render = function(text) {
    let rendered = [];
    const symsArr = text.toLowerCase().split('');

    symsArr.forEach(sym => {
        const symModelsArr = abc.filter(el => el.sym === sym);
        const symModelsNum = symModelsArr.length;
        if (symModelsNum > 0) {
            const rnd = Math.floor(Math.random() * symModelsNum);
            const model = symModelsArr[rnd].model;

            model.forEach(col => {
                let colEl = document.createElement('div');
                colEl.classList.add('col');
                const cellsArr = col.split(',');

                cellsArr.forEach(cell => {
                    let cellEl = document.createElement('div');
                    cellEl.classList.add('cell', 'sol');

                    let before = true;
                    const reg = /(\d+)/;
                    const parsedCellModelArr = cell.split(reg);

                    parsedCellModelArr.forEach(part => {
                        reg.test(part) && (before = false);
                        const tokensArr = part.split('');

                        tokensArr.forEach(token => {
                            switch(token) {
                                case '-':
                                    if (before) {
                                        cellEl.classList.add('d-t')
                                    } else {
                                        cellEl.classList.add('d-b')
                                    }
                                    break
                                case '(':
                                    if (before) {
                                        cellEl.classList.add('rs-tl')
                                    } else {
                                        cellEl.classList.add('rs-bl')
                                    }
                                    break
                                case ')':
                                    if (before) {
                                        cellEl.classList.add('rs-tr')
                                    } else {
                                        cellEl.classList.add('rs-br')
                                    }
                                    break
                                case '0':
                                    cellEl.classList.remove('sol')
                                    break
                                case '1':
                                    cellEl.classList.add('s1')
                                    break
                                case '2':
                                    cellEl.classList.add('s2')
                                    break
                                case '3':
                                    cellEl.classList.add('s3')
                                    break
                                case '4':
                                    cellEl.classList.add('s4')
                                    break
                                case '5':
                                    cellEl.classList.add('s5')
                                    break
                                case '6':
                                    cellEl.classList.add('s6')
                                    break
                            }
                        });
                    });
                    colEl.appendChild(cellEl);
                });
                rendered.push(colEl);
            });
        } else {
            noSymbol(sym);
        }
    });
    disp.innerHTML = '';
    rendered.forEach(el => {
        disp.appendChild(el);
    });
}

noSymbol = function(sym) {
    console.debug('No model for "' + sym + '"');
}

render(inp.value);