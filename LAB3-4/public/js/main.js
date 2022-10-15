const fileInput = document.querySelector('.file-input');
const selectImg  = document.querySelector('.select-img');
const showText  = document.querySelector('.show-text');
const showImg = document.querySelector('.show-img')
const show = document.querySelector('.show')

if(fileInput){
    fileInput.addEventListener('change', (e) => {
        const files = fileInput.value.split('\\').pop();
        const file = e.target.files[0];
        const fileRead = new FileReader();
        if(files.length == 0){
            selectImg.classList.add('active')
            showImg.innerHTML = '';
            if(show){
                show.remove();
            }
            return  showText.innerText  = ''; 
        }else if(files.length > 30){
            fileRead.readAsDataURL(file);
            fileRead.onload = (e) => {
                const urlImg =  fileRead.result;
                const addImg = `<img class="show-add-img" src="${urlImg}" alt="">`
                showImg.innerHTML = addImg;
            };
            if(show){
                show.remove();
            }
            const nameImg = files.substr(0,14) + '...' + files.substr(30, files.length);
            if(selectImg){
                selectImg.classList.remove('active')
            }
            return showText.innerText  = nameImg;
        }else{
            fileRead.readAsDataURL(file);
            fileRead.onload = (e) => {
                const urlImg =  fileRead.result;
                const addImg = `<img class="show-add-img" src="${urlImg}" alt="">`
                showImg.innerHTML = addImg;
            };
            if(show){
                show.remove();
            }

            if(selectImg){
                selectImg.classList.remove('active')
            }
            return showText.innerText  = files;
        }
    });
}



const modal = document.querySelector('.modal');
const iconDelete = document.getElementsByClassName('icon-delete');
const iconCloseModal = document.querySelector('.icon-close-modal');
const btnCloseModal = document.querySelector('.modal-btn-close');
const btnDeleteProduct = document.querySelector('.modal-btn-delete')
const nameProduct = document.querySelector('.modal-content strong')

function showModal(){
    modal.classList.add('active');
}

function closeModal(){
    modal.classList.remove('active');
}

if(iconDelete && iconCloseModal && btnCloseModal){
    for (let i = 0; i < iconDelete.length; i++){
        iconDelete[i].addEventListener('click', (e) => {
            e.preventDefault();
            const productID = e.target.parentNode.getAttribute('data-id');
            const productName = e.target.parentNode.getAttribute('data-name');
            nameProduct.innerHTML = productName;
            btnDeleteProduct.setAttribute('data-id',productID)
            showModal();
        });
    }

    btnDeleteProduct.addEventListener('click', (e) => {
        const productID = btnDeleteProduct.getAttribute('data-id');
        const url = 'http://localhost:8080/list-product/delete-product'
        fetch(url, {
            method: 'POST',
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            body: "id=" + productID
        }).then(result => result.json())
        .then(json => {
            if(json.code == 2){
                document.getElementById(productID).remove();
            }
        }).catch(e => console.log(e))
        closeModal();
    });

    iconCloseModal.addEventListener('click', closeModal);
    btnCloseModal.addEventListener('click', closeModal);
}

const closeSuccessNotify = document.querySelector('.message-notify')

function closeSuccess(){
    closeSuccessNotify.classList.add('close')
}

if(closeSuccessNotify){
    setTimeout(() => {
        closeSuccessNotify.remove();
    },4000);
}

const iconEdit = document.getElementsByClassName('icon-edit')
const btnUpdate = document.querySelector('.btn-update')


// if(btnUpdate){

//     btnUpdate.addEventListener('click', (e) => {
//         const productID = btnUpdate.getAttribute('data-id');
//         const name = document.querySelector('.product-name')
//         const url = `http://localhost:8080/list-product/edit-product/${productID}`
//         fetch(url, {
//             method: 'PUT',
//             headers: {"Content-Type": "application/x-www-form-urlencoded"},
//             body: "id=" + productID
//         }).then(result =>  result.json())
//         .then(json => {
//             if(json.code == 2){

//             }
//         }).catch(e => console.log(e))
//     });
    
// }

