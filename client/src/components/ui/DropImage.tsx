import { useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import Compressor from 'compressorjs';
import { CustomFile } from '../settings/UserAvatar';
import { styled, Avatar } from '@mui/material';

const thumbsContainer: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16
};

const thumb: React.CSSProperties = {
    display: 'inline-flex',
    borderRadius: 2,
    border: '1px solid #eaeaea',
    marginBottom: 8,
    marginRight: 8,
    width: '100%',
    height: '100%',
    padding: 4,
    boxSizing: 'border-box'
};

const thumbInner: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    minWidth: 0,
    overflow: 'hidden',
    width: '100%'
};

const StyledSection = styled('section')(({ theme }) => ({
    border: `1px solid ${theme.palette.info.main}`,
    borderRadius: '1.5rem',
    padding: '1rem',
    cursor: 'pointer',
    color: theme.palette.text.primary,
    textAlign: 'center'
}));

export interface IDropImageProps {
    files: CustomFile[];
    setFiles: React.Dispatch<React.SetStateAction<CustomFile[]>>;
    id: string;
    name: string;
    placeholder: string;
}

const DropImage = ({ files, setFiles, id, name, placeholder }: IDropImageProps) => {
    const { getRootProps, getInputProps } = useDropzone({
        maxFiles: 1,
        accept: {
            'image/*': ['.jpeg', '.png']
        },
        onDrop: async (acceptedFiles: File[]) => {
            const compressedImgs: File[] = await Promise.all<File>(
                acceptedFiles.map((file: File) => {
                    return new Promise((resolve, reject) => {
                        new Compressor(file, {
                            quality: 0.6,
                            success: (result: File) => {
                                resolve(result);
                            },
                            error: (error: Error) => {
                                reject(error);
                            }
                        });
                    });
                })
            );
            let compressed = compressedImgs.map((file) => Object.assign(file, { preview: URL.createObjectURL(file) }));
            setFiles(compressed);
        }
    });

    const thumbs = files.map((file) => (
        <div style={thumb} key={file.name}>
            <div style={thumbInner}>
                <Avatar alt={file.name} src={file.preview} sx={{ width: 192, height: 192, mx: 'auto', mt: '1rem' }} />
            </div>
        </div>
    ));

    useEffect(
        () => () => {
            // Make sure to revoke the data uris to avoid memory leaks
            files.forEach((file) => URL.revokeObjectURL(file.preview));
        },
        [files]
    );

    return (
        <StyledSection>
            <div {...getRootProps({ className: 'dropzone' })}>
                <input name={name} id={id} {...getInputProps()} />
                <p>{placeholder}</p>
            </div>
            <aside style={thumbsContainer}>{thumbs}</aside>
        </StyledSection>
    );
};

export default DropImage;
