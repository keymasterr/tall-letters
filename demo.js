const lib = JsonUrl('lzma');
let userAbcLoaded;
let userAbc = [];
let modelStr = '';
let importAbc = [];
let shareLinkInput;
document.addEventListener('DOMContentLoaded', function(event) {
    createDemo();
    renderInitialAbc();
    parseUserAbc();
    parseDemo();
    readUrl();

    document.querySelector('#prefer-user').checked = preferUser;
    shareLinkInput = document.querySelector('.share-link-input');
});

readUrl = function() {
    const queryStr = window.location.search;
    const urlParams = new URLSearchParams(queryStr);
    const text = urlParams.get('str');
    importAbc = urlParams.get('im');

    if (text) {
        inp.value = unescape(text);
        render();
    }

    if (importAbc) {
        decompressUserAbc(importAbc);
    }
}

removeImportSym = function(click) {
    const li = click.target.parentElement;
    const ndx = parseInt(Array.from(li.parentNode.children).indexOf(li) - 1);
    importAbc.splice(ndx, 1);
    li.remove();
}
renderImportAbc = function() {
    const list = document.createElement('ul');
    list.classList.add('demo-syms');

    importAbc.forEach(obj => {
        const li = document.createElement('li');
        const renderedSymEl = renderSym(obj);
        let model = [];
        obj.model.forEach(str => {
            const a = "'"+ str +"'";
            model.push(a);
        });

        const modelStr = model.join(',');
        let text = "{sym: '"+ obj.sym +"', model: ["+ modelStr +"]}";
        li.appendChild(renderedSymEl);
        li.title = text;

        const symEl = document.createElement('div');
            symEl.classList.add('demo-sym-sym');
            symEl.textContent = obj.sym;
        li.appendChild(symEl);

        const remEl = document.createElement('div');
            remEl.classList.add('demo-sym-remove','modal-sym-remove');
            remEl.textContent = '×';
            remEl.addEventListener('click', removeImportSym.bind(this), false);
        li.appendChild(remEl);

        list.appendChild(li);
    });

    return list
}

renderInitialAbc = function() {
    const list = document.querySelector('.init_syms .demo-syms');

    abc.forEach(obj => {
        const li = document.createElement('li');
        const renderedSymEl = renderSym(obj);
        let model = [];
        obj.model.forEach(str => {
            const a = "'"+ str +"'";
            model.push(a);
        });
        const modelStr = model.join(',');
        let text = "{sym: '"+ obj.sym +"', model: ["+ modelStr +"]}";
        renderedSymEl.addEventListener('click', parseModelToDemo.bind(this, '['+ modelStr +']'));
        li.appendChild(renderedSymEl);
        li.title = text;

        const symEl = document.createElement('div');
            symEl.classList.add('demo-sym-sym');
            symEl.textContent = obj.sym;
        li.appendChild(symEl);

        list.appendChild(li);
    });
}


parseUserAbc = function() {
    userAbcLoaded = JSON.parse(localStorage.getItem('user-abc'));
    if (!userAbcLoaded) {
        userAbcLoaded = [];
    }
    userAbcLoaded.forEach(obj => {
        useUserSym(obj);
    });

    inp.addEventListener('input', function() {
        render(this.value);
    });
}
addUserSym = function() {
    event.preventDefault();
    const inpSym = document.querySelector('.demo-add_sym-sym');
    const inpMod = document.querySelector('.demo-add_sym-model');
    const errorEl = document.querySelector('.demo-add_sym-error');

    const obj = {};
    let sym = inpSym.value;
    obj.sym = sym.toLowerCase();
    obj.author = 'user';

    try {
        if (!modelRegex.test((`[${inpMod.value}]`))) {
            return
        }
        obj.model = eval('[' + inpMod.value + ']');
        useUserSym(obj);
    }
    catch(err) {
        errorEl.textContent = 'Something is wrong: ' + err;
        return
    }

    errorEl.innerHTML = '';
    inpSym.value = '';
    // inpMod.value = '';
}
removeUserSym = function(click) {
    const li = click.target.parentElement;
    const ndx = parseInt(Array.from(li.parentNode.children).indexOf(li) - 1);
    userAbc.splice(ndx, 1);
    saveUserAbc();
    abc_u = abc.concat(userAbc);
    li.remove();
    stopPropagation();
}
useUserSym = function(obj) {
    abc_u.push(obj);
    userAbc.push(obj);
    let model = [];
    obj.model.forEach(str => {
        const a = "'"+ str +"'";
        model.push(a);
    });
    const modelStr = model.join(',');
    let text = "{sym: '"+ obj.sym +"', model: ["+ modelStr +"]}";

    const list = document.querySelector('.user_syms .demo-syms');
    const li = document.createElement('li');
    const renderedSymEl = renderSym(obj);
    renderedSymEl.addEventListener('click', parseModelToDemo.bind(this, '['+ modelStr +']'));
    li.appendChild(renderedSymEl);
    li.title = text;

    const remEl = document.createElement('div');
        remEl.classList.add('demo-sym-remove');
        remEl.textContent = '×';
        remEl.addEventListener('click', removeUserSym.bind(this), true);
    li.appendChild(remEl);

    const symEl = document.createElement('div');
        symEl.classList.add('demo-sym-sym');
        symEl.textContent = obj.sym;
    li.appendChild(symEl);

    list.appendChild(li);
    saveUserAbc();
    abc_u = abc.concat(userAbc);
}
saveUserAbc = function() {
    localStorage.setItem('user-abc', JSON.stringify(userAbc));
}

initDemo = function(col) {
    let demo;
    if (!col) {
        const oldDemo = document.querySelector('.demo');
        document.querySelector('.demo-container').prepend(oldDemo.cloneNode(true));
        oldDemo.remove();
        demo = document.querySelector('.demo');
    } else {
         demo = col;
    }
    demo.querySelectorAll('.demo-cell').forEach(cell => {
        cell.addEventListener('click', function() {
            const prevCell = this.previousElementSibling;
            const nextCell = this.nextElementSibling;
            if (this.classList.contains('active')) {
                this.classList.remove('active', 'linkable', 'first-chain-cell', 'chain-cell', 'last-chain-cell');
                const childrenArr = Array.from(this.children);
                childrenArr.forEach(div => {
                    div.classList.remove('active','inactive','linked')
                })
                if (prevCell) {
                    prevCell.classList.remove('linkable');
                    if (prevCell.classList.contains('chain-cell')) {
                        prevCell.classList.remove('chain-cell');
                        prevCell.classList.add('last-chain-cell');
                        prevCell.querySelector('.demo-link.linked').classList.remove('linked');
                    } else if (prevCell.classList.contains('first-chain-cell')) {
                        prevCell.classList.remove('first-chain-cell');
                        prevCell.querySelector('.demo-link.linked').classList.remove('linked')
                    }
                }
                if (nextCell) {
                    if (nextCell.classList.contains('last-chain-cell')) {
                        nextCell.classList.remove('last-chain-cell');
                    } else if (nextCell.classList.contains('chain-cell')) {
                        nextCell.classList.remove('chain-cell');
                        nextCell.classList.add('first-chain-cell');
                    }
                }
            } else {
                this.classList.add('active');
                if (nextCell?.classList.contains('active')) {
                    this.classList.add('linkable')
                }
                if (prevCell?.classList.contains('active')) {
                    prevCell.classList.add('linkable');
                }
            }
        });
    });

    demo.querySelectorAll('div[class*="demo-rs_"').forEach(corner => {
        corner.addEventListener('click', function() {
            this.classList.toggle('inactive');
            event.stopPropagation();
        });
    });

    demo.querySelectorAll('div[class*="demo-d_"').forEach(dash => {
        dash.addEventListener('click', function() {
            this.classList.toggle('active');
            event.stopPropagation();
        });
    });

    demo.querySelectorAll('.demo-link').forEach(link => {
        const cell = link.parentElement;
        const nextCell = cell.nextElementSibling;

        link.addEventListener('click', function() {
            event.stopPropagation();
            if (!nextCell) { return };
            if (cell.classList.contains('active') && nextCell.classList.contains('active')) {
                if (this.classList.contains('linked')) {
                    this.classList.remove('linked');
                    if (cell.classList.contains('chain-cell')) {
                        cell.classList.remove('chain-cell');
                        cell.classList.add('last-chain-cell');
                    } else if (cell.classList.contains('first-chain-cell')) {
                        cell.classList.remove('first-chain-cell');
                    }
                    if (nextCell.classList.contains('chain-cell')) {
                        nextCell.classList.remove('chain-cell');
                        nextCell.classList.add('first-chain-cell');
                    } else if (nextCell.classList.contains('last-chain-cell')) {
                        nextCell.classList.remove('last-chain-cell');
                    }
                } else {
                    this.classList.add('linked');
                    cell.querySelectorAll('.demo-rs_bl, .demo-rs_br, demo-d_bl, demo-d_br').forEach(el => {
                        el.classList.remove('active','inactive');
                    });
                    nextCell.querySelectorAll('.demo-rs_tl, .demo-rs_tr, .demo-d_tl, .demo-d_tr').forEach(el => {
                        el.classList.remove('active','inactive');
                    });
                    if (cell.classList.contains('last-chain-cell')) {
                        cell.classList.remove('last-chain-cell');
                        cell.classList.add('chain-cell');
                    } else {
                        cell.classList.add('first-chain-cell');
                    }
                    if (nextCell.classList.contains('first-chain-cell')) {
                        nextCell.classList.remove('first-chain-cell');
                        nextCell.classList.add('chain-cell');
                    } else {
                        nextCell.classList.add('last-chain-cell');
                    }
                }
            }
        });
    });

    demo.querySelectorAll('.remove-col-btn').forEach(btn => {
        btn.addEventListener('click', removeCol.bind(this), true);
    });

    demo.querySelectorAll('div').forEach(el => {
        el.addEventListener('click', parseDemo);
    });
}

createDemo = function() {
    const demo = document.querySelector('.demo');
    const addColEl = document.createElement('div');
    addColEl.classList.add('add-col-btn');
    addColEl.textContent = '+';
    addColEl.addEventListener('click', createCol, true);
    demo.appendChild(addColEl);

    demo.querySelectorAll('.demo-col').forEach(col => {initDemo(col)});
    demo.querySelectorAll('div').forEach(el => {
        el.addEventListener('click', parseDemo);
    });
}
createCol = function() {
    const demo = document.querySelector('.demo');

    const col = document.createElement('div');
    col.classList.add('demo-col');
    for (let i = 0; i < 6; i++) {
        col.appendChild(createCell());
    }

    const removeColEl = document.createElement('div');
    removeColEl.classList.add('remove-col-btn');
    removeColEl.textContent = '×';
    col.appendChild(removeColEl);

    initDemo(col);
    demo.appendChild(col);
}
removeCol = function(click) {
    click.target.parentElement.remove();
}
createCell = function() {
    const cell = document.createElement('div');
    cell.classList.add('demo-cell');
    let divs = ['demo-d_tl','demo-d_tr','demo-d_bl','demo-d_br','demo-rs_tl','demo-rs_tr','demo-rs_bl','demo-rs_br','demo-link'];
    divs.forEach(el => {
        const elDiv = document.createElement('div');
        elDiv.classList.add(el);
        cell.appendChild(elDiv);
    });
    return cell;
}

parseDemo = function() {
    let model = [];
    modelStr = '';
    const demo = document.querySelector('.demo');
    const cols = demo.querySelectorAll('.demo-col');
    const output = document.querySelector('.demo-add_sym-model');

    cols.forEach(col => {
        let lngth = 0;
        let colStr = '';
        col.querySelectorAll('.demo-cell').forEach(cell => {
            lngth++;
            let nextCell = cell.nextElementSibling?.classList.contains('demo-cell')
                ? cell.nextElementSibling
                : false;
            if (cell.classList.contains('active')) {
                if (
                    !(cell.classList.contains('chain-cell'))
                &&  !(cell.classList.contains('last-chain-cell'))
                ) {
                    cell.querySelector('.demo-d_tl.active') && (colStr += '<');
                    cell.querySelector('.demo-d_tr.active') && (colStr += '>');
                    cell.querySelector('.demo-rs_tl.inactive') && (colStr += '(');
                    cell.querySelector('.demo-rs_tr.inactive') && (colStr += ')');
                }
                if (
                    !(cell.classList.contains('first-chain-cell'))
                &&  !(cell.classList.contains('chain-cell'))
                ) {
                    colStr += lngth.toString();
                    lngth = 0;
                    cell.querySelector('.demo-d_bl.active') && (colStr += '<');
                    cell.querySelector('.demo-d_br.active') && (colStr += '>');
                    cell.querySelector('.demo-rs_bl.inactive') && (colStr += '(');
                    cell.querySelector('.demo-rs_br.inactive') && (colStr += ')');
                    colStr += ',';
                }
            } else if (nextCell && !(nextCell.classList.contains('active'))) {
                return
            } else {
                colStr += '0' + lngth.toString() + ',';
                lngth = 0;
            }
        });
        model.push(colStr.slice(0, -1));
    });
    modelStr = '\''+ model.join('\',\'') +'\'';

    output.value = modelStr;
}
importFromDesigner = function() {
    const output = document.querySelector('.demo-add_sym-model');
    output.value = modelStr;
}

renderSym = function(symObj) {
    if (typeof symObj !== 'object' || symObj === null) {
        return '×'
    };

    let symEl = document.createElement('div');
    symEl.classList.add('sym');
    symEl.dataset.sym = symObj.sym;
    let symColsNum = 0;

    symObj.model.forEach(col => {
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
                        case '<':
                            if (before) {
                                cellEl.classList.add('d-tl')
                            } else {
                                cellEl.classList.add('d-bl')
                            }
                            break
                        case '>':
                            if (before) {
                                cellEl.classList.add('d-tr')
                            } else {
                                cellEl.classList.add('d-br')
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
        symEl.appendChild(colEl);
        symColsNum++;
    });
    symEl.style.width = (symColsNum * .75) + 'em';

    return symEl;
}

parseModelToDemo = function(model) {
    if (!modelRegex.test(model)) {
        console.error('Wrong symbol model');
        return false
    }

    const demo = document.querySelector('.demo');

    demo.querySelectorAll('.demo-col').forEach(c => {
        c.remove();
    })

    model = eval(model);
    model.forEach(mCol => {
        createCol();
        const col = demo.querySelector('.demo-col:last-of-type');
        const cellslArr = mCol.split(',');
        let curCell = 0;

        cellslArr.forEach(c => {
            if (c.includes('0')) {
                curCell += parseInt(c.match(/[1-6]/)[0]);
                return
            }

            const l = parseInt(c.match(/\d+/)[0]);
            const cellEnd = curCell + l;
            const cellElsArr = Array.from(col.querySelectorAll('.demo-cell')).slice(curCell, cellEnd);

            cellElsArr.forEach(el => el.click());
            cellElsArr.forEach(el => el.querySelector('.demo-link').click());


            const firstMods = c.match(/^[()<>]*/)[0];
            const lastMods = c.match(/[()<>]*$/)[0];
            const firstCell = cellElsArr[0];
            const lastCell = cellElsArr[cellElsArr.length - 1];

            firstMods.split('').forEach(t => {
                switch (t) {
                    case '<':
                        firstCell.querySelector('.demo-d_tl').click();
                        break
                    case '>':
                        firstCell.querySelector('.demo-d_tr').click();
                        break
                    case '(':
                        firstCell.querySelector('.demo-rs_tl').click();
                        break
                    case ')':
                        firstCell.querySelector('.demo-rs_tr').click();
                        break
                }
            });

            lastMods.split('').forEach(t => {
                switch (t) {
                    case '<':
                        lastCell.querySelector('.demo-d_bl').click();
                        break
                    case '>':
                        lastCell.querySelector('.demo-d_br').click();
                        break
                    case '(':
                        lastCell.querySelector('.demo-rs_bl').click();
                        break
                    case ')':
                        lastCell.querySelector('.demo-rs_br').click();
                        break
                }
            });

            curCell += l;
        });
    })
}

sortUserAbc = function() {
    var list = document.querySelector('.user_syms .demo-syms');

    [...list.querySelectorAll('li')]
        .sort((a,b) => {
            if (a.classList.contains('demo-syms-placeholder') || b.classList.contains('demo-syms-placeholder')) { return -1 };
            const aa = a.querySelector('.sym').dataset.sym;
            const bb = b.querySelector('.sym').dataset.sym;
            return aa.localeCompare(bb)
        })
        .forEach(node => list.appendChild(node));



    userAbc.sort((a,b) => {
        return a.sym.localeCompare(b.sym);
    });
    saveUserAbc();
}

decompressUserAbc = function(str) {
    lib.decompress(str).then(output => {
        importAbc = [...output];
        importAbc.forEach(el => {
            el.author = 'import';
        });

        createModal(renderImportAbc());
    });
}

compressUserAbc = function() {
    const shareLinkWrEl = document.querySelector('.share-link');
    arr = [...userAbc];
    arr.forEach(el => {
        if (el.hasOwnProperty('author')) {
            delete el.author;
        }
    });
    lib.compress(arr).then(output => {
        const newLink = new URL(`${location.protocol}//${location.host}${location.pathname}`);
        newLink.searchParams.append("im", output);
        shareLinkInput.value = newLink;
        shareLinkInput.addEventListener('click', function() {
            this.select();
            this.setSelectionRange(0, 99999);
        });

        shareLinkWrEl.style.display = 'block';
    });
}

createModal = function(html, isImport) {
    const modEl = document.createElement('div');
    modEl.classList.add('modal');

    modEl.appendChild(html);

    const btnsWrEl = document.createElement('div');
    btnsWrEl.classList.add('modal-footer');

    const btnCloseEl = document.createElement('button');
    btnCloseEl.textContent = 'Close';
    btnCloseEl.addEventListener('click', closeModal);
    btnsWrEl.appendChild(btnCloseEl);

    if (isImport !== false) {
        const btnImportEl = document.createElement('button');
        btnImportEl.textContent = 'Import';
        btnImportEl.addEventListener('click', () => {
            importAbc.forEach(el => {
                el.author = 'user';
                useUserSym(el);
            });
            closeModal();
        });
        btnsWrEl.appendChild(btnImportEl);
    }

    modEl.appendChild(btnsWrEl);

    const modWrEl = document.createElement('div');
    modWrEl.classList.add('modal-wrapper');

    modWrEl.appendChild(modEl);
    document.body.classList.add('modal-lock');
    document.body.appendChild(modWrEl);

    document.addEventListener('click', function(event) {
        if (!document.body.classList.contains('modal-lock')) { return }

        const flyoutElement = document.querySelector('.modal');
        let targetElement = event.target;

        if (targetElement.classList.contains('modal-sym-remove')) { return }

        do {
            if (targetElement == flyoutElement) { return }
            targetElement = targetElement.parentNode;
        } while (targetElement);

        closeModal();
    });
}
closeModal = function() {
    render();
    document.body.classList.remove('modal-lock');
    document.querySelector('.modal-wrapper').remove();
    importAbc = [];
    window.history.replaceState({}, document.title, window.location.pathname);
}

copyShareLink = function() {
    shareLinkInput.select();
    shareLinkInput.setSelectionRange(0, 99999);
    document.execCommand("copy");
}