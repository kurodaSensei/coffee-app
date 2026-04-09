import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'

export const useStorageUpload = () => {
  const { $storage } = useNuxtApp()

  const uploadPhoto = async (file: File, path: string): Promise<string> => {
    const fileRef = storageRef($storage, `${path}/${Date.now()}_${file.name}`)
    const snapshot = await uploadBytes(fileRef, file)
    return getDownloadURL(snapshot.ref)
  }

  const deletePhoto = async (url: string): Promise<void> => {
    const fileRef = storageRef($storage, url)
    await deleteObject(fileRef)
  }

  return {
    uploadPhoto,
    deletePhoto,
  }
}
