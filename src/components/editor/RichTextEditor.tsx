import { Editor } from '@tinymce/tinymce-react';
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  className?: string;
}

export const RichTextEditor = ({ value, onChange, className }: RichTextEditorProps) => {
  return (
    <div className={cn("w-full border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600", className)}>
      <Editor
        apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
        value={value}
        onEditorChange={onChange}
        init={{
          skin: 'oxide-dark',
          content_css: 'dark',
          height: 500,
          menubar: false,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount',
            'quickbars'
          ],
          toolbar1: 'styles | bold italic underline strikethrough | forecolor backcolor | alignleft aligncenter alignright | bullist numlist | link image media blockquote code',
          toolbar2: 'fontfamily fontsize | outdent indent | removeformat | help',
          toolbar_mode: 'sliding',
          contextmenu: 'link image table',
          content_style: `
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
              font-size: 16px;
              line-height: 1.5;
              color: #1f2937;
              background-color: #f9fafb;
            }
            body.dark-mode {
              color: #e5e7eb;
              background-color: #1f2937;
            }
            .dark-mode a { color: #60a5fa; }
            .dark-mode a:hover { color: #93c5fd; }
          `,
          setup: (editor) => {
            // Add custom buttons or functionality here if needed
            editor.ui.registry.addButton('customimage', {
              icon: 'image',
              tooltip: 'Insert image',
              onAction: () => {
                // Custom image upload handling
                editor.execCommand('mceImage');
              }
            });
          },
          images_upload_handler: async (blobInfo) => {
            // Implement image upload logic here
            return new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.readAsDataURL(blobInfo.blob());
              reader.onload = () => {
                resolve(reader.result as string);
              };
              reader.onerror = (error) => reject(error);
            });
          },
          toolbar_sticky: true,
          toolbar_sticky_offset: 0,
          quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote',
          quickbars_insert_toolbar: 'quickimage quicktable',
          contextmenu: "link image imagetools table spellchecker",
          powerpaste_word_import: 'clean',
          powerpaste_html_import: 'clean',
          content_css: [
            '//fonts.googleapis.com/css?family=Lato:300,300i,400,400i',
            '//www.tiny.cloud/css/codepen.min.css'
          ],
          link_list: [
            { title: 'My page 1', value: 'https://www.tiny.cloud' },
            { title: 'My page 2', value: 'http://www.moxiecode.com' }
          ],
          image_list: [
            { title: 'My page 1', value: 'https://www.tiny.cloud' },
            { title: 'My page 2', value: 'http://www.moxiecode.com' }
          ],
          image_class_list: [
            { title: 'None', value: '' },
            { title: 'Some class', value: 'class-name' }
          ],
          importcss_append: true,
          templates: [
            { title: 'New Table', description: 'creates a new table', content: '<div class="mceTmpl"><table width="98%%"  border="0" cellspacing="0" cellpadding="0"><tr><th scope="col"> </th><th scope="col"> </th></tr><tr><td> </td><td> </td></tr></table></div>' },
            { title: 'Starting my story', description: 'A cure for writers block', content: 'Once upon a time...' },
            { title: 'New list with dates', description: 'New List with dates', content: '<div class="mceTmpl"><span class="cdate">cdate</span><br><span class="mdate">mdate</span><h2>My List</h2><ul><li></li><li></li></ul></div>' }
          ],
          template_cdate_format: '[Date Created (CDATE): %m/%d/%Y : %H:%M:%S]',
          template_mdate_format: '[Date Modified (MDATE): %m/%d/%Y : %H:%M:%S]',
          image_caption: true,
          quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
          noneditable_class: 'mceNonEditable',
          toolbar_mode: 'sliding',
          spellchecker_ignore_list: ['Ephox', 'Moxiecode'],
          tinycomments_mode: 'embedded',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }'
        }}
      />
    </div>
  );
};