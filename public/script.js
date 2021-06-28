var play = document.querySelector('.btn.play');
var layer = document.querySelector('.loginlayer');
var login = document.querySelector('.loginlayer button');
var close = document.querySelector('.loginlayer .close');



play.addEventListener('click', () => {
    layer.classList.remove('hide');

    close.addEventListener('click', () => {
        layer.classList.add('hide');
    })

    login.addEventListener('click', () => {
        let userval = document.querySelector('#inputuser').value;
        let passval = document.querySelector('#inputpass').value;
        if (userval == 'admin' && passval == 'admin'){
            location.replace('/play');
        } else {
            alert('User atau password salah');
            location.reload();
    };
        
    })
})


