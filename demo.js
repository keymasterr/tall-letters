initDemo = function() {
    const demo = document.querySelector('.demo');
    demo.querySelectorAll('.demo-cell').forEach(cell => {
        cell.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    });

    demo.querySelectorAll('div[class*="demo-rs_"').forEach(corner => {
        corner.addEventListener('click', function() {
            this.classList.toggle('inactive');
            event.stopPropagation();
        });
    });
}
initDemo();