'use strict';

angular.module('aurora.common')
  .directive('auroraTexteditor', [function() {
      var linker = {
        pre: function (scope, elem, attr) {
          scope.tinymceOptions = {
            trusted: true,
            onChange: function(e) {
              // put logic here for keypress and cut/paste changes
            },
            init_instance_callback: function(editor) {
            //console.log("tinymce init: " + editor.id);
              var myNodeList = document.querySelectorAll(".mce-tinymce .mce-btn");
              [].forEach.call(myNodeList, function(item) {
                item.ontouchend = function(event) {
                  event.stopPropagation();
                };
                item.ontouchstart = function(event) {
                  event.stopPropagation();
                };
              });
            },
            inline: false,
            fontsize_formats: "8pt 10pt 12pt 14pt 18pt 24pt 36pt",
            //http://skin.tinymce.com
            //goto this link and create your custom skin for the editor
            skin_url: 'assets/tinymce-skins/aurora-skin',
            skin: 'aurora-skin',
            //it's modern by default
            theme: 'modern',
            mode: "exact",
            //elements: "textEditor",
            plugins: [
              "advlist autolink autosave link image lists charmap print preview hr anchor pagebreak spellchecker",
              "searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking",
              "table directionality emoticons template paste fullpage textcolor colorpicker textpattern"
            ],
            //here is you can remove whatever you want to
            //resize your tabs, buttons, ...etc
            toolbar1: " undo | redo | styleselect | bold | italic | fontsizeselect | underline | strikethrough | superscript | subscript | bullist | numlist | outdent | indent | visualchars | visualblocks | alignleft | aligncenter | alignright | alignjustify | charmap | hr | insertdatetime | forecolor | backcolor | removeformat " ,
            //change to false if you need to remove the menu bar option
            height : 250,
            menubar: false,
            statusbar: false,
            paste_auto_cleanup_on_paste : true,
            paste_preprocess : function(pl, o) {
              // Content string containing the HTML from the clipboard
            },
            paste_postprocess : function(pl, o) {
              // Content DOM node containing the DOM structure of the clipboard
            },
            //menubar:'edit insert view format table tools',
            //menu:{
            //edit: {title: 'Edit', items: 'undo redo | cut copy paste | selectall | searchreplace'},
            //insert: {title: 'Insert', items: 'charmap hr anchor pagebreak insertdatetime nonbreaking '},
            //view: {title: 'View', items: 'visualchars visualblocks visualaid'},
            //format: {title: 'Format', items: 'bold italic underline strikethrough superscript subscript |forecolor | formats | removeformat'},
            //table: {title: 'Table', items: 'inserttable tableprops deletetable | cell row column'},
            //tools: {title: 'Tools', items: 'spellchecker'}
            //},
            //change your items size
            toolbar_items_size: 'large',

            style_formats: [{
              title: 'Bold text',
              inline: 'b'
            }, {
              title: 'Red text',
              inline: 'span',
              styles: {
                color: '#ff0000'
              }
            }, {
              title: 'Red header',
              block: 'h1',
              styles: {
                color: '#ff0000'
              }
            }, {
              title: 'Example 1',
              inline: 'span',
              classes: 'example1'
            }, {
              title: 'Example 2',
              inline: 'span',
              classes: 'example2'
            }, {
              title: 'Table styles'
            }, {
              title: 'Table row 1',
              selector: 'tr',
              classes: 'tablerow1'
            }],

            templates: [{
              title: 'Test template 1',
              content: 'Test 1'
            }, {
              title: 'Test template 2',
              content: 'Test 2'
            }]
          };
        },
        post: function (scope, elem, attr){

        }
      };
    return {
      restrict: 'E',
      scope: {
        type: '=type'
      },

      link: linker ,
      templateUrl: 'components/common/aurora-texteditor.html'
    }
  }]);
