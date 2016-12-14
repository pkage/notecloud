app = new Vue({
	el: '#app',
	data: {
		notes: [],
		socket: null,
		search: '',
		viewActive: false,
		note: {},
		settingsOpen: false,

		// render options
		renderMarkdown: false,
		renderMathjax: false,
		renderHTML: false,
		scrollOnUpdate: false
	},
	created: function() {
		// load in the note list
		this.loadNotes();
		this.socket = io();

		this.socket.on('reload', _ => location.reload());

		this.socket.on('change', this.updateNotes);
	},

	methods: {
		loadNotes: function() {
			this.$http.get('/api/root')
				.then(res => res.json())
				.then(res => this.notes = res.files);
		},
		getNotes: function() {
			var filter = new RegExp(this.search, 'i')
			return this.notes.filter(el => filter.test(el.path));
		},
		updateNotes: function(ev) {
			if (ev.event == 'change') {

				this.displayNote(this.note.path);
			} else {
				this.loadNotes();
			}
		},
		displayNote: function(note) {
			fetch('/api/note' + note)
				.then(res => res.json())
				.then(res => {
					this.note = res;
					var view = document.getElementById('view');
					if (this.scrollOnUpdate) {
						view.scrollTop = view.scrollHeight;
					}
					this.rerenderMathjax();
				});
			this.showNoteView();
		},
		showNoteView: function() {
			this.viewActive = true;
		},
		hideNoteView: function() {
			this.viewActive = false;
		},
		compile: function() {
			if (this.note.raw) {
				if (this.renderMarkdown) {
					return marked(this.note.raw, {
						sanitize: !this.renderHTML
					});
				} else {
					if (this.renderHTML) {
						return this.note.raw;
					}
					var raw = this.note.raw;
					raw = raw.replace('&', '&amp;');
					raw = raw.replace('<', '&lt;');
					raw = raw.replace('>', '&gt;');
					return raw;
				}
			}
		},
		toggleSettings: function() {
			this.settingsOpen = !this.settingsOpen;
		},
		toggleSetting: function(ev) {
			var toggle = ev.target.getAttribute('data-toggles');
			this[toggle] = !this[toggle];

			this.rerenderMathjax();
		},
		scrollToBottom: function(force) {
			var view = document.getElementById('view');
			if (this.scrollOnUpdate || force) {
				view.scrollTop = view.scrollHeight;
			}
		},
		rerenderMathjax: function() {
			if (this.renderMathjax) {
				setTimeout(_ => {
					MathJax.Hub.Queue(['Typeset', MathJax.Hub])
                                        MathJax.Hub.Queue(this.scrollToBottom.bind(this));
				}, 100)
			} else {
				// check if we have anything to do
				if (document.getElementsByClassName('MathJax').length == 0) {

					return;
				}
				// a bit hacky, but it works
				var note = this.note.raw;
				this.note.raw = '';
				try {
					document.getElementById('noterender-raw').innerHTML = '';
				} catch (e) {};
				setTimeout(_ => {
					this.note.raw = note;
				}, 100);
			}
		}
	}

})
