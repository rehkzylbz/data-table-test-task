function get_data() {
    var request, data, i, y, table, tr, td, parent, parent_level, nav;
    request = new XMLHttpRequest();
    request.open('GET', 'default.json', true);
    request.send();
    request.onreadystatechange = function() {
        if (request.readyState === 4 && request.status === 200) {
            data = JSON.parse(request.responseText);
            data = sort_data(data);
            table = document.getElementById('data-table').tBodies[0];
            table.innerHTML = '';
            for (i in data) {
                tr = document.createElement('tr');
                tr.id = 'element'+data[i]['id'];
                tr.setAttribute('data-id', data[i]['id']);
                tr.setAttribute('data-active', data[i]['isActive']);
                tr.setAttribute('data-level', 0);
                tr.className = data[i]['isActive'] ? 'table-success' : 'table-danger';
                for (y in data[i]) {                
                    td = document.createElement('td');
                    td.innerHTML = y === 'parentId' ? '' : data[i][y];
                    tr.appendChild(td);
                }
                if (data[i]['parentId'] === 0)
                    table.appendChild(tr);
                else {
                    parent = document.getElementById('element'+data[i]['parentId']);                    
                    parent_level = parent.getAttribute('data-level');
                    tr.style.display = 'none';
                    tr.setAttribute('data-level', ++parent_level);
                    tr.setAttribute('data-parent', data[i]['parentId']);
                    tr.cells[0].style.paddingLeft = parent_level*2+1+'rem';
                    table.insertBefore(tr, parent.nextElementSibling);
                    nav = document.createElement('button');
                    nav.className = 'btn btn-primary';
                    nav.innerHTML = '>';
                    parent.cells[1].innerHTML = '';
                    parent.cells[1].appendChild(nav);
                    nav.addEventListener('click', toggle_children);
                }                
            }
            filter_active();
        }
    };
};

function sort_data(data) {
    var new_data, current_stage, next_stage, i;
    new_data = [];
    current_stage = [];
    next_stage = [];
    i = 0;
    while (i<data.length) {
        if (Number(data[i]['parentId']) === 0){
            current_stage.push(data[i]['id']);
            new_data.push(data[i]);
            data.splice(i, 1);
            i--;
        }
        i++;
    }
    while (data.length>0) {
        i = 0;  
        while (i<data.length) {
            if (current_stage.indexOf(Number([data[i]['parentId']]))>-1){
                next_stage.push(data[i]['id']);
                new_data.push(data[i]);
                data.splice(i, 1);
                i--;
            }
            i++;
        }
        current_stage = next_stage;
    }
    return new_data;
};

function toggle_children(event) {
    var element, tr, id, level;
    element = event.currentTarget;
    tr = element.parentElement.parentElement;
    id = tr.getAttribute('data-id');
    level = tr.getAttribute('data-level');
    if (element.className === 'btn btn-success')
        close_children(id, level);
    else 
        open_children(id);    
    filter_active();
};

function open_children(id) {
    var btn, children, display;
    btn = document.getElementById('element'+id).cells[1].getElementsByTagName('button')[0];
    btn.className = 'btn btn-success';
    children = document.querySelectorAll('[data-parent="'+id+'"]');
    display = 'table-row';
    for (i = 0; i < children.length; i++) 
        children[i].style.display = display;
};

function close_children(id, level) {
    var tr, btn, next_tr, next_level, display;
    tr = document.getElementById('element'+id);
    btn = tr.cells[1].getElementsByTagName('button');
    if (btn.length>0)
        btn[0].className = 'btn btn-primary';  
    next_tr = tr.nextElementSibling;   
    next_level = next_tr.getAttribute('data-level');
    display = 'none';
    if (next_level>level) {
        next_tr.style.display = display;
        close_children(next_tr.getAttribute('data-id'), level);
    }
};

function filter_active() {
    var status, non_active, display, i, id, level, parent_id, parent, active_siblings, parent_btn;
    status = document.getElementById('active-checker').checked;
    non_active = document.querySelectorAll('[data-active="false"]');
    if (status) {
        display = 'none';
        for(var i=0; i<non_active.length; i++) {
            id = non_active[i].getAttribute('data-id');
            level = non_active[i].getAttribute('data-level');
            non_active[i].style.display = display;
            close_children(id, level);
            if ( level > 0 ) {
                parent_id = non_active[i].getAttribute('data-parent');
                parent = document.getElementById('element'+parent_id);
                parent_btn = parent.getElementsByTagName('button')[0];
                active_siblings = document.querySelectorAll('[data-parent="'+parent_id+'"][data-level="'+level+'"][data-active="true"]');              
                if ( !active_siblings.length )
                    parent_btn.style.display = display;
            }            
        }   
    }
    else {
        display = 'table-row';
        for(var i=0; i<non_active.length; i++) {
            id = non_active[i].getAttribute('data-id');
            level = Number(non_active[i].getAttribute('data-level'));
            if ( level === 0 )
                non_active[i].style.display = display;
            else {
                parent_id = non_active[i].getAttribute('data-parent');
                parent = document.getElementById('element'+parent_id);
                parent_btn = parent.getElementsByTagName('button')[0];
                if ( parent_btn.className === 'btn btn-success' )
                    non_active[i].style.display = display;
                if ( parent_btn.style.display === 'none' )
                    parent_btn.style.display = 'block';
            }
        }
    }
};