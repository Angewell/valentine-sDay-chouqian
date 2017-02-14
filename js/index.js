$(function(){
	// 签
	var data = [ "爱情甜蜜签", "幸福美满签","浪漫爱情签", "白头到老签","相濡以沫签","花好月圆签"];
	// 解签
	var results = [
		"爱一个人不是每天的甜言蜜语，而是每天的发奋图强",
		"爱，并非没有争执，而是每次争执过后，爱仍在",
		"爱情可以跑得赢时差，打得败距离，只要你坚持，只要我坚持",
		"爱总是被你所包围，我的爱是你所给，用一生去换永远的幸福",
		"如果非要在爱情上面加一个期限，我希望是直到新闻联播大结局",
		"我爱的人我要亲手给她幸福 ，别人我不放心",
		"爱是种责任，给要给得完整",
		"喝醉了才知道你最爱谁，生病了才知道谁最爱你",
		"爱情，如果换一个别称的话，也可以称作是毒药",
		"爱我的人很多，只是少了一个我爱的你",
		"爱一个人很久很久的时候，就像呼吸一样，自然而且必须",
		"感情从来就没有试用期，爱就爱了，不是赌注，而是每一场都全力以赴",
		"爱情如拉链，只有共同经历过故事，才会有刻骨铭心，才会有不离不弃",
		"爱情，在轰轰烈烈过后，剩下的就是平平淡淡",
		"如果你不打算让我娶你的话，算了，那就你娶我吧",
		"如果我爱你，会在任何时间任何地点，比任何人都爱你",
		"我爱你不是因为你是谁，而是我在你面前可以是谁",
		"爱情不在于说多少次“我爱你”，而在于怎么样去证明你说的是真的",
		"爱，不是猎取和占有对方，而是发自内心的责任感"
	];

	var qian;   //抽到的签

	var $chouqian = $("#chouqian"),
		$qian_wrap = $("#qian_wrap"),
		$result_btn = $(".result_btn"),
		$qian_result = $(".qian_result"),
		$result_inner = $(".result_inner");

	// 抽签
	$qian_wrap.click(chouqian);

	// 解签
	$result_btn.click(function(){
		jieqian(qian);
	});

	// 抽签函数
	function chouqian(){
		var random = parseInt(Math.random() * 10);
		qian = data[random] ? data[random] : data[random % data.length];

		$qian_wrap.addClass('hide');
		$result_inner.text(qian);
		$qian_result.addClass('show');
		$chouqian.addClass("hide");
	}

	// 解签函数
	function jieqian(qian){
		$("#container1").fadeOut(400);
		// $("#container2").css("background","url(img/1.jpg) center center/cover no-repeat");

		var $imgs = $("#container3 img"),
			ran = Math.round(Math.random() * $imgs.length);
		console.log(ran);
		renderImg($imgs.eq(ran).get(0));
	}

	// 合成图文
	var canvas = document.getElementById("canvas"),
		qr_code = document.getElementById("qr_code"),
		canvasW = $chouqian.width() * 2,
		canvasH = $chouqian.height() * 2,
		$canvas = $(canvas),
		$renderdImg = $(".renderdImg"),
		$waiting = $("#waiting");

	function renderImg(img){
		canvas.width = canvasW;
		canvas.height = canvasH;

		// 缩放canvas，以全屏显示
		$canvas.css({
			"-webkit-transform": "scale(0.5)",
			"transform": "scale(0.5)"
		});

		var ctx = canvas.getContext("2d"),
			random = Math.round(Math.random() * results.length),
			text = results[random],
			// 开始写入文字的位置
			startX = 50,
			startY = 150,
			// 当前写入文字的位置
			posX = startX,
			posY = startY,
			// 第几行文字
			line = 0,
			// 文字间的间隔
			space = 30,
			// 文字的行高
			lineHeight = 42;

		console.log(random);

		// 绘制背景大图
		ctx.drawImage(img, 0, 0, canvasW, canvasH);

		// 绘制文字
		for(var i = 0, length = text.length; i < length; i++) {
			var word = text[i];
			ctx.font = "bold 28px '宋体'";
			ctx.fillStyle = "black";
			ctx.textBaseline = "top";
			if (word === "，") {
				line ++;
				// posX = startX + line * space;
				posX = startX;
				posY += lineHeight;
				continue;
			}
			ctx.fillText(word, posX, posY);
			posX += space;
		}

		// 绘制二维码
		ctx.drawImage(qr_code, 15, canvasH-95, 80, 80);

		var dataurl = canvas.toDataURL("image/png"),
		    imagedata = encodeURIComponent(dataurl);

		$renderdImg.attr("src",dataurl);
		$waiting.show();

		// 上传到服务器，返回一个图片，因为安卓系统微信中不能长按保存dataUrl形式的图片
		$.post("http://h5.powertogo6.k-run.cn/upload.do",{
			imgContent: dataurl.split(",")[1]
		},function(data){
			console.log(data);
			if(data.status == 1000){
				$renderdImg.attr("src",data.thumb);
				$waiting.fadeOut(300);
			}
			else{
				alert("图片生成失败，请重试");
			}
		});
	}
});