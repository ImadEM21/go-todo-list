import JoditEditor from 'jodit-react';
import React, { memo, useRef } from 'react';
import 'jodit/build/jodit.min.css';

export interface IEditorProps {
    description: string;
    setDescription: React.Dispatch<React.SetStateAction<string>>;
}

const Editor = ({ description, setDescription }: IEditorProps) => {
    const editor = useRef(null);
    const config = {
        enableDragAndDropFileToEditor: true,
        uploader: {
            insertImageAsBase64URI: true
        },
        link: {
            openInNewTabCheckbox: true
        },
        language: 'fr',
        placeholder: 'Description de la tâche...',
        readonly: false
    };

    return <JoditEditor config={config} ref={editor} value={description} onBlur={(newContent) => setDescription(newContent)} onChange={(newContent) => {}} />;
};

export default memo(Editor);
