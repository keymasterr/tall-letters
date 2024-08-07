let inp = document.querySelector('.text-input');
let disp = document.querySelector('.display');
let preferUser = false;
let highlightUser = false;
let abc_u = abc;
const modelRegex = /^\[(\'[<>()]*0?[1-6][<>()]*(,[<>()]*0?[1-6][<>()]*)*\')(,\'[<>()]*0?[1-6][<>()]*(,[<>()]*0?[1-6][<>()]*)*\')*\]$/;

inp.value = 'tall letters';
inp.addEventListener('input', function() {
    render();
});

render = function(text) {
    let rendered = [];
    if (!text) { text = inp.value }
    let symsArr = text.toLowerCase().split('');

    let cursor = document.createElement('div');
    cursor.classList.add('cursor');
    rendered.push(cursor);

    symsArr.forEach(sym => {
        let symEl = document.createElement('div');
        symEl.classList.add('sym');
        symEl.dataset.sym = sym;
        let symColsNum = 0;
        let symModelsArr = abc_u.filter(el => el.sym === sym);
        if (preferUser) {
            let userSymsArr = symModelsArr.filter(el => el.author === 'user');
            if (userSymsArr.length > 0) {
                symModelsArr = userSymsArr;
            }
        }
        const symModelsNum = symModelsArr.length;
        if (symModelsNum > 0) {
            const rnd = Math.floor(Math.random() * symModelsNum);
            const model = symModelsArr[rnd].model;
            if (symModelsArr[rnd].hasOwnProperty('author')) {
                symEl.dataset.author = symModelsArr[rnd].author;
            }

            model.forEach(col => {
                let colEl = document.createElement('div');
                colEl.classList.add('col');
                const cellsArr = col.split(',');

                cellsArr.forEach(cell => {
                    let cellEl = document.createElement('div');
                    cellEl.classList.add('cell', 'sol');

                    let before = true;
                    const regDigits = /(\d+)/;
                    const parsedCellModelArr = cell.split(regDigits);

                    parsedCellModelArr.forEach(part => {
                        regDigits.test(part) && (before = false);
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
            symEl.style.flexGrow = symColsNum;
            rendered.push(symEl);
        } else {
            noSymbol(sym);
            return
        }
    });
    disp.innerHTML = '';
    rendered.forEach(el => {
        disp.appendChild(el);
    });
}

noSymbol = function(sym) {
    // console.debug('No model for "' + sym + '"');
    const text = inp.value.replace(new RegExp(sym, 'g'), '');
    inp.value = text;

    const posx = parseFloat(inp.offsetLeft) + (parseFloat(inp.offsetWidth) + 10);
    const posy = parseFloat(inp.offsetTop); // + (parseFloat(inp.offsetHeight) / 2)

    const nonexSymsEl = document.createElement('div');
    nonexSymsEl.textContent = sym;
    nonexSymsEl.classList.add('nonex-syms');
    nonexSymsEl.style.left = `${posx}px`;
    nonexSymsEl.style.top = `${posy}px`;

    const trembleSize = ~~(Math.random() * 7 - 3);
    nonexSymsEl.style.setProperty('--nonex-tremble', `${trembleSize}px`);

    document.body.appendChild(nonexSymsEl);
    setTimeout(() => {
        nonexSymsEl.remove()
    }, 400);
}


preferUserCheckbox = function() {
    preferUser = !preferUser;
    render();
}

let vh = 0;
windowSizes = function() {
    const height = window.innerHeight|| document.documentElement.clientHeight||
document.body.clientHeight;
    vh = height / 100;
}
lettersResize = function() {
    let scrollMod = 0;
    const scrollPos = window.scrollY;
    scrollMod = (90 * vh) - scrollPos;
    if (scrollMod < 152) {
        document.querySelector('.display-wrapper').style.setProperty('--scroll-mod', ((90 * vh) - 152) + 'px');
    } else {
        document.querySelector('.display-wrapper').style.setProperty('--scroll-mod', scrollPos + 'px');
    }
}
window.addEventListener("resize", windowSizes, false);
window.addEventListener('scroll', lettersResize);

let cursorTimer;
updateCursor = function() {
    const cursor = disp.querySelector('.cursor');
    const startPosition = inp.selectionStart;
    const endPosition = inp.selectionEnd;
    const startLetter = disp.childNodes[startPosition];
    const endLetter = disp.childNodes[endPosition];
    let x1, x2;

    if (startPosition == endPosition) {
        cursor.classList.remove('range');
        if (startPosition === 0) {
            x1 = 0;
        } else {
            x1 = startLetter.offsetLeft + startLetter.offsetWidth;
        }
        cursor.style.width = '';
    } else {
        cursor.classList.add('range');
        if (startPosition === 0) {
            x1 = 0;
        } else {
            x1 = startLetter.offsetLeft + startLetter.offsetWidth;
        }
        if (endPosition === 0) {
            x2 = 0;
        } else {
            x2 = endLetter.offsetLeft + endLetter.offsetWidth;
        }
        cursor.style.width = (x2 - x1) + 'px';
    }

    cursor.style.left = x1 + 'px';
}
inp.addEventListener('focus', () => {
    disp.classList.add('focus');
    updateCursor();
    setInterval(updateCursor, 50);
});
inp.addEventListener('blur', () => {
    disp.classList.remove('focus');
    clearInterval(cursorTimer);
});
inp.addEventListener('input', updateCursor);
inp.addEventListener('change', updateCursor);
disp.addEventListener('click', () => {
    inp.focus();
    const tmpStr = inp.value;
    inp.value = '';
    inp.value = tmpStr;
});

render();
windowSizes();

highlightUserToggle = function() {
    highlightUser = !highlightUser;
    disp.classList.toggle('highlight-user');
}

document.querySelector('#gap-size').addEventListener('input', (event) => {
    document.documentElement.style.setProperty('--gap', `${event.target.value}px`);
});
document.querySelector('#radius-size').addEventListener('input', (event) => {
    document.documentElement.style.setProperty('--rs', `${event.target.value}vh`);
});
const pickrBg = Pickr.create({
    el: '.pickr-bg',
    theme: 'nano',
    comparison: false,
    lockOpacity: true,
    components: {
        preview: false,
        opacity: false,
        hue: true,
        interaction: {
            hex: false,
            rgba: false,
            hsla: false,
            hsva: false,
            cmyk: false,
            input: true,
            clear: false,
            save: false,
        },
    },
    default: '#ffdb70',
});
pickrBg.on('change', (color, source, instance) => {
    document.documentElement.style.setProperty('--bg', `#${color.toHEXA().join('')}`);
});
const pickrCellBg = Pickr.create({
    el: '.pickr-cell',
    theme: 'nano',
    comparison: false,
    lockOpacity: true,
    components: {
        preview: false,
        opacity: false,
        hue: true,
        interaction: {
            hex: false,
            rgba: false,
            hsla: false,
            hsva: false,
            cmyk: false,
            input: true,
            clear: false,
            save: false,
        },
    },
    default: '#28292b',
});
pickrCellBg.on('change', (color, source, instance) => {
    document.documentElement.style.setProperty('--cell-bg', `#${color.toHEXA().join('')}`);
});

scrsh = function() {
    const el = document.querySelector(".display-wrapper");
    const isBackground = document.querySelector("#is-background").checked;
    const bgColor = isBackground ? document.defaultView.getComputedStyle(document.body).backgroundColor : null;
    !bgColor && el.style.setProperty('--cell-bg', '#000');
    html2canvas(
        el,
        {   imageTimeout: 0
        ,   backgroundColor: bgColor
        ,   logging: false
        ,   onclone: function() {
                const iframe = document.querySelector('.html2canvas-container');
                const cloneEl = iframe.contentWindow.document.querySelector(".display-wrapper");
                cloneEl.style.setProperty('position', 'relative');
            }
        }
    ).then(canvas => {
        // const image = new Image();
        // image.id = "pic";
        // image.src = canvas.toDataURL();
        // image.style.maxWidth = '100%';
        // createModal(image, false);


        const link = document.createElement('a');
        let filename = `tall_letters-${inp.value}-${Date.now()}`;
        let text = canvas.toDataURL();
        link.setAttribute('href', text);
        link.setAttribute('download', filename);
        link.setAttribute('target', '_blank');

        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        el.style.removeProperty('--cell-bg');
    });
}