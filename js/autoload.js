I18n.defaultLocale = "en-US";
I18n.locale = "en-US";

I18n.translations = {};

// 翻译字典加载完成的信号. 组件必须等它就绪再初始化, 否则页面刚打开时
// 问候语先于字典查表, 会显示 [missing "en-US.xxx" translation].
const i18nReady = fetch("/live2d/i18n.json").then(res => res.json()).then(data => {
    Object.keys(data).forEach(key => {
        I18n.translations[key] = data[key];
    })
}).catch(err => console.warn("live2d i18n load failed:", err));
// live2d_path 参数建议使用绝对路径
// const live2d_path = "https://cdn.jsdelivr.net/gh/Wind-2375-like/Wind-2375-like.github.io/";
const live2d_path = "/live2d/";

// 封装异步加载资源的方法
function loadExternalResource(url, type) {
	return new Promise((resolve, reject) => {
		let tag;

		if (type === "css") {
			tag = document.createElement("link");
			tag.rel = "stylesheet";
			tag.href = url;
		}
		else if (type === "js") {
			tag = document.createElement("script");
			tag.src = url;
		}
		if (tag) {
			tag.onload = () => resolve(url);
			tag.onerror = () => reject(url);
			document.head.appendChild(tag);
		}
	});
}

// 加载 waifu.css live2d.min.js waifu-tips.js
if (screen.width >= 768) {
	Promise.all([
		i18nReady,
		loadExternalResource(live2d_path + "waifu.css", "css"),
		loadExternalResource(live2d_path + "live2d.min.js", "js"),
		loadExternalResource(live2d_path + "waifu-tips.js", "js")
	]).then(() => {
		// 配置选项的具体用法见 README.md
		initWidget({
			waifuPath: live2d_path + "waifu-tips.json",
			apiPath: "https://api.zsq.im/live2d/",
			// cdnPath: "https://fastly.jsdelivr.net/gh/fghrsh/live2d_api/",
			tools: ["hitokoto", "asteroids", "switch-model", "switch-texture", "photo", "info", "quit"]
		});
	});
}

console.log(`
  く__,.ヘヽ.        /  ,ー､ 〉
           ＼ ', !-─‐-i  /  /´
           ／｀ｰ'       L/／｀ヽ､
         /   ／,   /|   ,   ,       ',
       ｲ   / /-‐/  ｉ  L_ ﾊ ヽ!   i
        ﾚ ﾍ 7ｲ｀ﾄ   ﾚ'ｧ-ﾄ､!ハ|   |
          !,/7 '0'     ´0iソ|    |
          |.从"    _     ,,,, / |./    |
          ﾚ'| i＞.､,,__  _,.イ /   .i   |
            ﾚ'| | / k_７_/ﾚ'ヽ,  ﾊ.  |
              | |/i 〈|/   i  ,.ﾍ |  i  |
             .|/ /  ｉ：    ﾍ!    ＼  |
              kヽ>､ﾊ    _,.ﾍ､    /､!
              !'〈//｀Ｔ´', ＼ ｀'7'ｰr'
              ﾚ'ヽL__|___i,___,ンﾚ|ノ
                  ﾄ-,/  |___./
                  'ｰ'    !_,.:
`);
