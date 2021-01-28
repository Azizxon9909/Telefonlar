window.addEventListener('load' , () => {
    let clickNum = document.querySelector('.product__link');
    clickNum.addEventListener('click', ()=>{
        let id=$(clickNum).attr('numId')
        console.log(id);
        fetch(id,{method:'GET'})
        .then(data=>data.json())
        .then(data=>{
            console.log(data);
            
        })
    })


})