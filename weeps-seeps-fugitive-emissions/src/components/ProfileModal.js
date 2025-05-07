import React, { useEffect, useState } from 'react';
import { Modal, Button, ListGroup, Form, Spinner, Image } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { getAuth, updateProfile } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import './LoginModal.css';
import { useToast } from '../contexts/ToastContext';
import placeholderImage from '../assets/avatar.jpg'; // adjust path if needed

const ProfileModal = ({ show, onHide }) => {
  const { user, isAdmin, isSuperuser, loading } = useAuth();
  const { showToast } = useToast();

  const [newName, setNewName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (user) {
      setNewName(user.displayName || '');
      setPhotoURL(user.photoURL || '');
    }
  }, [user]);

  useEffect(() => {
    if (user && !loading) {
      user.getIdTokenResult(true).then((tokenResult) => {
        console.log("🔐 Firebase claims object:", tokenResult.claims);
      });
    }
  }, [user, loading]);

  const handleSave = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    try {
      await updateProfile(user, {
        displayName: newName,
        photoURL: photoURL || null,
      });
      showToast("Profile updated successfully.", "success", "Profile Updated");
    } catch (error) {
      console.error("Failed to update profile:", error);
      showToast("Could not update profile. Try again.", "danger", "Update Error");
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (file) => {
    if (!file || !user) return;
    setUploading(true);
    try {
      const storage = getStorage();
      const fileRef = ref(storage, `avatars/${user.uid}.jpg`);
      await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(fileRef);
      await updateProfile(user, { photoURL: downloadURL });
      setPhotoURL(downloadURL);
      showToast("Profile picture updated!", "success", "Photo Uploaded");
    } catch (err) {
      console.error("Upload error:", err);
      showToast("Failed to upload image.", "danger", "Upload Error");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteAvatar = async () => {
    if (!user || !user.photoURL) return;
    setDeleting(true);
    try {
      const storage = getStorage();
      const fileRef = ref(storage, `avatars/${user.uid}.jpg`);
      await deleteObject(fileRef); // delete from storage
      await updateProfile(user, { photoURL: null }); // clear from auth
      setPhotoURL('');
      showToast("Avatar deleted successfully.", "success", "Image Removed");
    } catch (err) {
      console.error("Delete avatar error:", err);
      showToast("Failed to delete avatar.", "danger", "Deletion Failed");
    } finally {
      setDeleting(false);
    }
  };

  if (!user) return null;

  return (
    <Modal show={show} onHide={onHide} centered animation="true" className="login-modal">
      <Modal.Header closeButton>
        <Modal.Title>User Profile</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* Profile Photo */}
        <div className="text-center mb-3">
  <Image
    src={photoURL || placeholderImage}
    onError={(e) => {
      e.target.onerror = null;
      e.target.src = placeholderImage;
    }}
    alt="Profile"
    roundedCircle
    width={140} // ← Increased size
    height={140} // ← Increased size
    style={{
      objectFit: 'cover',
      border: '3px solid #ddd',
      boxShadow: '0 0 10px rgba(255,255,255,0.1)',
    }}
  />
</div>

        {/* User Info */}
        <ListGroup variant="flush" className="text-white fs-6 mb-3">
          <ListGroup.Item className="bg-transparent border-0">
            <strong>Email:</strong> {user.email}
          </ListGroup.Item>
          <ListGroup.Item className="bg-transparent border-0">
            <strong>User ID:</strong> {user.uid}
          </ListGroup.Item>
          <ListGroup.Item className="bg-transparent border-0">
            <strong>Role:</strong> {isSuperuser ? "Superuser" : isAdmin ? "Admin" : "Standard User"}
          </ListGroup.Item>
        </ListGroup>

        {/* Editable Fields */}
        <Form>
          <Form.Group className="mb-3">
            <Form.Label className="text-white">Display Name</Form.Label>
            <Form.Control
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              disabled={saving}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="text-white">Upload New Profile Photo</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) => handlePhotoUpload(e.target.files[0])}
              disabled={uploading}
            />
            {uploading && <Spinner animation="border" size="sm" className="mt-2" />}
          </Form.Group>

          <div className="d-flex gap-2 flex-wrap">
            <Button variant="primary" onClick={handleSave} disabled={saving}>
              {saving ? <Spinner animation="border" size="sm" /> : "Save Changes"}
            </Button>
            {photoURL && (
              <Button
                variant="outline-danger"
                onClick={handleDeleteAvatar}
                disabled={deleting}
              >
                {deleting ? <Spinner animation="border" size="sm" /> : "Delete Avatar"}
              </Button>
            )}
          </div>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={saving || uploading || deleting}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProfileModal;
