import { CameraResultType, CameraSource } from '@capacitor/camera';
import { Photo as CameraPhoto, Camera } from '@capacitor/camera'
import { Directory as FilesystemDirectory } from '@capacitor/filesystem'
import { useEffect, useState } from 'react';
import { base64FromPath, useFilesystem } from '@ionic/react-hooks/filesystem';
import { useStorage } from '@ionic/react-hooks/storage';

export interface Photo {
    filepath: string;
    webviewPath?: string;
    data?: string;
}

const PHOTO_STORAGE = 'photos';

export function usePhotoGallery() {
    const { get, set } = useStorage();
    const [photos, setPhotos] = useState<Photo[]>([]);

    const takePhoto = async () => {
        let camPhoto = undefined;
        try{
            camPhoto = await Camera.getPhoto({
                resultType: CameraResultType.Uri,
                source: CameraSource.Camera,
                quality: 100
            });
        }catch (e : any){
            // console.log(e);
            return;
        }
        const fileName = new Date().getTime() + '.jpeg';
        const savedFileImage = await savePicture(camPhoto!, fileName);
        const newPhotos = [savedFileImage, ...photos];
        setPhotos(newPhotos);
        return {filepath: savedFileImage.filepath, data: savedFileImage.data};
    };

    const { deleteFile, readFile, writeFile } = useFilesystem();
    const savePicture = async (photo: CameraPhoto, fileName: string): Promise<Photo> => {
        const base64Data = await base64FromPath(photo.webPath!);
        await writeFile({
            path: fileName,
            data: base64Data,
            directory: FilesystemDirectory.Data
        });

        return {
            filepath: fileName,
            webviewPath: photo.webPath,
            data: base64Data
        };
    };


    useEffect(() => {
        const loadSaved = async () => {
            const photosString = await get(PHOTO_STORAGE);
            const photos = (photosString ? JSON.parse(photosString) : []) as Photo[];
            for (let photo of photos) {
                const file = await readFile({
                    path: photo.filepath,
                    directory: FilesystemDirectory.Data
                });
                photo.webviewPath = `data:image/jpeg;base64,${file.data}`;
            }
            setPhotos(photos);
        };
        loadSaved().then();
    }, [get, readFile]);

    const deletePhoto = async (photo: Photo) => {
        if(photo && photo.webviewPath){
            const newPhotos = photos.filter(p => p.filepath !== photo.filepath);
            await set(PHOTO_STORAGE, JSON.stringify(newPhotos));
            const filename = photo.filepath.substr(photo.filepath.lastIndexOf('/') + 1);
            await deleteFile({
                path: filename,
                directory: FilesystemDirectory.Data
            });
            setPhotos(newPhotos);
        }
    };

    return {
        photos,
        takePhoto,
        deletePhoto,
    };
}
