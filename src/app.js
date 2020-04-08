const Koa = require('koa');
const koaBody = require('koa-body')
const router = require('koa-router')()
const staticCache = require('koa-static-cache')
// const static = require("koa-static");
const fs = require('fs')
const path = require('path')
const app = new Koa();



// app.use(static(path.join(__dirname, '../public/')))
app.use(staticCache({
	dir: path.join(__dirname, '../public'),
	dynamic: true,
	maxAge: 365 * 24 * 60 * 60
}))


app.use(koaBody({
  multipart:true, // 支持文件上传
  // encoding:'gzip',
  formidable:{
    uploadDir:path.join(__dirname,'../public/'), // 设置文件上传目录
    keepExtensions: true,    // 保持文件的后缀
    maxFieldsSize:2 * 1024 * 1024, // 文件上传大小
    onFileBegin:(name,file) => { // 文件上传前的设置
      // console.log(`name: ${name}`);
      // console.log(file);
      // 取后缀  如：.js  .txt
      // const reg = /\.[A-Za-z]+$/g
      // const ext = file.name.match(reg)[0] 

      // 修改上传文件名
      // file.path = path.join(__dirname, "public/upload/") + Date.now() + ext
    }
  }
}))
router.get('/', async (ctx, next) => {
  // await next();
  if (ctx.request.url === '/'){
	  ctx.body = `<body>
			<h1>Hello Worl22d</h1><div><input type="file" class="file"><img class="img"></div>
			<script src="https://cdn.bootcss.com/jquery/1.12.3/jquery.js"></script>
			<script>
				$(".file").on("change",function(){
					submit()
				})
				function submit() {    
			    var formData = new FormData();
			    var file = $(".file").get(0).files[0];
			    formData.append("photo", file);
			    if (!file) return;
			    $.ajax({
			      url:"/upload",
			      type:"POST",
			      data: formData,
			      processData : false,
			      contentType : false,
			      dataType : 'json',
			      async : false,
			      success : function (result) {
			      	console.log(result, 9900)
							$('.img').attr('src', result.data.url)
			      }    
		    	})
			  }
			</script>
			</body>
	  `;
  }
})
router.post('/upload',async (ctx)=>{
	console.log(ctx.request.files.photo, 666)
	// ctx.body = {
	// 	data: '2222'
	// }
    // //图片上传
    const file = ctx.request.files.photo
    // console.log(ctx.request.files)
    // 创建可读流
    const reader = fs.createReadStream(file.path);
    let filePath = path.join(__dirname, '../public/') + `/${file.name}`;
    // 创建可写流
    const upStream = fs.createWriteStream(filePath);
    const basename = path.basename(file.path)
    reader.pipe(upStream);
    ctx.body = {
    	message: "上传成功！",
    	data: {
    		url: `${ctx.origin}/${basename}`
    	}
    };
})

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3001);