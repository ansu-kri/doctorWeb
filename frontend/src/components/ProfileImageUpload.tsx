import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { FiImage, FiTrash2 } from "react-icons/fi";
import { useDeleteMeProfileImageMutation } from "../app/auth/authApi";
import api from "../app/api";
import { mediaUrl } from "../utils/assets";
import { uploadFormDataWithProgress, validateImageFile } from "../utils/imageUpload";
import type { User } from "../app/auth/authApi";

interface ProfileImageUploadProps {
  profilePic?: string;
  onUploaded?: (user: User) => void;
}

interface ProfileImageResponse {
  success: boolean;
  data: User;
  warning?: string;
}

const ProfileImageUpload = ({
  profilePic,
  onUploaded,
}: ProfileImageUploadProps) => {
  const [preview, setPreview] = useState("");
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef("");
  const dispatch = useDispatch();
  const [deleteImage, { isLoading: deleting }] = useDeleteMeProfileImageMutation();

  useEffect(
    () => () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    },
    [],
  );

  const clearPreview = () => {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    previewRef.current = "";
    setPreview("");
  };

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    const validationError = validateImageFile(file);
    if (validationError) {
      toast.error(validationError);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    clearPreview();
    previewRef.current = URL.createObjectURL(file);
    setPreview(previewRef.current);
    setProgress(0);
    setUploading(true);

    const formData = new FormData();
    formData.append("profilePic", file);
    try {
      const response = await uploadFormDataWithProgress<ProfileImageResponse>(
        "/api/me",
        formData,
        setProgress,
        "PATCH",
      );
      dispatch(api.util.invalidateTags(["Auth"]));
      onUploaded?.(response.data);
      if (response.warning) toast.warning(response.warning);
      else toast.success("Profile photo updated.");
      clearPreview();
    } catch (error) {
      clearPreview();
      toast.error(error instanceof Error ? error.message : "Image upload failed.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleDelete = async () => {
    if (!profilePic || !window.confirm("Remove your profile photo?")) return;
    try {
      const response = await deleteImage().unwrap();
      onUploaded?.(response.data);
      if (response.warning) toast.warning(response.warning);
      else toast.success("Profile photo removed.");
    } catch (error) {
      const message =
        typeof error === "object" &&
        error !== null &&
        "data" in error &&
        typeof error.data === "object" &&
        error.data !== null &&
        "message" in error.data &&
        typeof error.data.message === "string"
          ? error.data.message
          : "Unable to remove profile photo.";
      toast.error(message);
    }
  };

  const image = preview || mediaUrl(profilePic);

  return (
    <div className="flex flex-wrap items-center gap-4">
      {image ? (
        <img
          src={image}
          alt="Profile"
          className="h-16 w-16 rounded-full border border-slate-200 object-cover"
        />
      ) : (
        <span className="grid h-16 w-16 place-items-center rounded-full bg-slate-100 text-slate-400">
          <FiImage size={24} aria-hidden="true" />
        </span>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap gap-2">
          <label className="inline-flex cursor-pointer items-center rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            {uploading ? "Uploading…" : "Change photo"}
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              className="sr-only"
              disabled={uploading || deleting}
              onChange={(event) => void handleFile(event.target.files?.[0])}
            />
          </label>
          {profilePic && (
            <button
              type="button"
              onClick={() => void handleDelete()}
              disabled={uploading || deleting}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              <FiTrash2 size={16} aria-hidden="true" />
              {deleting ? "Removing…" : "Remove"}
            </button>
          )}
        </div>
        <p className="mt-1 text-xs text-slate-500">JPEG, PNG, GIF, or WebP · up to 2 MB</p>
        {uploading && (
          <div
            className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"
            role="progressbar"
            aria-label="Profile photo upload progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
          >
            <div
              className="h-full rounded-full bg-[#2563EB] transition-[width]"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileImageUpload;
