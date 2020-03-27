$(window).ready(() => render(thisPage));

// создать контакт
$('.btn__add').on('click',function() {
    $('.modal__window').css('display', 'flex');
});

$('.btn__cancel').on('click',function() {
    $('.modal__window').css('display', 'none');
});

let inp = $('.myForm-add input');

$('.btn__save').on('click',function() {
    let arr = [];
    inp.each(i => arr.push(!!inp[i].value));
    if(!!arr.reduce((a,b) => a * b) == 0) return alert('Заполните все поля!');
    
    $.ajax({
        type: "post",
        url: 'http://localhost:8000/contacts',
        data: {
            name: inp[0].value,
            surName: inp[1].value,
            phone: inp[2].value
        }
    });

    $('.modal__window').css('display', 'none');
    inp.val('');
    $('.contact__list').html('');
    render();
});

let thisPage = 1;

const render = (n) => {
    $('.pagination').html('');
    $.ajax({
        method:'get',
        url: 'http://localhost:8000/contacts',
        success: function(data){
            $('.pagination').attr('data-quantity', `${data.length}`);
            console.log(data);
        }
    });
    $.ajax({
        type: "get",
        url: 'http://localhost:8000/contacts',
        data:{
            _sort:'name',
            _page:n,
            _limit:20
        },
        success: function(data) {
            console.log(data);
            // if(data.length < 20) {
            //     return data.forEach(item => {
            //                 $('.contact__list').append(`<tr>
            //                         <td data-id="${item.id}" data-name="${item.name}" data-surName="${item.surName}" data-phone="${item.phone}">
            //                             ${item.name} ${item.surName}
            //                         </td>
            //                     </tr>`)
            //             })
            // }else 
            $('.pagination').append(`<button class="pagination__prev" data-page="${n}">prev</button>
                                    <button class="pagination__next" data-page="${n}">next</button>`);
            data.forEach(item => {
                $('.contact__list').append(`<tr>
                        <td data-id="${item.id}" data-name="${item.name}" data-surName="${item.surName}" data-phone="${item.phone}">
                            ${item.name} ${item.surName}
                        </td>
                    </tr>`);
            });
        },
        error: function(err) {
            console.log(err);
        }
    });
};

// информация о контакте
$('tbody').on('click', 'td', function(e) {
    $('.modal__window-edit').css('display', 'flex');
    $('.contact').css('display', 'block');
    let $target = $(e.target);
    let name = $target.attr('data-name');
    let surName = $target.attr('data-surName');
    let phone = $target.attr('data-phone');
    let id = $target.attr('data-id');
    $('.contact').html('');
    $('.contact').append(`
        <div class="myForm">
            <div>
                <a class="call__phone" href="tel:${phone}"><img class="logo__tel" src="./img/phone-call.svg" alt=""></a>
                <a class="send__msg" href="#" data-phone="${phone}"><img class="logo__tel" src="./img/speech-bubble.svg" alt=""></a>
            </div>
            <div class="myForm__contacts">
                <div class="contact__key"><span>Имя</span><span>Фамилия</span><span>Телефон</span></div>
                <div class="contact__val"><span>: ${name}</span><span>: ${surName}</span><span>: ${phone}</span></div>
            </div>
            <div>
                <button class="btn__back">back</button>
                <button class="btn__edit" data-id="${id}"data-name="${name}"data-surName="${surName}"data-phone="${phone}">edit</button>
                <button class="btn__delete" data-id="${id}">delete</button>
            </div>
        </div>`);
});

$('.modal__window-edit').on('click','.btn__back',function(){
    $('.modal__window-edit').css('display', 'none');
    $('.myForm-msg').css('display','none');
});

let inpEdit = $('.myForm-edit input');

// изменить контакт
$('.modal__window-edit').on('click','.btn__edit',function(e){
    inpEdit.val('');
    $('.myForm-edit').css('display', 'flex');
    $('.contact').css('display', 'none');
    $('.myForm-msg').css('display','none');
    let $target = $(e.target);
    let name = $target.attr('data-name');
    let surName = $target.attr('data-surName');
    let phone = $target.attr('data-phone');
    let id = $target.attr('data-id');
    inpEdit[0].value = `${name}`;
    inpEdit[1].value = `${surName}`;
    inpEdit[2].value = `${phone}`;
    $('.btns-edit').html('');
    $('.btns-edit').append(`
        <button class="btn__cancel-edit">cancel</button>
        <button class="btn__save-edit" data-id="${id}">save</button>`);
});

// отменить изменения
$('.modal__window-edit').on('click','.btn__cancel-edit',function(){
    $('.myForm-edit').css('display', 'none');
    $('.modal__window-edit').css('display', 'none');
});

// сохранить изменения
$('.modal__window-edit').on('click','.btn__save-edit',function(e){
    let $target = $(e.target);
    let id = $target.attr('data-id');
    let arr = [];
    inpEdit.each(i => arr.push(!!inpEdit[i].value));
    if(!!arr.reduce((a,b) => a * b) == 0) return alert('Заполните все поля!');

    $.ajax({
        method:"PATCH",
        url:`http://localhost:8000/contacts/${id}`,
        data: {
            name: inpEdit[0].value,
            surName: inpEdit[1].value,
            phone: inpEdit[2].value
        },
        success:()=>{
            $('.contact__list').html('');
            $('.pagination').html('');
            render();
            $('.modal__window-search').css('display','none');
            $('.myForm-edit').css('display', 'none');
            $('.modal__window-edit').css('display', 'none');
        }
    });
});

// удалить контакт
$('.modal__window-edit').on('click','.btn__delete',function(e){
    $('.modal__window-question').css('display','flex');
    $('.myForm-question').css('display','block');
    $('.myForm-msg').css('display','none');
    let $target = $(e.target);
    let id = $target.attr('data-id');

    $('.question__answer').html('');
    $('.question__answer').append(`
        <button class="answer__cancel">cancel</button>
        <button class="answer__delete" data-id="${id}">delete</button></div>`);
});

$('.modal__window-question').on('click','.answer__cancel',function(){
    $('.modal__window-question').css('display','none');
    $('.myForm-question').css('display','none');
});

$('.modal__window-question').on('click','.answer__delete',function(e){
    $('.modal__window-question').css('display','none');
    $('.myForm-question').css('display','none');
    let $target = $(e.target);
    let id = $target.attr('data-id');

    $.ajax({
        method:"DELETE",
        url:`http://localhost:8000/contacts/${id}`
        }).done(function(){
            $('.modal__window-edit').css('display', 'none')
            $('.contact__list').html('')
            $('.modal__window-search').css('display','none')
            render();
        });
});

// поисковик
$('.btn__search').on('click',function(){
    $('.modal__window-search').css('display','flex');
});

$('.search__btn-cancel').on('click',function(){
    $('.modal__window-search').css('display','none');
    $('.myForm-search__result').css('display','none');
    $('.myForm-search input').val('');
    $('.search__pagination').html('');
});

$('.search__btn-go').on('click',function(){
    let inpSearch = $('.myForm-search input');
    let inpVal = inpSearch[0].value;
    let quantity = '';

    $.ajax({
        method:'get',
        url: 'http://localhost:8000/contacts',
        data:{
            q:`${inpVal}`,
        },
        success: function(data){
            $('.search__btn-go').attr('data-quantity', `${data.length}`)
            quantity = data.length;
        }
    });

    $.ajax({
        method:"GET",
        url:'http://localhost:8000/contacts',
        data:{
            q:`${inpVal}`,
            _limit:10
        }
    }).done(function(data){
        $('.myForm-search__result').css('display','flex');
        $('.recently__added-title').html('');
        $('.recently__added').html('');
        $('.search__pagination').html('');

        if(data.length == 0 || inpVal == '') return $('.recently__added-title').append(`<span>Ничего не найдено</span>`);
        else if(data.length < 10) {
            $('.recently__added-title').append(`<span>Найдено: ${data.length}</span>`);
            data.forEach(item => {
                $('.recently__added').append(`<tr>
                    <td data-id="${item.id}" data-name="${item.name}" data-surName="${item.surName}" data-phone="${item.phone}">
                        ${item.name} ${item.surName}
                    </td>
                </tr>`);
            })
            return console.log(data);
        }
        else {
            $('.recently__added-title').append(`<span>Найдено: ${quantity}</span>`);
            // $('.search__pagination').append('<button class="search__next">next</button>')
                data.forEach(item => {
                    $('.recently__added').append(`<tr>
                        <td data-id="${item.id}" data-name="${item.name}" data-surName="${item.surName}" data-phone="${item.phone}">
                            ${item.name} ${item.surName}
                        </td>
                    </tr>`);
                });
            };
    });
});

// пагинация
$('.pagination').on('click','.pagination__next',function(e){
    let $target = $(e.target);
    let maxPage = Math.ceil($target.parent().attr('data-quantity')/20)
    if(thisPage < maxPage) {
        thisPage += 1;
        $('.contact__list').html('')
        $('.pagination').html('')
        $('.pagination').append(`<button class="pagination__prev" data-page="${thisPage}">prev</button>
                                    <button class="pagination__next" data-page="${thisPage}">next</button>`)
        render(thisPage)
    }else return    
    console.log(thisPage)
});

$('.pagination').on('click','.pagination__prev',function(){
    let minPage = 1;
    if(thisPage > minPage) {
        thisPage -= 1;
        $('.contact__list').html('')
        $('.pagination').html('')
        $('.pagination').append(`<button class="pagination__prev" data-page="${thisPage}">prev</button>
                                    <button class="pagination__next" data-page="${thisPage}">next</button>`)
        render(thisPage)
    }else return    
});

// hover
$('.btn__add').on('mouseover',function(){
    $('.th__header').eq(0).css('display','block');
});

$('.btn__add').on('mouseout',function(){
    $('.th__header').eq(0).css('display','none');
});

$('.btn__search').on('mouseover',function(){
     $('.th__header').eq(1).css('display','block');
});

$('.btn__search').on('mouseout',function(){
    $('.th__header').eq(1).css('display','none');
});

// отправка sms
$('.contact').on('click','.send__msg',function(e){
    let $target = $(e.target);
    let phone = $target.parent().attr('data-phone');
    console.log(phone);
    $('.myForm-msg').css('display','flex');
    $('.msg__send-go').html(`<button class="msg__send-cancel">cancel</button>
                                <a class="send__msg1" data-phone="${phone}">send</a>`);
});

$('.msg__send-go').on('click','.msg__send-cancel',function(){
    $('.myForm-msg').css('display','none');
});

$('.msg__send-go').on('mouseover','.send__msg1',function(e){
    let $target = $(e.target);
    let phone = $target.attr('data-phone');
    let msg = $('textarea').val();
    $target.attr('href',`sms:${phone}?body=${msg}`);
});

$('.msg__send-go').on('click','.send__msg1',function(){
    $('.myForm-msg').css('display','none');
});