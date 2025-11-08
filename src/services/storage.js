import { storage } from './firebase'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'

export async function uploadImage(file, destFolder='news') {
  const path = `${destFolder}/${Date.now()}_${file.name}`
  const sref = ref(storage, path)
  const snap = await uploadBytes(sref, file)
  const url = await getDownloadURL(snap.ref)
  return { url, path }
}
