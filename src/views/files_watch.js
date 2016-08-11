/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function add_files_watch_dlg_open() {
    $('#add_files_watch_dlg').dialog('open').dialog('center').dialog('setTitle','Add a File Watch');
    $('#add_files_watch_add_dlg_fm').form('clear');
}

function add_files_watch_dlg_close() {
    $('#add_files_watch_add_dlg_fm').form('clear');
    $('#add_files_watch_dlg').dialog('open').dialog('close');
}

function add_file_watch_request() {
    path = $('#add_files_watch_add_dlg_fm div .textbox .textbox-value').val();
    path_en = base64_encode(path);
    $.get("files_watch", {"action":"add", "param":path_en},
        function(data){
            
            getFilesWatch();
            console.log(data);
        }, 
        "json");
    
    $('#add_files_watch_dlg').dialog('close')
}

function check_file_watch_tab_exist(id) {
    var items = $('#files_watch_tabs').find('#' + id);
    if (items.length>0) {
        return true;
    }
    return false;
}

function getFilesWatch() {
    $.get("files_watch", {"action":"get_list", "param":""},
        function(data){
            console.log(data);
            if (data.ret == 1) {
                for (var index = 0; index < data.list.length; index++) {
                    var item = data.list[index];
                    if (check_file_watch_tab_exist(item.id)) {
                        continue;
                    }
                    $("#files_watch_tabs").tabs('add',{
                        id:item.id,
                        title:item.name,
                        content:"",
                        closable:true,
                        tools:[{
                            iconCls:'icon-mini-refresh',
                            handler:function(){
                                get_file_last_content(item.id);
                            }
                        }]
                    });
                }
            }
        },
        "json");
}

function make_file_watch_textarea_id(id) {
    return "file_watch_area_"+id;
}

function make_file_tab_panel_data(tab_id, data) {
    return "<textarea id='" + make_file_watch_textarea_id(tab_id) + "' style='width:100%;height:100%'>" + data + "</textarea>";
}

function get_file_last_content(tab_id) {
    $.get("files_watch", {"action":"get_file", "param":tab_id},
        function(data){
            console.log(data);
            var tab_t = $('#files_watch_tabs').find('#' + tab_id);
            var html_text = make_file_tab_panel_data(tab_id,data);
            $("#files_watch_tabs").tabs('update',{tab:tab_t, options:{content:html_text}});
            var area_id = make_file_watch_textarea_id(tab_id);
            var scrollTop = $("#" + area_id )[0].scrollHeight;  
            $("#" + area_id ).scrollTop(scrollTop); 
        });
}

function get_file_last_content_by_index(tab_index) {
    var tab_id = $("#files_watch_tabs").tabs('getTab',tab_index).panel('options').id;
    get_file_last_content(tab_id);
}

function remove_file_watch(tab_index) {
    var file_id = $("#files_watch_tabs").tabs('getTab',tab_index).panel('options').id; //base64encode
    $.get("files_watch", {"action":"remove", "param":file_id},
      function(data){
            console.log(data);
            if (data.ret == 1) {
                
            }
            });
    return true;
}