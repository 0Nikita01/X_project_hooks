
function isVisible(elem) 
{
    let coords = elem.getBoundingClientRect();
  
    let windowHeight = document.documentElement.clientHeight;
 
    let topVisible = coords.top > 0 && coords.top + coords.top/8 < windowHeight;
  
    let bottomVisible = coords.bottom <= windowHeight && coords.bottom >= 0;
  
    return topVisible || bottomVisible;
}

function resizeHeader(elem, fmenu)
{
    if (elem == undefined)
        elem = fmenu();
    let coords = elem.getBoundingClientRect();
    let header_inform = document.getElementsByClassName('header__information')[0];
    let subheader = document.getElementsByClassName('subheader')[0];
    let img = document.getElementsByClassName('header__information_img')[0];
    if (coords.top < 320)
    {
        if (coords.top > 200)
        {
            img.style.width = (165 - (320 - coords.top)) + 'px';
            img.style.height = (165 - (320 - coords.top)) + 'px';
        }
        else
            header_inform.classList.add('header__information_halfhidden');
    }
    if (coords.top >= 320)
    {
        header_inform.classList.remove('header__information_halfhidden');
    }
        
}