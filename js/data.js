/*
* 右键菜单数据
* */
var datas = {
    //右键菜单数据
    contextmenu: {
        //common菜单组
        common: [
            {
                name: "新建文件夹",
                exe: function() {
                		if(datas.global.newfilelock==true){
                			alert("您有未保存的文件夹")
                			return;
                		}
                		datas.global.newfilelock=true;
                		var maxId=getMaxId() + 1;
                        datas.files.push({
                            id: maxId,
                            pid:datas.global.filepid,
                            name:""
                        });
                        datas.global.fileid=maxId;
                        refreshDirectory(getChildren(), true);
						countnum();
						$("#check_icon").removeClass("framecheck");
                }
            },
            {
                name: "重新加载页面",
                exe: function() {
                	//返回文件夹首页
                	firstlevel();
                }
            },
            {
                name: "打开文件夹",
                exe: function() {
                	if($(".checkboxed").length==1){
                		$("#allfile").hide();
	 					$("#module_num a").show();
                		datas.global.filepid = $(".checkboxed").parent().parent().attr("fileid");
	 					refreshDirectory(getChildren())
                	}else if($(".checkboxed").length==0){
                		alert("您未选择文件夹，请勾选要打开的文件夹")
                	}else{
                		alert("您选择了多个文件夹，每次仅能打开一个文件夹")
                	}
                    
                }
            },
	        {
                name: "删除文件夹",
                exe: function() {
                	if($(".checkboxed").length==0){
                		 alert("请选择要删除的文件夹")
                	}else{
                		deletefile()
            		}
                }
	        },
	        {
                name: "重命名",
                exe: function() {
                	if($(".checkboxed").length==0){
                		 alert("请选择要重命名的文件夹")
                	}else{
                		rename()
            		}
                }
	        }
        ],
        //文件夹
        folder: [
            {
                name: "打开"
            },
            {
                name: "复制"
            },
            {
                name: "剪切"
            }
        ]
    },
    //文件数据
    files: [
        {
            id: 1,
            pid: 0,
            name: "体育"
        },
        {
            id: 2,
            pid: 0,
            name: "娱乐"
        },
        {
            id: 3,
            pid: 0,
            name: "财经"
        },
       {
            id: 4,
            pid: 1,
            name: "奥运"
        },
        {
            id: 5,
            pid: 2,
            name: "明星"
        },
        {
            id: 6,
            pid: 3,
            name: "股票"
        }
    ],
	global:{
		filepid:0,
		fileid:0,
		newfilelock:false,
		isremove:true
	}
};