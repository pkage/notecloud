app = new Vue({
	el: '#viewer',
	data: {
		note: {}
	},
	created: function() {
		// load
                this.load();
	},
	methods: {
		urlObject: function(options) {
			/*global window, document*/

			var url_search_arr,
				option_key,
				i,
				urlObj,
				get_param,
				key,
				val,
				url_query,
				url_get_params = {},
				a = document.createElement('a'),
				default_options = {
					'url': window.location.href,
					'unescape': true,
					'convert_num': true
				};

			if (typeof options !== "object") {
				options = default_options;
			} else {
				for (option_key in default_options) {
					if (default_options.hasOwnProperty(option_key)) {
						if (options[option_key] === undefined) {
							options[option_key] = default_options[option_key];
						}
					}
				}
			}

			a.href = options.url;
			url_query = a.search.substring(1);
			url_search_arr = url_query.split('&');

			if (url_search_arr[0].length > 1) {
				for (i = 0; i < url_search_arr.length; i += 1) {
					get_param = url_search_arr[i].split("=");

					if (options.unescape) {
						key = decodeURI(get_param[0]);
						val = decodeURI(get_param[1]);
					} else {
						key = get_param[0];
						val = get_param[1];
					}

					if (options.convert_num) {
						if (val.match(/^\d+$/)) {
							val = parseInt(val, 10);
						} else if (val.match(/^\d+\.\d+$/)) {
							val = parseFloat(val);
						}
					}

					if (url_get_params[key] === undefined) {
						url_get_params[key] = val;
					} else if (typeof url_get_params[key] === "string") {
						url_get_params[key] = [url_get_params[key], val];
					} else {
						url_get_params[key].push(val);
					}

					get_param = [];
				}
			}

			urlObj = {
				protocol: a.protocol,
				hostname: a.hostname,
				host: a.host,
				port: a.port,
				hash: a.hash.substr(1),
				pathname: a.pathname,
				search: a.search,
				parameters: url_get_params
			};

			return urlObj;
		},
		compile: function() {
			if (this.note.raw) {
                                setTimeout(this.doPostRender.bind(this), 100);
				return marked(this.note.raw, {
					sanitize: false
				});
			}
		},
		load: function() {
			var url = this.urlObject(window.location.href);
                        
                        fetch('/api/note' + unescape(url.parameters.path))
                                .then(res => res.json())
                                .then(res => {this.note = res; document.title = this.note.path});
		},
                doPostRender: function() {
                        // highlight stuff
                        var codeblocks = document.getElementsByTagName('code');
                        for (var i = 0; i < codeblocks.length; i++) {
                                var el = codeblocks[i];
                                if (el.parentNode.tagName != 'PRE') {
                                        // skip inline blocks
                                        continue;
                                }
                                if (/lang\-/.test(el.className)) {
                                        el.className += ' ' + el.className.replace('lang-', '');
                                }
                                hljs.highlightBlock(el);
                        }

                        MathJax.Hub.Queue(['Typeset', MathJax.Hub]);
                }
	}
})
