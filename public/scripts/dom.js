const password1 = document.querySelector('#createPassword');
const password2 = document.querySelector('#confimPassword');
const submit = document.querySelector('#create');

const checkPassword = (password1,password2) => {
    if (password1 === password2){
       
        return alert('Match');
    }
    else {
        return alert( 'Your passwords do not match');
    }

}

function match () {

}

submit.addEventListener('click', checkPassword)