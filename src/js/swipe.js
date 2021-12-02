let prev = 0;
let time_start = 0;
let time_end = 0;

function hover_menu(num)
{
    let li1 = document.getElementsByClassName('one')[0],
        li2 = document.getElementsByClassName('two')[0],
        li3 = document.getElementsByClassName('three')[0];
    if (num == 1)
    {
        li1.classList.add('hover');
        li2.classList.remove('hover');
        li3.classList.remove('hover');
    }
    else if (num == 2)
    {
        li1.classList.remove('hover');
        li2.classList.add('hover');
        li3.classList.remove('hover');
    }
    else if (num == 3)
    {
        li1.classList.remove('hover');
        li2.classList.remove('hover');
        li3.classList.add('hover');
    }
}

function toggle_transition(param)
{
    let graph = document.getElementsByClassName('holyGraph')[0],
        my_score = document.getElementsByClassName('content__myscore')[0],
        all_score = document.getElementsByClassName('allScores')[0];
    
    if (param == 'add')
    {
        graph.classList.add('holyGraph_transition');
        my_score.classList.add('content__myscore_transition');
        all_score.classList.add('allScores_transition');
    }  
    else if (param == 'delete')
    {
        graph.classList.remove('holyGraph_transition');
        my_score.classList.remove('content__myscore_transition');
        all_score.classList.remove('allScores_transition');
    }
    
}

function swipe(elem , direction, diff)
{
    let graph = document.getElementsByClassName('holyGraph')[0],
        my_score = document.getElementsByClassName('content__myscore')[0],
        all_score = document.getElementsByClassName('allScores')[0];
    
    toggle_transition('add');
    
    let graph_left = graph.style.left,
        my_score_left = my_score.style.left,
        all_score_left = all_score.style.left;
    
    graph_left      = graph_left.slice(0, graph_left.indexOf('p'));
    my_score_left   = my_score_left.slice(0, my_score_left.indexOf('p'));
    all_score_left  = all_score_left.slice(0, all_score_left.indexOf('p'));
    
    let cpy = graph_left;
    while (!(graph_left % 380 == 0) || graph_left == cpy)
    {
        if (diff == 'next')
        {
            if (direction == 'left')
                --graph_left;
            else
                ++graph_left;
        }
        else if (diff == 'prev')
        {
            if (direction == 'left')
                ++graph_left;
            else
                --graph_left;
        }
    }
    console.log('graph_left = ' + graph_left);
    if (graph_left >= -760 && (graph_left + 760) <= 760)
    {
        graph.style.left = (graph_left) + 'px';
        my_score.style.left = (graph_left + 380) + 'px';
        all_score.style.left = (graph_left + 760) + 'px';
        (graph_left == 0) ? hover_menu(1) : (graph_left == -380) ?  hover_menu(2) : hover_menu(3);
    }
    
/*
        graph.style.left = (graph_left - diff) + 'px';
        my_score.style.left = (my_score_left - diff) + 'px';
        all_score.style.left = (all_score_left - diff) + 'px';
        (graph_left - diff == 0) ? hover_menu(1) : (my_score_left - diff == 0) ?  hover_menu(2) : hover_menu(3);*/
}

function part_swipe(diff)
{
    let graph = document.getElementsByClassName('holyGraph')[0],
        my_score = document.getElementsByClassName('content__myscore')[0],
        all_score = document.getElementsByClassName('allScores')[0];
    
    let graph_left = graph.style.left,
        my_score_left = my_score.style.left,
        all_score_left = all_score.style.left;
    
    graph_left      = graph_left.slice(0, graph_left.indexOf('p'));
    my_score_left   = my_score_left.slice(0, my_score_left.indexOf('p'));
    all_score_left  = all_score_left.slice(0, all_score_left.indexOf('p'));

    if (graph_left - diff >= -760 && all_score_left - diff <= 760)
    {
        graph.style.left = graph_left - diff + 'px';
        my_score.style.left = my_score_left - diff + 'px';
        all_score.style.left = all_score_left - diff + 'px';
    }
    
}

function disable_scroll_y()
{
    elem = document.getElementsByTagName('body')[0];
    elem.classList.add('overflow-hidden');
}

function enable_scroll_y()
{
    elem = document.getElementsByTagName('body')[0];
    elem.classList.remove('overflow-hidden');
}

function setSwipeEvent(elem)
{
    var initialPoint;
    var finalPoint;
    var movePoint;
    var bPoint;
    var bPointp = 0;

    document.addEventListener('touchstart', function(event) {
        //event.preventDefault();
        event.stopPropagation();
        toggle_transition('delete');
        time_start = Date.now();
        /* Здесь код обработки события*/
        initialPoint = event.changedTouches[0];
            //console.log('start');
        //disable_scroll_y();
    }, false);

    document.addEventListener('touchmove', function(event){
        event.stopPropagation();
        movePoint = event.changedTouches[0];
        bPoint = Date.now();
        let x = Math.abs(movePoint.pageX - initialPoint.pageX),
            y = Math.abs(movePoint.pageY - initialPoint.pageY)
        if (bPointp != 0 && bPoint - bPointp > 300)
            bPoint *= -1;
        else
            bPointp = bPoint;
        /*if (Math.abs(movePoint.pageY - initialPoint.pageY) > 10)
            enable_scroll_y();*/
        if (x > 20 && x > y)
        {
            disable_scroll_y();
            let date = new Date();
            date = date.getMilliseconds();
            if (Math.abs(initialPoint.pageX - movePoint.pageX) <= Math.abs(initialPoint.pageX - prev))
                initialPoint.pageX = movePoint.pageX;
            let dxn = Math.round(initialPoint.pageX - movePoint.pageX);
            let dxp = Math.round(initialPoint.pageX - prev);
            let dx = dxn - dxp;
            if (prev != 0)
                part_swipe(dx);
                
            prev = movePoint.pageX
        }
        
            
    }, false);

    document.addEventListener('touchend', function(event) {
        //event.preventDefault();
        event.stopPropagation();
        /* Здесь код обработки события*/
        //console.log('end');
        enable_scroll_y();
        time_end = Date.now();
        prev = 0;
        finalPoint = event.changedTouches[0];
        let x = Math.abs(initialPoint.pageX - finalPoint.pageX),
            y = Math.abs(initialPoint.pageY - finalPoint.pageY);
        console.log('x = ' + x);
        console.log(initialPoint.pageX + ' ' + finalPoint.pageX);
        if (x > 30)
        {
            if (initialPoint.pageX > finalPoint.pageX)
            {
                x = Math.abs(initialPoint.pageX - finalPoint.pageX);
                if (time_end - time_start < 200 || time_end - bPoint < 200)
                {
                    console.log('time - left - next');
                    swipe(elem, 'left', 'next');
                }
                    
                else if (Math.abs(initialPoint.pageX - finalPoint.pageX) > 180)
                {
                    console.log('left - next');
                    swipe(elem, 'left', 'next');
                }
                    
                else if (Math.abs(initialPoint.pageX - finalPoint.pageX) <= 180)
                {
                    console.log('left - prev');
                    swipe(elem, 'left', 'prev');
                }
                   
                //swipe(elem, 'left', 380);
            }
            else 
            {
                if (time_end - time_start < 200 || time_end - bPoint < 200)
                {
                    console.log('time - right - next');
                    swipe(elem, 'right', 'next');
                }
                    
                else if (Math.abs(initialPoint.pageX - finalPoint.pageX) > 180)
                {
                    console.log('right - next');
                    swipe(elem, 'right', 'next');
                }
                    
                else if (Math.abs(initialPoint.pageX - finalPoint.pageX) <= 180)
                {
                    console.log('right - prev');
                    swipe(elem, 'right', 'prev');
                }
                    
                //swipe(elem, 'right', -(380));
            }
        }    
    }, false);
}