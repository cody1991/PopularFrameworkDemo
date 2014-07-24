basieStructureForSomeFrontPage
==============================

自适应插件前端开发规范
--------------------------
规范目的
--------------------------
	为提高团队协助效率，实现多终端、多分辨率下插件能够正常显示以及后台开发人员便捷添加功能，输出高质量的前端页面，特制定此文档。本规范文档一经确认，前端开发人员必须按本文档规范进行前台页面开发。 本文档如有不对或者不合适的地方请及时提出，经讨论决定后方可更改。
基本准则
--------------------------
	1、符合web标准，语义化html
	2、结构表现行为分离，兼容性优良
	3、页面性能方面，代码要求简洁明了有序
	4、尽可能的减小服务器负载，保证最快的解析速度
文件规范
--------------------------
	1、Html、css、js、images文件均归档至约定的目录中;
	2、html文件命名: 英文命名。 同时将相对应的设计稿效果图放于同目录中，保存命名和html文件同名，以方便其他人员的查询；
	3、css文件命名: 英文命名。 共用base.css，其他页面依实际模块需求命名；
	4、Js文件命名: 英文命名。 共用common.js，其他依实际模块需求命名。
html书写规范
--------------------------
	1、文档类型声明及编码:
	<!doctype html>
	<meta charset="utf-8"> 
	2、头部标签必须添加：
	<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=1">
	3、非特殊情况下样式文件必须外链至<head>…</head>之间;非特殊情况下JavaScript文件必须外链至页面底部；
	4、引入样式文件或JavaScript文件时，须略去默认类型声明
	5、所有编码均遵循xhtml标准，必须由小写字母及下划线、数字或者一横杠线组成，且所有标签必须闭合，包括br，等; 属性值必须用双引号包括;
	6、充分使用html5的语义化标签，不可嵌套太多无意义的div、span等标签。如需要添加自定义属性，则按照”data-”为前缀的格式添加自定义属性。
	7、避免使用行内样式，除非特殊情况
	8、必须为含有描述性表单元素(input，textarea)添加label，表单类型按照html5新增的语义化来添加（如：tel）。
	9、给区块代码及重要功能(比如循环)加上注释，方便后台添加功能
	10、编写代码结构时，要考虑向后扩展性
css书写规范
--------------------------
	1、编码统一为utf-8;
	2、统一制作一个base.css文件，该文件包含reset（或者还有头部底部样式），开发人员在开发任何一个插件时，必须引入这个文件，该文件不可随意更改
	3、id仅使用在大的模块上，如头部、尾部、侧边栏等等，class可用在重复使用率高及子级中
	4、class、id的命名方法：大的区块命名比如header/footer/wrapper/nav之类的在base中统一命名。其他样式名称由 小写英文、数字、以及下横线来组合命名，如mt10，fs10，alignleft; 避免使用中文拼音，尽量使用简易的单词组合; 总之，命名要语义化，简明化。（更多命名规则可参考base.css的规范）
	5、书写代码前，考虑并提高样式重复使用率;
	6、充分利用html自身属性及样式继承原理减少代码量
	7、充分使用css选择符，如关系选择符、属性选择符、伪类选择符
	8、通过Media Queries来实现不同设备的布局以及显示效果，具体方法可以自行查阅其用法。必须充分考虑横屏、竖屏、各个尺寸下的效果
	9、自适应插件各个大的区块不可定死宽度，均用百分比来布局，实现弹性布局结合Media Queries实现横屏竖屏的最佳显示效果
	10、对于插件的特殊模版，如大转盘，必须定宽度高度，则将这块优先居中或者固定位置处理，可与设计师讨论决定方案
	11、必须为大区块样式添加注释，小区块适量注释
	12、代码缩进与格式: 建议单行书写，可根据自身习惯书写
JavaScript书写规范
--------------------------
	1、文件编码统一为utf-8，书写过程过，每行代码结束必须有分号; 原则上所有功能均根据插件项目需求原生开发，以避免网上down下来的代码造成的代码污染或者与现代码冲突
	2、库引入: 必须引用公司cdn上统一使用的库，如http://www.playwx.com/hd/static/common/js/jquery-1.10.2.min.js
	3、变量命名: 驼峰式命名。 原生JavaScript变量要求是纯英文字母，首字母须小写，如iTaoLun;
	jQuery变量要求首字符为’_'，其他与原生JavaScript 规则相同，如: _iTaoLun;
	另，要求变量集中声明，避免全局变量。
	4、类命名: 首字母大写，驼峰式命名。 如 ITaoLun;
	5、函数命名: 首字母小写驼峰式命名。 如iTaoLun();
	6、命名语义化，尽可能利用英文单词或其缩写;
	7、尽量避免使用存在兼容性及消耗资源的方法或属性，比如eval() & innerText;
	8、后期优化中，JavaScript非注释类中文字符须转换成unicode编码使用，以避免编码错误时乱码显示;
	9、代码结构明了，加适量注释。提高函数重用率;
	10、注重与html分离，减小reflow，注重性能
	11、在开发插件时，须提供插件所用到的API接口，以供后台人员使用开发功能
图片规范
--------------------------
	1、所有页面元素类图片均放入images文件夹，测试用图片放于images/demo/文件夹;
	2、命名全部用小写英文字母、数字、下划线或者横杠线的组合，尽量用易懂的词汇，便于团队其他成员理解; 另，命名分头尾两部分，用下划线隔开，比如icon_add.gif、btn_submit.gif;
	4、在保证视觉效果的情况下选择最小的图片格式与图片质量，以减少加载时间，可以借助第三方软件或者工具对图片进行压缩;

