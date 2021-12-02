
function fmenu()
{
    return document.getElementsByClassName('subheader__menu')[0];
}

window.onload = function()
{
    let menu = fmenu();
    let html = document.getElementsByTagName('body')[0];
    html.onscroll = function()
    {
        resizeHeader(menu, fmenu);
    }
    let elem = document.getElementsByClassName('pages')[0];
    setSwipeEvent(elem); 
}



    /*
elem.touchstart(function(e)
    {
        alert('yes');
        var touchobj = e;
        x = touchobj.pageX;
        y = touchobj.pageY;
        console.log('start');
    });*/
