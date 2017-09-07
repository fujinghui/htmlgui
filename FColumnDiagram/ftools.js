function FColumnDiagram(){
	var canvas,context;		//绘图工具
	var range, span;
	var button = [], div_button;
	var width, height;		//宽高
	var data = null;
	var overlay = false;
	var div_obj = null;		//整个绘图工具都是包含在这个div中
	var init_obj = null;
	var min_value = 1, max_value = 1;
	var best_max_value = 1, best_min_value = 999999;
	var step = 1;
	var white_height = 100;
	var screen_width = 0, screen_height = 0;
	var move_x = 20;
	var distance_x = 500;
	var scale = 1;

	var slide_x, slide_y,slide_width, slide_height;
	function obj_init(obj){
		init_obj = obj;							//初始化对象
		//初始化一些配置信息
		if(typeof(obj.data) != "undefined")		//设置数据
		{
			data = obj.data;
		}
		if(typeof(obj.max) != "undefined")
		{
			best_max_value = obj.max;
		}
		if(typeof(obj.min) != "undefined")
		{
			best_min_value = obj.min;
		}
		if(typeof(obj.select_min) != "undefined")
		{
			min_value = obj.select_min;
		}
		if(typeof(obj.select_max) != "undefined")
		{
			max_value = obj.select_max;
		}
		if(typeof(obj.scale) != "undefined")
		{
			scale = obj.scale;
		}

		min_value = min_value;
		max_value = max_value;
		step = scale;
		//是否叠加
		if(obj.overlay)
			overlay = obj.overlay;
	//	$(obj.div_obj).resize(function(){
	//		console.log($(this).width()+" "+$(this).height());
	//	});
	}
	function button_click(){
		scale = this.id;
		draw();
	}
	function createButton(obj){
		div_button = document.createElement("div");
		for(var i = 0; i < 4; i ++)
		{
			button[i] = document.createElement("button");
			button[i].addEventListener("click", button_click);
			
			$(div_button).append(button[i]);
		}
		button[0].innerHTML = "1"; button[0].id = "1";
		button[1].innerHTML = "2"; button[1].id = "2";
		button[2].innerHTML = "5"; button[2].id = "5";
		button[3].innerHTML = "10"; button[3].id = "10";
		return div_button;
	}
	function createRnage(obj){
		range = document.createElement("input");
		range.type = "range";
		range.value = min_value;
		range.max = best_max_value;
		range.min = best_min_value;
		range.onchange = range_change;
		range.step = max_value-min_value+1;
		
		$(range).css("width", width+"px");
		return range;
	}
	function createSpan(obj){
		span = document.createElement("span");
		span.innerHTML = range.value+"";
		return span;
	}
	this.add = function(d){
		if(d == null)
			d = [];

		data.push(d);
		draw();
	}
	this.init = function(obj){
		obj_init(obj);

		//存在外部div对象才初始化
		if(obj.div_obj)
		{
			width = $(obj.div_obj).width();
			height = $(obj.div_obj).height();
		}
		//获取canvas对象
		canvas = document.createElement("canvas");
		canvas.width = width;
		width -= move_x;
		canvas.height = height+white_height;
		document.addEventListener("mousewheel", mousewheel);;
		//获取context
		context = canvas.getContext("2d");
		
		screen_width = canvas.width;
		screen_height = canvas.height;

		slide_width = screen_width;
		slide_height = screen_height / 10;
		slide_x = 0;
		slide_y = 0;
		//canvas.style.background = "#aaa";
		//canvas.style.width = "100%";
		//canvas.style.height = "100%";
		//console.log(obj.div_obj);
		$(obj.div_obj).append(createButton(obj));
		$(obj.div_obj).append("<br />");
		$(obj.div_obj).append(canvas);
		$(obj.div_obj).append("<br />");
		$(obj.div_obj).append(createRnage(obj));
		$(obj.div_obj).append("<br />");
		$(obj.div_obj).append(createSpan(obj));

		$(obj.div_obj).height(screen_height+100);
		$(obj.div_obj).css('text-align', "center");
		draw();
	}
	function range_change(e){
		//console.log(range.value);
		min_value = parseInt(range.value)
		max_value = parseInt(range.value) + parseInt(range.step)-1;
		console.log(min_value);
		console.log(max_value);
		if(max_value >= best_max_value)
		{
			max_value = best_max_value;
			min_value = max_value - parseInt(range.step)+1;
		}
		span.innerHTML = range.value+"";
	//	console.log("max:"+max_value+" min:"+min_value);
		draw();
	}
	function mousewheel(event){
		//向下
		if(event.wheelDelta < 0)
		{
			max_value += step; 
		}
		//向上
		else if(event.wheelDelta > 0)
		{
			max_value -= step;
		}
		if(max_value<=best_min_value)
			max_value = best_min_value;
		else if(max_value >= best_max_value)
			max_value = best_max_value;
		range.step = max_value-min_value+1;
		draw();
	}
	this.show = function(){

	}
	this.hide = function(){

	}
	this.updatedata = function(data){

	}
	function max(a, b){
		if(a > b)
			return a;
		return b;
	}
	function min(a, b){
		if(a < b)
			return a;
		return b;
	}
	function draw(){
		var column_count = 0;		//柱形图个数

		context.clearRect(0, 0, screen_width, screen_height);
		context.textBaseline = "top";

		context.lineWidth = 1;
		context.strokeStyle = "rgb(0, 0, 0)";
		//x轴
		context.beginPath();
		context.moveTo(move_x, height-6);
		context.lineTo(width, height-6);
		context.lineTo(width-6, height-6-6);
		context.moveTo(width, height-6);
		context.lineTo(width-6, height+6-6);
		context.closePath();
		context.stroke();
		//y轴
		context.beginPath();
		context.moveTo(move_x, height-6);
		context.lineTo(move_x, 0);
		context.lineTo(move_x, 6);
		context.moveTo(move_x, 0);
		context.lineTo(move_x+6, 6);
		context.closePath();
		context.stroke();

		if(data && data.length > 0 && data[0].x && data[0].x.data.length)
		{
			var max_y = -9999999, min_y = 9999999;
			var max_x = -9999999, min_x = 9999999;
			var count = data[0].x.data.length;
			var rect_width = 0;
			if(overlay)
			{
				max_y = 0;
			}
			//计算每一个柱形图的最大值和最小值
			for(var u = 0; u < data.length; u ++)
			{
				data[u].x.max = -9999999; data[u].x.min = 9999999;
				data[u].y.max = -9999999; data[u].y.min = 9999999;
				data[u].x.show_count = 0; data[u].y.show_count = 0;

				for(var i = 0; i < data[u].x.data.length; i ++)
				{
					if(data[u].x.data[i] >= min_value && data[u].x.data[i] <= max_value)
					{
						//求出当前table的极值
						//x
						if(data[u].x.data[i])
						{
							data[u].x.max = max(data[u].x.max, data[u].x.data[i]);
							data[u].x.min = min(data[u].x.min, data[u].x.data[i]);
						}
						//y
						if(data[u].y.data[i])
						{
							data[u].y.max = max(data[u].y.max, data[u].y.data[i]);
							data[u].y.min = min(data[u].y.min, data[u].y.data[i]);

						//	console.log("max:"+data[u].y.data[i]);
						}
						//计算当前这个table中有哪些data需要显示
						data[u].x.show_count ++;
					}

				}
				//计算出柱形个数最多的柱形个数
				column_count = max(column_count, data[u].x.show_count);
			}
			//
			rect_width = Math.floor(width/column_count);
			
			context.beginPath();
			var table_count_height = 0;
			//求出总的高度
			for(var i = 0; i < data.length; i ++)
			{
				if(data[i].y.max != -9999999)
					table_count_height += data[i].y.max +1;			//累加(每一个table中间加上一个grid_height的高度)
			}
			//table中每个单位的高度
			var grid_height = Math.floor(height/(table_count_height+2));
			//console.log(table_count_height)
			//
			//绘制水平线
			for(var i = 0; i < data.length; i ++)
			{
				var start_y = 0;
				for(var si = 0; si < i; si ++)
					start_y += grid_height * data[si].y.max + grid_height*2;
				//for(var j = 0; j < data[i].x.data.length; j ++)
				{
					var x = rect_width/2+rect_width*j;
					var y = start_y;
					context.beginPath();
					context.moveTo(0+move_x, height - 6 - y);
					context.lineTo(width, height - 6 -y);
					context.closePath();

					context.strokeStyle = "rgb(0, 0, 0)";
					context.stroke();
					//绘制虚线
					for(var si = 0; si < data[i].y.max; si ++)
					{
						context.beginPath();
						context.moveTo(0+move_x, height-6-start_y-(si+1)*grid_height);
						context.lineTo(width, height-6-start_y-(si+1)*grid_height);
						context.closePath();
						context.strokeStyle = "rgb(200, 200, 200)";
						context.stroke();
						context.font = "20px Arial";
						//绘制文字
						context.fillStyle = "rgb(0, 0, 0)";
						context.fillText((si+1)+"", 0, height-6-start_y-(si+1)*grid_height);
						context.fill();
					}
				}
			}
			context.closePath();
			//一个格子的长度
			rect_width = width/(max_value-min_value+1);
			//分别绘制每一个table
			for(var i = 0; i < data.length; i ++)
			{
				context.font = "20px arial";
				var start_y = 0;
				for(var si = 0; si < i; si ++)
					start_y += grid_height * data[si].y.max + grid_height*2;					//计算每一个柱形图的起始高度
				for(var j = 0; j < data[i].x.data.length; j ++)
				{
					if(data[i].x.data[j] >= min_value && data[i].x.data[j] <= max_value)
					{
						var x = rect_width/2+rect_width*(data[i].x.data[j]-min_value);
						var h = grid_height * data[i].y.data[j];				//
						var y = start_y + grid_height * data[i].y.data[j];
						//console.log(scale);
						//draw fill
						context.fillStyle = "rgb(125, 200, 200)";
						context.fillRect(x-rect_width/4+move_x,height-6-y, rect_width/2, h);

						context.fillStyle = "rgb(0, 0, 0)";

						context.fillText((data[i].x.data[j])+"", x+move_x-data[i].x.data[j].toString().length/2*10, height-6-start_y);
						//context.fillText(data[i].x.data[j]+"", x+move_x+data[i].x.data[j].toString().length*20/2, height-6-start_y);
						//console.log(data[i].x.data[j]+":"+data[i].x.data[j].toString().length);
					}
				}
				//展示标题
				if(data[i].title)
				{
					start_y -= 20;
					start_y += grid_height*data[si].y.max+grid_height*2;
					context.font = "30px arial";
					context.fillStyle = "rgb(0, 0, 0)";
					context.fillText(data[i].title, (width-data[i].title.length*15)/2, height-start_y);
				}
				//console.log(start_y);
			}
			//显示下面的刻度尺
			context.beginPath();
			context.moveTo(move_x, height - 6 + white_height/2);
			context.lineTo(width, height - 6 + white_height/2);
			context.moveTo(width, height - 6 + white_height/2);
			context.lineTo(width - 6, height - 6 - 6 + white_height/2);
			context.moveTo(width , height - 6 + white_height/2);
			context.lineTo(width - 6, height - 6 + 6 + white_height/2);

			context.moveTo(move_x, height-6);
			context.lineTo(move_x, height-6+white_height/2);
			context.closePath();
			context.strokeStyle = "rgb(0, 0, 0)";
			context.stroke();

			console.log(min_value+" "+max_value);
			//显示刻度
			for(var i = min_value, index = 1; i <= max_value; i ++, index ++)
			{
				if(i % scale != 0)
					continue;
				var x = (rect_width/2+rect_width*(i-min_value));
				//context.fillText(min_value+"", move_x, height-6+white_height/2);
				//context.fillText(max_value+"", width-20*max_value.toString().length, height-6+white_height/2);
				//
				context.fillStyle = "rgb(125, 125, 125)";
				context.font = "10px arial";
				//小的刻度的间距
				var srect_width = rect_width*scale/ 10;
				for(var j = 1; j <= 9; j ++)
				{
					var xx = x + srect_width * j;
					//xx /= scale;
					context.fillText(j+"", xx + move_x, height - 6 + white_height/2);
				}

				context.fillStyle = "rgb(0, 0, 0)";
				context.font = "20px arial";
				context.fillText((i)+"", x + move_x-i.toString().length/2*10, height-6+white_height/2);
			}
			//绘制table线
			context.font = "20px Arial";
			context.fillStyle = "rgb(0, 0, 0)";
			context.fillText(init_obj.name.x, move_x+width-20*init_obj.name.x.length, height-6-10-20);
			context.fillText(init_obj.name.y, move_x, 6);
			context.fill();
			return;


			//绘制table
			for(var i = 0; i < data[0].x.data.length; i ++)
			{
				if(overlay == true)
				{
					//叠加情况!
					max_y += data[0].y.data[i];
					min_y = 0;
				}
				else
				{
					max_y = max(max_y, data[0].y.data[i]);
					min_y = min(min_y, data[0].y.data[i]);
				}
				max_x = max(max_x, data[0].x.data[i]);
				min_x = min(min_x, data[0].x.data[i]);
			}

			context.beginPath();
			//黑色的文字
			context.fillStyle = "rgb(125, 255, 255)";
			context.font = "15px Arial";
			if(overlay == true)			//覆盖模式
			{
			}
			else						//非覆盖模式
			{
				for(var i = 0; i < data[0].x.data.length; i ++)
				{
					var x = rect_width/2+rect_width*i;
					var y = Math.floor(height/(max_y-min_y+1))*data[0].y.data[i];
					//y = height - y;
					//console.log(height/(max_y-min_y)*data.y.data[i]);
					
					context.fillStyle = "rgb(125, 200, 200)";
					context.fillRect(x-rect_width/4,height-6-y, rect_width/2, y);

					context.fillStyle = "rgb(0, 0, 0)";
					context.fillText(data[0].x.data[i]+"", rect_width/2+rect_width*i, height-15);
				}
			}
			context.closePath();
		}
	}
}
var column_tables = [];
//初始化柱形图
$.fn.initColumnDiagram = function(obj){
	obj.div_obj = this[0];
	/*
	time:2017.9.5
	auth:femy
	obj描述：
	width,height,
	data:{
		x:{name:"", data:[]},
		y:[name:"", data:[]}
	 */
	var f = new FColumnDiagram(obj);
	f.init(obj);
	f.show();
	this[0].getObject = function(){
		return f;
	}
	//添加到table总
	column_tables.push({obj:this[0], operator:f});
	return f;
}
$.fn.getColumnDiagram = function(){
	for(var i = 0; i < column_tables.length; i ++)
	{
		if(this[0] == column_tables[i].obj)
			return column_tables[i].operator; 
	}
	return null;
}
