<template>
	<div class="text-left">
		<textarea id="area4CKEditor4" v-model="EditContent"></textarea>
	</div>
</template>

<script>
//
window.CKEDITOR_BASEPATH = '//cdn.ckeditor.com/4.15.0/full-all/'
require('ckeditor4')
//
function InitEditor() {
	let myToolbar = [{ name: 'document', groups: ['mode', 'document', 'doctools'] }, { name: 'clipboard', groups: ['clipboard', 'undo'] }, { name: 'editing', groups: ['find', 'selection', 'spellchecker', 'editing'] }, { name: 'forms', groups: ['forms'] }, '/', { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] }, { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph'] }, { name: 'links', groups: ['links'] }, { name: 'insert', groups: ['insert'] }, '/', { name: 'styles', groups: ['styles'] }, { name: 'colors', groups: ['colors'] }, { name: 'tools', groups: ['tools'] }, { name: 'others', groups: ['others'] }, { name: 'about', groups: ['about'] }]
	let mySkin = 'moono'
	let theEditor = CKEDITOR.replace('area4CKEditor4', {
		height: '500px',
		toolbarGroups: myToolbar,
		skin: mySkin,
		allowedContent: true,
		on: {
			instanceReady: function(instance) {
				// 加入 bootstrap css
				let cssPath = '//stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css'
				if(typeof instance.editor.config.contentsCss === 'string') {
					instance.editor.config.contentsCss = [ instance.editor.config.contentsCss ]
				}
				instance.editor.config.contentsCss.push(cssPath)
			},
		},
	})
	CKEDITOR.config.removePlugins = 'resize'
}

export default {
	name: 'RTE3',
	props: {
		EditContent: { type: String, default: '' }
	},
	data() {
		return {
			TheContent: this.EditContent
		}
	},
	methods: {
		emptyEditor() {
			CKEDITOR.instances.area4CKEditor4.setData('')
		},
		GetEditorData() {
			return CKEDITOR.instances.area4CKEditor4.getData()
		},
	},
	mounted() {
		InitEditor()
	}
}
</script>
