// hooks/useProfilePhoto.js
import { useState, useCallback } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const useProfilePhoto = () => {
  const [photoURL, setPhotoURL] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const storage = getStorage()
  
  const fetchPhotoURL = useCallback(async (uid) => {
    setLoading(true);
    setError(null);
    try {
      const fileRef = ref(storage, `profile-photos/${uid}`);
      const url = await getDownloadURL(fileRef);
      setPhotoURL(url);
      return url;
    } catch (err) {
      setError(err.message);
      setPhotoURL(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadPhoto = useCallback(async (uid, file) => {
    setLoading(true);
    setError(null);
    try {
      const fileRef = ref(storage, `profile-photos/${uid}`);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      setPhotoURL(url);
      return url;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { photoURL, fetchPhotoURL, uploadPhoto, loading, error };
};
