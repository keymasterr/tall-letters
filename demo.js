let userAbcLoaded;
let userAbc = [];
let modelStr = '';
document.addEventListener('DOMContentLoaded', function(event) {
    createDemo();
    parseUserAbc();


});


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
        obj.model = eval('[' + inpMod.value + ']');
        useUserSym(obj);
    }
    catch(err) {
        errorEl.textContent = 'Something is wrong: ' + err;
        return
    }

    errorEl.innerHTML = '';
    inpSym.value = '';
    inpMod.value = '';
}
removeUserSym = function(click) {
    const li = click.target.parentElement;
    const ndx = Array.from(li.parentNode.children).indexOf(li);
    console.log('ndx', ndx);
    userAbc.splice(ndx, 1);
    saveUserAbc();
    abc_u = abc.concat(userAbc);
    li.remove();
}
useUserSym = function(obj) {
    abc_u.push(obj);
    userAbc.push(obj);
    let model = [];
    obj.model.forEach(str => {
        const a = "'"+ str +"'";
        model.push(a);
    });
    const modelStr = model.join(',')
    let text = "{sym: '"+ obj.sym +"', model: ["+ modelStr +"]}";

    const list = document.querySelector('.demo-user_syms');
    const li = document.createElement('li');
    li.textContent = text;
    const remEl = document.createElement('div');
    remEl.classList.add('demo-user_sym-remove');
    remEl.textContent = '×';
    remEl.addEventListener('click', removeUserSym.bind(this), true);
    li.appendChild(remEl);
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